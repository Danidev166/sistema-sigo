// backend/config/db.js — PostgreSQL con interfaz tipo mssql
const { Pool } = require("pg");
// scripts/seed.js
const isAzure = !!process.env.WEBSITE_SITE_NAME;
const envFile = (process.env.NODE_ENV === 'production' || isAzure) ? '.env.production' : '.env';
require('dotenv').config({ path: envFile });

/* ========================= Helpers ========================= */
function bool(v, def = false) {
  if (v === undefined) return def;
  return ["1", "true", "yes", "on"].includes(String(v).toLowerCase());
}

/* ==================== Configuración PG ===================== */
function buildPgConfig() {
  // Opción 1: DATABASE_URL (recomendada)
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      // Usa SSL sólo si PG_SSL=true (o si tu proveedor lo requiere)
      ssl: bool(process.env.PG_SSL, false) ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.PG_POOL_MAX || "10", 10),
      idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || "30000", 10),
    };
  }

  // Opción 2: variables sueltas PG_*
  const host = process.env.PGHOST || "localhost";
  const port = parseInt(process.env.PGPORT || "5432", 10);
  return {
    host,
    port,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: bool(process.env.PG_SSL, false) ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.PG_POOL_MAX || "10", 10),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || "30000", 10),
  };
}

/* ============= Compilador @param -> $1, $2, ... ============= */
function compileQuery(text, params = {}) {
  const values = [];
  const seen = new Map();
  const replaced = text.replace(/@([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
    if (!Object.prototype.hasOwnProperty.call(params, name)) {
      throw new Error(`Falta el parámetro @${name}`);
    }
    if (!seen.has(name)) {
      seen.set(name, values.length + 1);
      values.push(params[name]);
    }
    return `$${seen.get(name)}`;
  });
  return { text: replaced, values };
}

/* ===================== Ejecutor de query ==================== */
async function runQuery(poolOrClient, text, params) {
  const { text: q, values } = params
    ? compileQuery(text, params)
    : { text, values: [] };
  const res = await poolOrClient.query(q, values);
  // Formato parecido a mssql
  return {
    recordset: res.rows,
    rowsAffected: [res.rowCount],
    rows: res.rows,
    rowCount: res.rowCount,
  };
}

/* ======================= Pool único ======================== */
let _pgPool = null;
async function _ensurePool() {
  if (_pgPool) return _pgPool;
  _pgPool = new Pool(buildPgConfig());
  await _pgPool.query("SELECT 1"); // prueba rápida
  console.log("✅ Pool PostgreSQL listo");
  _pgPool.on("error", (err) => {
    console.error("❌ Error en pool de Postgres:", err);
  });
  return _pgPool;
}

/* ========== Shim tipo mssql: request().input().query() ======= */
class RequestShim {
  constructor(binding) {
    // binding: { client? , pool? }
    this._client = binding?.client || null;
    this._pool = binding?.pool || null;
    this._params = {};
  }
  input(name, typeOrVal, maybeVal) {
    // compat mssql: si hay 3 args, el 3ro es el valor; el 2do (tipo) se ignora
    const val = arguments.length === 3 ? maybeVal : typeOrVal;
    this._params[name] = val;
    return this;
  }
  async query(text) {
    const executor = this._client || this._pool;
    if (!executor) throw new Error("No hay pool ni client asociado");
    const res = await runQuery(executor, text, this._params);
    this._params = {}; // limpia para siguiente uso
    return res;
  }
}

/* ===================== Transacciones ======================== */
class TransactionShim {
  constructor(pool) {
    this.pool = pool;
    this.client = null;
    this.active = false;
  }
  async begin() {
    if (this.active) throw new Error("Transacción ya iniciada");
    this.client = await this.pool.connect();
    try {
      await this.client.query("BEGIN");
      this.active = true;
    } catch (e) {
      this.client.release();
      this.client = null;
      throw e;
    }
  }
  request() {
    if (!this.active || !this.client) {
      throw new Error("Transacción no iniciada");
    }
    return new RequestShim({ client: this.client });
  }
  async commit() {
    if (!this.active || !this.client) return;
    try {
      await this.client.query("COMMIT");
    } finally {
      this.client.release();
      this.client = null;
      this.active = false;
    }
  }
  async rollback() {
    if (!this.active || !this.client) return;
    try {
      await this.client.query("ROLLBACK");
    } finally {
      this.client.release();
      this.client = null;
      this.active = false;
    }
  }
}

/* ===================== API pública ========================== */
async function getPool() {
  const pool = await _ensurePool();
  return {
    request: () => new RequestShim({ pool }),
    transaction: () => new TransactionShim(pool),
    raw: pool, // acceso directo al Pool nativo
  };
}

// atajo: ejecutar query directa sin construir RequestShim
async function query(text, params) {
  const pool = await _ensurePool();
  return runQuery(pool, text, params);
}

async function closePool() {
  if (_pgPool) {
    await _pgPool.end();
    _pgPool = null;
  }
}

/* ============ Tipos "sql.*" compatibles (no-op) =============
   Permiten llamadas como sql.NVarChar(255) o sql.Int().
   No se usan realmente en PG, pero evitan errores en modelos viejos. */
const sql = {
  VarChar:        (..._args) => "text",
  NVarChar:       (..._args) => "text",
  Int:            (..._args) => "int4",
  BigInt:         (..._args) => "int8",
  Bit:            (..._args) => "bool",
  DateTime:       (..._args) => "timestamptz",
  Date:           (..._args) => "date",
  Float:          (..._args) => "float8",
  Decimal:        (..._args) => "numeric",
  UniqueIdentifier:(..._args) => "uuid",
};

/* ======================= Selftest =========================== */
async function selftest() {
  try {
    const r = await query("SELECT 1 AS ok");
    console.log("🟢 DB ok →", r.recordset[0]);
  } catch (e) {
    console.error("🔴 DB fail →", e.message);
    throw e;
  }
}

module.exports = {
  sql,
  getPool,
  query,
  closePool,
  selftest,
  compileQuery,
};
