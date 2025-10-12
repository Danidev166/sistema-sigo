const { getPool } = require('./config/db');

async function debugComunicacionFamilia() {
    try {
        console.log('🔍 Debugging Comunicación Familia...\n');
        
        const pool = await getPool();
        
        // Verificar usuario actual
        console.log('📋 Usuario actual de la aplicación:');
        const userResult = await pool.raw.query('SELECT current_user, session_user');
        console.log('  Usuario:', userResult.rows[0]);
        
        // Verificar si la tabla existe
        console.log('\n📋 Verificando tabla:');
        const tableResult = await pool.raw.query(`
            SELECT table_name, table_schema 
            FROM information_schema.tables 
            WHERE table_name = 'comunicacion_familia'
        `);
        console.log('  Tabla existe:', tableResult.rows.length > 0);
        
        // Verificar permisos específicos
        console.log('\n📋 Verificando permisos:');
        const permResult = await pool.raw.query(`
            SELECT privilege_type, is_grantable
            FROM information_schema.table_privileges 
            WHERE table_name = 'comunicacion_familia' 
            AND grantee = current_user
        `);
        console.log('  Permisos:', permResult.rows);
        
        // Probar consulta directa
        console.log('\n📋 Probando consulta directa:');
        try {
            const testResult = await pool.raw.query(`
                SELECT cf.*, e.nombre, e.apellido, e.rut, e.email_apoderado, e.nombre_apoderado
                FROM comunicacion_familia cf
                LEFT JOIN estudiantes e ON cf.id_estudiante = e.id
                WHERE cf.id_estudiante = 8
                ORDER BY cf.fecha_comunicacion DESC, cf.id DESC
            `);
            console.log('  ✅ Consulta directa funciona:', testResult.rows.length, 'registros');
        } catch (error) {
            console.log('  ❌ Consulta directa falla:', error.message);
        }
        
        // Probar el modelo
        console.log('\n📋 Probando modelo:');
        try {
            const model = require('./models/comunicacionFamiliaModel');
            const modelResult = await model.obtenerPorEstudiante('8');
            console.log('  ✅ Modelo funciona:', modelResult.length, 'registros');
        } catch (error) {
            console.log('  ❌ Modelo falla:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugComunicacionFamilia();
