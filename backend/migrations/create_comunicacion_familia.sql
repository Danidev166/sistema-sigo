-- Crear tabla comunicacion_familia en Render
-- Esta tabla maneja la comunicación con los apoderados de los estudiantes

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
    
    -- Relación con estudiantes
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id) ON DELETE CASCADE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_comunicacion_familia_estudiante ON comunicacion_familia(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_comunicacion_familia_fecha ON comunicacion_familia(fecha_comunicacion);
CREATE INDEX IF NOT EXISTS idx_comunicacion_familia_estado ON comunicacion_familia(estado);

-- Insertar algunos datos de prueba
INSERT INTO comunicacion_familia (
    id_estudiante, fecha_comunicacion, tipo_comunicacion, medio, 
    asunto, contenido, responsable_nombre, hora_reunion, 
    lugar_reunion, enviar_email, estado
) VALUES 
(8, '2025-01-15', 'Reunión', 'Presencial', 'Reunión de apoderados', 
 'Reunión para discutir el rendimiento académico del estudiante', 
 'Prof. María González', '15:30:00', 'Sala de profesores', true, 'completada'),
(9, '2025-01-16', 'Llamada telefónica', 'Teléfono', 'Consulta sobre asistencia', 
 'Llamada para consultar sobre las faltas del estudiante', 
 'Orientador Juan Pérez', '10:00:00', null, false, 'pendiente'),
(10, '2025-01-17', 'Email', 'Correo electrónico', 'Informe de conducta', 
 'Envío de informe sobre comportamiento en clases', 
 'Inspector Ana Silva', null, null, true, 'enviado')
ON CONFLICT DO NOTHING;
