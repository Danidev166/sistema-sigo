const { query } = require('./config/db');

async function createComunicacionFamiliaTable() {
    try {
        console.log('🔍 Verificando y creando tabla comunicacion_familia...');
        
        // Crear la tabla basada en la estructura que me mostraste
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS comunicacion_familia (
                id SERIAL PRIMARY KEY,
                id_estudiante INTEGER NOT NULL,
                fecha_comunicacion DATE NOT NULL,
                tipo_comunicacion VARCHAR(50) NOT NULL,
                medio VARCHAR(50) NOT NULL,
                asunto VARCHAR(255) NOT NULL,
                contenido TEXT,
                responsable_nombre VARCHAR(100) NOT NULL,
                hora_reunion TIME,
                lugar_reunion VARCHAR(255),
                enviar_email BOOLEAN DEFAULT false,
                estado VARCHAR(50) DEFAULT 'pendiente',
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id) ON DELETE CASCADE
            );
        `;
        
        await query(createTableQuery);
        console.log('✅ Tabla comunicacion_familia creada exitosamente');
        
        // Verificar que se creó correctamente
        const verifyQuery = `
            SELECT 
                column_name,
                data_type,
                is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'comunicacion_familia'
            ORDER BY ordinal_position;
        `;
        
        const structure = await query(verifyQuery);
        console.log('\n📋 Estructura de la tabla creada:');
        structure.recordset.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
        
        // Insertar algunos datos de prueba
        const insertDataQuery = `
            INSERT INTO comunicacion_familia (
                id_estudiante, fecha_comunicacion, tipo_comunicacion, medio, 
                asunto, contenido, responsable_nombre, hora_reunion, 
                lugar_reunion, enviar_email, estado
            ) VALUES 
            (1, '2025-01-15', 'Reunión', 'Presencial', 'Reunión de apoderados', 
             'Reunión para discutir el rendimiento académico del estudiante', 
             'Prof. María González', '15:30:00', 'Sala de profesores', true, 'completada'),
            (2, '2025-01-16', 'Llamada telefónica', 'Teléfono', 'Consulta sobre asistencia', 
             'Llamada para consultar sobre las faltas del estudiante', 
             'Orientador Juan Pérez', '10:00:00', null, false, 'pendiente'),
            (3, '2025-01-17', 'Email', 'Correo electrónico', 'Informe de conducta', 
             'Envío de informe sobre comportamiento en clases', 
             'Inspector Ana Silva', null, null, true, 'enviado')
            ON CONFLICT DO NOTHING;
        `;
        
        await query(insertDataQuery);
        console.log('✅ Datos de prueba insertados');
        
        // Verificar los datos insertados
        const countQuery = `SELECT COUNT(*) as total FROM comunicacion_familia`;
        const count = await query(countQuery);
        console.log(`\n📊 Total de registros: ${count.recordset[0].total}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    }
}

createComunicacionFamiliaTable();
