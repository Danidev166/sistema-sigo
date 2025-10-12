const { query } = require('./config/db');

async function testTabsEndpoints() {
    try {
        console.log('🧪 Probando endpoints de tabs de estudiantes...\n');
        
        // 1. Verificar que existan estudiantes
        const estudiantes = await query('SELECT id, nombre, apellido FROM estudiantes LIMIT 3');
        console.log('📊 Estudiantes disponibles:');
        estudiantes.recordset.forEach(est => {
            console.log(`  - ID: ${est.id}, Nombre: ${est.nombre} ${est.apellido}`);
        });
        
        if (estudiantes.recordset.length === 0) {
            console.log('❌ No hay estudiantes en la base de datos');
            return;
        }
        
        const estudianteId = estudiantes.recordset[0].id;
        console.log(`\n🔍 Probando con estudiante ID: ${estudianteId}\n`);
        
        // 2. Probar tabla conducta
        console.log('📋 Probando tabla conducta...');
        try {
            const conducta = await query('SELECT * FROM conducta WHERE id_estudiante = @id LIMIT 3', { id: estudianteId });
            console.log(`  ✅ Conducta: ${conducta.recordset.length} registros encontrados`);
            if (conducta.recordset.length > 0) {
                console.log('  📄 Ejemplo:', JSON.stringify(conducta.recordset[0], null, 2));
            }
        } catch (error) {
            console.log(`  ❌ Error en conducta: ${error.message}`);
        }
        
        // 3. Probar tabla intervenciones
        console.log('\n📋 Probando tabla intervenciones...');
        try {
            const intervenciones = await query('SELECT * FROM intervenciones WHERE id_estudiante = @id LIMIT 3', { id: estudianteId });
            console.log(`  ✅ Intervenciones: ${intervenciones.recordset.length} registros encontrados`);
            if (intervenciones.recordset.length > 0) {
                console.log('  📄 Ejemplo:', JSON.stringify(intervenciones.recordset[0], null, 2));
            }
        } catch (error) {
            console.log(`  ❌ Error en intervenciones: ${error.message}`);
        }
        
        // 4. Probar tabla entrevistas
        console.log('\n📋 Probando tabla entrevistas...');
        try {
            const entrevistas = await query('SELECT * FROM entrevistas WHERE id_estudiante = @id LIMIT 3', { id: estudianteId });
            console.log(`  ✅ Entrevistas: ${entrevistas.recordset.length} registros encontrados`);
            if (entrevistas.recordset.length > 0) {
                console.log('  📄 Ejemplo:', JSON.stringify(entrevistas.recordset[0], null, 2));
            }
        } catch (error) {
            console.log(`  ❌ Error en entrevistas: ${error.message}`);
        }
        
        // 5. Probar tabla comunicacion_familia
        console.log('\n📋 Probando tabla comunicacion_familia...');
        try {
            const comunicacion = await query('SELECT * FROM comunicacion_familia WHERE id_estudiante = @id LIMIT 3', { id: estudianteId });
            console.log(`  ✅ Comunicación familia: ${comunicacion.recordset.length} registros encontrados`);
            if (comunicacion.recordset.length > 0) {
                console.log('  📄 Ejemplo:', JSON.stringify(comunicacion.recordset[0], null, 2));
            }
        } catch (error) {
            console.log(`  ❌ Error en comunicacion_familia: ${error.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

testTabsEndpoints();
