const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false, // Cambiado a false para conexiones locales
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionTimeout: 30000, // 30 segundos
    requestTimeout: 30000, // 30 segundos
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

// Log de configuración para debugging
console.log("🔧 Configuración de base de datos:");
console.log("   Servidor:", config.server);
console.log("   Puerto:", config.port);
console.log("   Base de datos:", config.database);
console.log("   Usuario:", config.user);
console.log("   Encriptación:", config.options.encrypt);

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Conectado a SQL Server");
    return pool;
  })
  .catch(err => {
    console.log("❌ Error de conexión a la base de datos:");
    console.log("   Código:", err.code);
    console.log("   Mensaje:", err.message);
    console.log("   Error original:", err.originalError);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};
