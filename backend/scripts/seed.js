// scripts/seed.js
const bcrypt = require("bcrypt");
const { getPool } = require("../config/db");

const log = (...a) => console.log("•", ...a);

async function upsertUsuarioAdmin(pool) {
  const req = () => pool.request();
  const pass = process.env.SEED_ADMIN_PASS || "Admin123!";
  const hash = await bcrypt.hash(pass, parseInt(process.env.BCRYPT_ROUNDS || "12", 10));

  const r = await req()
    .input("nombre", "Admin")
    .input("apellido", "SIGO")
    .input("rut", "11.111.111-1")
    .input("email", "admin@tu-liceo.cl")
    .input("password", hash)
    .input("rol", "Admin")
    .query(`
      INSERT INTO usuarios (nombre, apellido, rut, email, password, rol, estado)
      VALUES (@nombre, @apellido, @rut, @email, @password, @rol, 'Activo')
      ON CONFLICT (email) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        apellido = EXCLUDED.apellido,
        password = EXCLUDED.password,
        rol = EXCLUDED.rol,
        estado = 'Activo',
        fecha_creacion = usuarios.fecha_creacion
      RETURNING id, email;
    `);
  log("Usuario admin listo:", r.recordset[0].email, "(pass:", pass, ")");
}

async function upsertConfiguracionSistema(pool) {
  const req = () => pool.request();
  const rows = [
    { clave: "app.nombre", valor: "SIGO PRO", tipo: "string", descripcion: "Nombre de la aplicación" },
    { clave: "app.entidad", valor: "Liceo Politécnico Bicentenario Caupolicán", tipo: "string", descripcion: "Nombre del liceo" },
    { clave: "reportes.footer", valor: "Generado por SIGO PRO", tipo: "string", descripcion: "Pie de página de reportes" },
  ];
  for (const r of rows) {
    await req()
      .input("clave", r.clave)
      .input("valor", r.valor)
      .input("tipo", r.tipo)
      .input("descripcion", r.descripcion)
      .query(`
        INSERT INTO configuracion_sistema (clave, valor, tipo, descripcion)
        VALUES (@clave, @valor, @tipo, @descripcion)
        ON CONFLICT (clave) DO UPDATE SET
          valor = EXCLUDED.valor,
          tipo = EXCLUDED.tipo,
          descripcion = EXCLUDED.descripcion,
          fecha_modificacion = NOW();
      `);
  }
  log("Configuración del sistema lista");
}

async function upsertConfiguracionCursosEspecialidades(pool) {
  const req = () => pool.request();

  const cursos = ["1°A", "1°B", "2°A", "2°B", "3°A", "3°B", "4°A", "4°B"];
  for (const c of cursos) {
    await req()
      .input("tipo", "curso")
      .input("clave", c)
      .input("valor", c)
      .query(`
        INSERT INTO configuracion (tipo, clave, valor, descripcion)
        VALUES (@tipo, @clave, @valor, 'Curso disponible')
        ON CONFLICT (tipo, clave) DO UPDATE SET
          valor = EXCLUDED.valor,
          descripcion = EXCLUDED.descripcion,
          fecha_modificacion = NOW();
      `);
  }

  const especialidades = ["Electricidad", "Mecánica", "Programación", "Administración"];
  for (const e of especialidades) {
    await req()
      .input("tipo", "especialidad")
      .input("clave", e)
      .input("valor", e)
      .query(`
        INSERT INTO configuracion (tipo, clave, valor, descripcion)
        VALUES (@tipo, @clave, @valor, 'Especialidad disponible')
        ON CONFLICT (tipo, clave) DO UPDATE SET
          valor = EXCLUDED.valor,
          descripcion = EXCLUDED.descripcion,
          fecha_modificacion = NOW();
      `);
  }

  log("Cursos y especialidades listos");
}

async function upsertPermisos(pool) {
  const req = () => pool.request();

  const fullCrud = ["crear", "leer", "actualizar", "eliminar"];
  const modulosAdmin = [
    "usuarios","estudiantes","evaluaciones","entrevistas","agenda",
    "historial-academico","reportes","seguimiento","asistencia",
    "seguimiento-academico","comunicacion-familia","intervenciones","conducta",
    "configuracion","alertas","seguimiento-psicosocial","comunicacion-interna",
    "configuracion-sistema","logs-actividad","notificaciones",
    "permisos-roles","plantillas-reportes","seguimiento-cronologico","recursos","entregas","movimientos"
  ];

  // Admin: todo permitido
  for (const modulo of modulosAdmin) {
    for (const accion of fullCrud) {
      await req()
        .input("rol", "Admin")
        .input("modulo", modulo)
        .input("accion", accion)
        .input("permitido", true)
        .query(`
          INSERT INTO permisos_roles (rol, modulo, accion, permitido)
          VALUES (@rol, @modulo, @accion, @permitido)
          ON CONFLICT (rol, modulo, accion) DO UPDATE SET
            permitido = EXCLUDED.permitido;
        `);
    }
  }

  // Orientador: lectura/creación/actualización en módulos clave
  const modulosOri = ["estudiantes","entrevistas","seguimiento","asistencia","seguimiento-academico","reportes"];
  const accionesOri = ["leer","crear","actualizar"];
  for (const modulo of modulosOri) {
    for (const accion of accionesOri) {
      await req()
        .input("rol", "Orientador")
        .input("modulo", modulo)
        .input("accion", accion)
        .input("permitido", true)
        .query(`
          INSERT INTO permisos_roles (rol, modulo, accion, permitido)
          VALUES (@rol, @modulo, @accion, @permitido)
          ON CONFLICT (rol, modulo, accion) DO UPDATE SET
            permitido = EXCLUDED.permitido;
        `);
    }
  }

  // Asistente Social: similar
  const modulosAS = ["estudiantes","seguimiento","seguimiento-psicosocial","asistencia","reportes"];
  for (const modulo of modulosAS) {
    for (const accion of accionesOri) {
      await req()
        .input("rol", "Asistente Social")
        .input("modulo", modulo)
        .input("accion", accion)
        .input("permitido", true)
        .query(`
          INSERT INTO permisos_roles (rol, modulo, accion, permitido)
          VALUES (@rol, @modulo, @accion, @permitido)
          ON CONFLICT (rol, modulo, accion) DO UPDATE SET
            permitido = EXCLUDED.permitido;
        `);
    }
  }

  log("Permisos por rol listos");
}

async function main() {
  const pool = await getPool();
  await upsertUsuarioAdmin(pool);
  await upsertConfiguracionSistema(pool);
  await upsertConfiguracionCursosEspecialidades(pool);
  await upsertPermisos(pool);
  log("✅ Seed completado");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed falló:", e);
  process.exit(1);
});
