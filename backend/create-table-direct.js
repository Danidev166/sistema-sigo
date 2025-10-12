const { Pool } = require('pg');

async function createTableDirect() {
    try {
        console.log('🔧 Conectando directamente a Render para crear tabla...\n');
        
        // Usar las credenciales exactas de Render
        const pool = new Pool({
            user: 'sigo_user',
            host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
            database: 'sigo_pro',
            password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
            port: 5432,
            ssl: { rejectUnauthorized: false }
        });
        
        // Verificar si la tabla existe
        console.log('📋 Verificando si la tabla existe...');
        const checkTable = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name = 'comunicacion_familia'
        `);
        
        if (checkTable.rows.length > 0) {
            console.log('✅ La tabla ya existe');
        } else {
            console.log('❌ La tabla no existe, creándola...');
            
            // Crear la tabla
            const createTableQuery = `
                CREATE TABLE comunicacion_familia (
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
            
            await pool.query(createTableQuery);
            console.log('✅ Tabla creada exitosamente');
            
            // Crear índices
            await pool.query(`
                CREATE INDEX idx_comunicacion_familia_estudiante ON comunicacion_familia(id_estudiante);
                CREATE INDEX idx_comunicacion_familia_fecha ON comunicacion_familia(fecha_comunicacion);
            `);
            console.log('✅ Índices creados');
            
            // Insertar datos de prueba
            await pool.query(`
                INSERT INTO comunicacion_familia 
                (id_estudiante, fecha_comunicacion, tipo_comunicacion, medio, asunto, contenido, responsable_nombre, estado)
                VALUES 
                (8, '2025-01-15', 'Citación a Reunión', 'Email', 'Reunión de seguimiento académico', 'Se requiere reunión para revisar el rendimiento del estudiante', 'Orientador/a', 'enviado'),
                (8, '2025-01-20', 'Comunicación General', 'Teléfono', 'Información importante', 'Comunicación sobre actividades escolares', 'Profesor/a', 'pendiente');
            `);
            console.log('✅ Datos de prueba insertados');
        }
        
        // Verificar la tabla
        const countResult = await pool.query('SELECT COUNT(*) FROM comunicacion_familia');
        console.log(`✅ Total de registros: ${countResult.rows[0].count}`);
        
        // Verificar permisos
        const permResult = await pool.query(`
            SELECT privilege_type 
            FROM information_schema.table_privileges 
            WHERE table_name = 'comunicacion_familia' 
            AND grantee = 'sigo_user'
        `);
        console.log('✅ Permisos del usuario:', permResult.rows);
        
        await pool.end();
        console.log('\n🎉 Proceso completado exitosamente');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Detalles:', error);
    }
}

createTableDirect();
