const { getPool } = require('./config/db');

async function checkUsuariosTable() {
  console.log('🔍 VERIFICANDO TABLA USUARIOS');
  console.log('=============================\n');

  try {
    const pool = await getPool();
    
    // 1. Verificar estructura de la tabla
    console.log('1️⃣ Verificando estructura de la tabla usuarios...');
    const structureResult = await pool.request()
      .query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        ORDER BY ordinal_position
      `);
    
    console.log('✅ Estructura de la tabla usuarios:');
    structureResult.recordset.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // 2. Contar usuarios totales
    console.log('\n2️⃣ Contando usuarios totales...');
    const countResult = await pool.request()
      .query('SELECT COUNT(*) as total FROM usuarios');
    
    console.log('Total usuarios:', countResult.recordset[0].total);

    // 3. Ver usuarios con emails
    console.log('\n3️⃣ Verificando usuarios con emails...');
    const emailResult = await pool.request()
      .query(`
        SELECT id, nombre, apellido, email, rol, estado
        FROM usuarios 
        WHERE email IS NOT NULL AND email != ''
        ORDER BY id
        LIMIT 10
      `);
    
    console.log(`Usuarios con email (mostrando ${emailResult.recordset.length}):`);
    emailResult.recordset.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Nombre: ${user.nombre} ${user.apellido}, Rol: ${user.rol}, Estado: ${user.estado}`);
    });

    // 4. Buscar específicamente el email de prueba
    console.log('\n4️⃣ Buscando email específico: daniel1822@gmail.com...');
    const specificResult = await pool.request()
      .input('email', 'daniel1822@gmail.com')
      .query(`
        SELECT id, nombre, apellido, email, password, rol, estado
        FROM usuarios
        WHERE LOWER(email) = LOWER(@email)
      `);
    
    if (specificResult.recordset.length > 0) {
      const user = specificResult.recordset[0];
      console.log('✅ Usuario encontrado:');
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Nombre: ${user.nombre} ${user.apellido}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Rol: ${user.rol}`);
      console.log(`  - Estado: ${user.estado}`);
      console.log(`  - Password hash: ${user.password ? 'Presente' : 'Ausente'}`);
    } else {
      console.log('❌ Usuario daniel1822@gmail.com NO encontrado');
      
      // Buscar variaciones
      console.log('\n🔍 Buscando variaciones del email...');
      const variations = [
        'daniel1822@gmail.com',
        'DANIEL1822@GMAIL.COM',
        'Daniel1822@gmail.com',
        'daniel1822@GMAIL.COM'
      ];
      
      for (const variation of variations) {
        const varResult = await pool.request()
          .input('email', variation)
          .query(`
            SELECT id, email
            FROM usuarios
            WHERE email = @email
          `);
        
        if (varResult.recordset.length > 0) {
          console.log(`✅ Encontrado con: ${variation}`);
        } else {
          console.log(`❌ No encontrado con: ${variation}`);
        }
      }
    }

    // 5. Verificar si hay problemas con LOWER()
    console.log('\n5️⃣ Probando búsqueda con LOWER()...');
    const lowerResult = await pool.request()
      .input('email', 'daniel1822@gmail.com')
      .query(`
        SELECT id, email
        FROM usuarios
        WHERE LOWER(email) = LOWER(@email)
      `);
    
    console.log(`Resultados con LOWER(): ${lowerResult.recordset.length}`);

  } catch (error) {
    console.log('❌ ERROR:');
    console.log('Mensaje:', error.message);
    console.log('Stack:', error.stack);
  }
}

checkUsuariosTable().catch(console.error);
