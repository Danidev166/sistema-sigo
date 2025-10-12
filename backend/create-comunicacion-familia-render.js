const { getPool } = require('./config/db');

async function createComunicacionFamiliaTable() {
    try {
        console.log('🔧 Creando tabla comunicacion_familia en Render...\n');
        
        const pool = await getPool();
        
        // Crear la tabla
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS comunicacion_familia (
                id BIGSERIAL PRIMARY KEY,
                id_estudiante BIGINT NOT NULL,
                fecha_comunicacion DATE NOT NULL,
                tipo_comunicacion VARCHAR(100) NOT NULL,
                medio VARCHAR(50),
                asunto VARCHAR(200),
                contenido TEXT,
                responsable_nombre VARCHAR(100),
                hora_reunion TIME,
                lugar_reunion VARCHAR(200),
                enviar_email BOOLEAN DEFAULT FALSE,
                estado VARCHAR(50) DEFAULT 'pendiente',
                respuesta_familia TEXT,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id) ON DELETE CASCADE
            );
        `;
        
        console.log('📋 Ejecutando CREATE TABLE...');
        await pool.raw.query(createTableQuery);
        console.log('✅ Tabla creada exitosamente');
        
        // Crear índices
        const createIndexQuery = `
            CREATE INDEX IF NOT EXISTS idx_comunicacion_familia_estudiante 
            ON comunicacion_familia(id_estudiante);
            
            CREATE INDEX IF NOT EXISTS idx_comunicacion_familia_fecha 
            ON comunicacion_familia(fecha_comunicacion);
        `;
        
        console.log('📋 Creando índices...');
        await pool.raw.query(createIndexQuery);
        console.log('✅ Índices creados');
        
        // Verificar que la tabla existe
        console.log('\n📋 Verificando tabla creada...');
        const verifyResult = await pool.raw.query(`
            SELECT table_name, table_schema 
            FROM information_schema.tables 
            WHERE table_name = 'comunicacion_familia'
        `);
        console.log('✅ Tabla verificada:', verifyResult.rows.length > 0);
        
        // Insertar datos de prueba
        console.log('\n📋 Insertando datos de prueba...');
        const insertDataQuery = `
            INSERT INTO comunicacion_familia 
            (id_estudiante, fecha_comunicacion, tipo_comunicacion, medio, asunto, contenido, responsable_nombre, estado)
            VALUES 
            (8, '2025-01-15', 'Citación a Reunión', 'Email', 'Reunión de seguimiento académico', 'Se requiere reunión para revisar el rendimiento del estudiante', 'Orientador/a', 'enviado'),
            (8, '2025-01-20', 'Comunicación General', 'Teléfono', 'Información importante', 'Comunicación sobre actividades escolares', 'Profesor/a', 'pendiente')
            ON CONFLICT DO NOTHING;
        `;
        
        await pool.raw.query(insertDataQuery);
        console.log('✅ Datos de prueba insertados');
        
        // Verificar datos
        const countResult = await pool.raw.query('SELECT COUNT(*) FROM comunicacion_familia');
        console.log(`✅ Total de registros: ${countResult.rows[0].count}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    }
}

createComunicacionFamiliaTable();
