const { getPool } = require('./config/db');
const { buscarPorEmail } = require('./models/authModel');

async function testDatabaseConnection() {
  console.log('🔍 PROBANDO CONEXIÓN A BASE DE DATOS');
  console.log('====================================\n');

  try {
    // 1. Probar conexión básica
    console.log('1️⃣ Probando conexión básica...');
    const pool = await getPool();
    console.log('✅ Pool obtenido correctamente');

    // 2. Probar query simple
    console.log('\n2️⃣ Probando query simple...');
    const result = await pool.request()
      .query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Query ejecutado correctamente');
    console.log('Hora actual:', result.recordset[0].current_time);
    console.log('Versión PostgreSQL:', result.recordset[0].pg_version);

    // 3. Probar tabla usuarios
    console.log('\n3️⃣ Probando tabla usuarios...');
    const usuariosResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM usuarios');
    
    console.log('✅ Tabla usuarios accesible');
    console.log('Total usuarios:', usuariosResult.recordset[0].total);

    // 4. Probar función buscarPorEmail
    console.log('\n4️⃣ Probando función buscarPorEmail...');
    const usuario = await buscarPorEmail('daniel1822@gmail.com');
    
    if (usuario) {
      console.log('✅ Usuario encontrado:');
      console.log('  - ID:', usuario.id);
      console.log('  - Nombre:', usuario.nombre);
      console.log('  - Email:', usuario.email);
      console.log('  - Rol:', usuario.rol);
      console.log('  - Estado:', usuario.estado);
    } else {
      console.log('❌ Usuario no encontrado');
    }

    // 5. Probar con email que no existe
    console.log('\n5️⃣ Probando con email inexistente...');
    const usuarioInexistente = await buscarPorEmail('noexiste@test.com');
    console.log('Resultado:', usuarioInexistente ? 'Encontrado' : 'No encontrado (correcto)');

    console.log('\n🎉 TODAS LAS PRUEBAS EXITOSAS');
    console.log('La base de datos está funcionando correctamente');

  } catch (error) {
    console.log('❌ ERROR EN PRUEBAS:');
    console.log('Mensaje:', error.message);
    console.log('Stack:', error.stack);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n🚨 PROBLEMA: Credenciales de base de datos incorrectas');
    } else if (error.message.includes('Connection timeout')) {
      console.log('\n🚨 PROBLEMA: Timeout de conexión');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🚨 PROBLEMA: Host de base de datos no encontrado');
    } else if (error.message.includes('relation "usuarios" does not exist')) {
      console.log('\n🚨 PROBLEMA: Tabla usuarios no existe');
    }
  }
}

testDatabaseConnection().catch(console.error);
