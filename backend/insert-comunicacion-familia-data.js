const { query } = require('./config/db');

async function insertComunicacionFamiliaData() {
    try {
        console.log('🔧 Insertando datos de prueba en comunicacion_familia...\n');
        
        // Verificar si ya existen datos
        const countQuery = `SELECT COUNT(*) as total FROM comunicacion_familia`;
        const count = await query(countQuery);
        console.log(`📊 Registros existentes: ${count.recordset[0].total}`);
        
        if (count.recordset[0].total > 0) {
            console.log('✅ Ya hay datos en la tabla, no es necesario insertar más');
            return;
        }
        
        // Insertar datos de prueba
        const insertQuery = `
            INSERT INTO comunicacion_familia (
                id_estudiante, fecha_comunicacion, tipo_comunicacion, medio, 
                asunto, contenido, responsable_nombre, hora_reunion, 
                lugar_reunion, enviar_email, estado
            ) VALUES 
            (@id_estudiante1, @fecha1, @tipo1, @medio1, @asunto1, @contenido1, @responsable1, @hora1, @lugar1, @email1, @estado1),
            (@id_estudiante2, @fecha2, @tipo2, @medio2, @asunto2, @contenido2, @responsable2, @hora2, @lugar2, @email2, @estado2),
            (@id_estudiante3, @fecha3, @tipo3, @medio3, @asunto3, @contenido3, @responsable3, @hora3, @lugar3, @email3, @estado3)
        `;
        
        const pool = await require('./config/db').getPool();
        const result = await pool.request()
            .input('id_estudiante1', 8)
            .input('fecha1', '2025-01-15')
            .input('tipo1', 'Reunión')
            .input('medio1', 'Presencial')
            .input('asunto1', 'Reunión de apoderados')
            .input('contenido1', 'Reunión para discutir el rendimiento académico del estudiante')
            .input('responsable1', 'Prof. María González')
            .input('hora1', '15:30:00')
            .input('lugar1', 'Sala de profesores')
            .input('email1', true)
            .input('estado1', 'completada')
            .input('id_estudiante2', 9)
            .input('fecha2', '2025-01-16')
            .input('tipo2', 'Llamada telefónica')
            .input('medio2', 'Teléfono')
            .input('asunto2', 'Consulta sobre asistencia')
            .input('contenido2', 'Llamada para consultar sobre las faltas del estudiante')
            .input('responsable2', 'Orientador Juan Pérez')
            .input('hora2', '10:00:00')
            .input('lugar2', null)
            .input('email2', false)
            .input('estado2', 'pendiente')
            .input('id_estudiante3', 10)
            .input('fecha3', '2025-01-17')
            .input('tipo3', 'Email')
            .input('medio3', 'Correo electrónico')
            .input('asunto3', 'Informe de conducta')
            .input('contenido3', 'Envío de informe sobre comportamiento en clases')
            .input('responsable3', 'Inspector Ana Silva')
            .input('hora3', null)
            .input('lugar3', null)
            .input('email3', true)
            .input('estado3', 'enviado')
            .query(insertQuery);
        
        console.log('✅ Datos insertados exitosamente');
        
        // Verificar los datos insertados
        const newCount = await query(countQuery);
        console.log(`📊 Total de registros después de la inserción: ${newCount.recordset[0].total}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('duplicate key') || error.message.includes('ya existe')) {
            console.log('ℹ️  Los datos ya existen, continuando...');
        }
    }
}

insertComunicacionFamiliaData();
