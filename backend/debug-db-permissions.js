const { getPool } = require('./config/db');

async function debugDbPermissions() {
    try {
        console.log('🔍 Verificando permisos de base de datos...\n');
        
        const pool = await getPool();
        
        // Verificar usuario actual
        console.log('📋 Usuario actual:');
        const userResult = await pool.raw.query('SELECT current_user, session_user');
        console.log('  Usuario:', userResult.rows[0]);
        
        // Verificar si la tabla existe
        console.log('\n📋 Verificando tabla comunicacion_familia:');
        const tableResult = await pool.raw.query(`
            SELECT table_name, table_schema 
            FROM information_schema.tables 
            WHERE table_name = 'comunicacion_familia'
        `);
        console.log('  Tabla encontrada:', tableResult.rows.length > 0);
        if (tableResult.rows.length > 0) {
            console.log('  Detalles:', tableResult.rows[0]);
        }
        
        // Verificar permisos en la tabla
        console.log('\n📋 Verificando permisos:');
        const permResult = await pool.raw.query(`
            SELECT privilege_type, is_grantable
            FROM information_schema.table_privileges 
            WHERE table_name = 'comunicacion_familia' 
            AND grantee = current_user
        `);
        console.log('  Permisos del usuario actual:', permResult.rows);
        
        // Verificar si podemos hacer SELECT
        console.log('\n📋 Probando SELECT:');
        try {
            const testResult = await pool.raw.query('SELECT COUNT(*) FROM comunicacion_familia');
            console.log('  ✅ SELECT funciona:', testResult.rows[0]);
        } catch (error) {
            console.log('  ❌ SELECT falla:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugDbPermissions();
