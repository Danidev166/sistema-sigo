-- SIGO PRO - Esquema Maestro Completo para PostgreSQL
-- Generado para restaurar la integridad de la base de datos en Render

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLAS BASE
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'Orientador',
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    reset_token VARCHAR(255),
    reset_token_expiration TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_nacimiento DATE,
    curso VARCHAR(50),
    especialidad VARCHAR(100),
    situacion_economica VARCHAR(100),
    nombre_apoderado VARCHAR(200),
    telefono_apoderado VARCHAR(20),
    email_apoderado VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'Activo'
);

CREATE TABLE IF NOT EXISTS recursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo_recurso VARCHAR(100),
    stock INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLAS RELACIONADAS (Nivel 1)
CREATE TABLE IF NOT EXISTS agenda (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo VARCHAR(255),
    profesional VARCHAR(100),
    email_orientador VARCHAR(255),
    asistencia VARCHAR(20) DEFAULT 'Pendiente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS asistencia (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha DATE NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- Presente, Ausente, Justificada
    justificacion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS entrevistas (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    id_orientador INTEGER REFERENCES usuarios(id),
    fecha_entrevista TIMESTAMP NOT NULL,
    motivo VARCHAR(255),
    observaciones TEXT,
    conclusiones TEXT,
    acciones_acordadas TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evaluaciones_vocacionales (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    tipo_evaluacion VARCHAR(50) NOT NULL,
    resultados TEXT,
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nombre_completo VARCHAR(200),
    curso VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS historial_academico (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    promedio_general DECIMAL(4,2),
    asistencia DECIMAL(5,2),
    observaciones_academicas TEXT,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    año_academico VARCHAR(4),
    curso VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS seguimiento (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_seguimiento VARCHAR(100),
    observaciones TEXT,
    recomendaciones TEXT,
    responsable_id INTEGER REFERENCES usuarios(id),
    estado VARCHAR(50),
    proxima_fecha DATE
);

CREATE TABLE IF NOT EXISTS conducta (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha_incidente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_conducta VARCHAR(100),
    descripcion TEXT,
    gravedad VARCHAR(50),
    medidas_tomadas TEXT,
    responsable_id INTEGER REFERENCES usuarios(id),
    testigos TEXT,
    seguimiento TEXT
);

CREATE TABLE IF NOT EXISTS comunicacion_familia (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha_comunicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_comunicacion VARCHAR(100),
    medio VARCHAR(50),
    asunto VARCHAR(200),
    contenido TEXT,
    responsable_nombre VARCHAR(200),
    respuesta_familia TEXT,
    estado VARCHAR(50) DEFAULT 'Enviado'
);

CREATE TABLE IF NOT EXISTS intervenciones (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha_intervencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_intervencion VARCHAR(100),
    descripcion TEXT,
    objetivo TEXT,
    responsable_id INTEGER REFERENCES usuarios(id),
    estado VARCHAR(50) DEFAULT 'Programada',
    resultado TEXT,
    fecha_finalizacion DATE
);

CREATE TABLE IF NOT EXISTS seguimiento_psicosocial (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_seguimiento VARCHAR(100),
    observaciones TEXT,
    recomendaciones TEXT,
    profesional_id INTEGER REFERENCES usuarios(id),
    estado VARCHAR(50) DEFAULT 'Activo',
    proxima_cita DATE
);

CREATE TABLE IF NOT EXISTS seguimiento_cronologico (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_evento VARCHAR(100),
    descripcion TEXT,
    responsable_id INTEGER REFERENCES usuarios(id),
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS alertas (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_alerta VARCHAR(50),
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'Nueva'
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(50),
    titulo VARCHAR(200),
    mensaje TEXT,
    prioridad VARCHAR(20) DEFAULT 'Normal',
    categoria VARCHAR(50),
    id_estudiante INTEGER REFERENCES estudiantes(id),
    fecha_limite TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    accion_requerida TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS entrega_recursos (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    id_recurso INTEGER REFERENCES recursos(id),
    cantidad_entregada INTEGER NOT NULL,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS movimiento_recursos (
    id SERIAL PRIMARY KEY,
    tipo_movimiento VARCHAR(20) NOT NULL, -- Entrada, Salida
    id_recurso INTEGER REFERENCES recursos(id),
    cantidad INTEGER NOT NULL,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    responsable VARCHAR(100),
    observaciones TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seguimiento_academico (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER REFERENCES estudiantes(id),
    rendimiento VARCHAR(50),
    asistencia_porcentaje DECIMAL(5,2),
    observaciones TEXT,
    recomendaciones TEXT,
    responsable_id INTEGER REFERENCES usuarios(id),
    periodo VARCHAR(50),
    fecha_seguimiento DATE DEFAULT CURRENT_DATE,
    asignatura VARCHAR(100),
    nota DECIMAL(3,1),
    promedio_curso DECIMAL(3,1),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLAS DE CONFIGURACIÓN Y SISTEMA
CREATE TABLE IF NOT EXISTS configuracion (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    clave VARCHAR(100) NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    usuario_modificacion VARCHAR(100),
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tipo, clave)
);

CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    editable BOOLEAN DEFAULT TRUE,
    modificado_por VARCHAR(100),
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permisos_roles (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(50) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    permitido BOOLEAN DEFAULT FALSE,
    UNIQUE(rol, modulo, accion)
);

CREATE TABLE IF NOT EXISTS comunicacion_interna (
    id SERIAL PRIMARY KEY,
    id_remitente INTEGER REFERENCES usuarios(id),
    id_destinatario INTEGER REFERENCES usuarios(id),
    asunto VARCHAR(200),
    mensaje TEXT,
    prioridad VARCHAR(20) DEFAULT 'Normal',
    leida BOOLEAN DEFAULT FALSE,
    adjuntos TEXT,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs_actividad (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id),
    accion VARCHAR(100) NOT NULL,
    tabla_afectada VARCHAR(100),
    id_registro INTEGER,
    datos_anteriores TEXT,
    datos_nuevos TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ÍNDICES PARA OPTIMIZACIÓN
CREATE INDEX IF NOT EXISTS idx_estudiantes_rut ON estudiantes(rut);
CREATE INDEX IF NOT EXISTS idx_asistencia_fecha ON asistencia(fecha);
CREATE INDEX IF NOT EXISTS idx_entrevistas_estudiante ON entrevistas(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_seguimiento_estudiante ON seguimiento(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(id_usuario);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs_actividad(fecha_accion);

-- 6. FUNCIONES SQL PARA DASHBOARD Y REPORTES
CREATE OR REPLACE FUNCTION get_dashboard_final()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'stats', json_build_object(
            'total_estudiantes', (SELECT COUNT(*) FROM estudiantes),
            'estudiantes_activos', (SELECT COUNT(*) FROM estudiantes WHERE estado = 'Activo'),
            'entrevistas_mes', (SELECT COUNT(*) FROM entrevistas WHERE fecha_entrevista >= date_trunc('month', CURRENT_DATE)),
            'intervenciones_activas', (SELECT COUNT(*) FROM intervenciones WHERE estado IN ('Programada', 'En Proceso')),
            'alertas_pendientes', (SELECT COUNT(*) FROM alertas WHERE estado = 'Nueva'),
            'asistencia_promedio', (
                SELECT COALESCE(ROUND(AVG(
                    (SELECT (COUNT(CASE WHEN tipo = 'Presente' THEN 1 END)::float / NULLIF(COUNT(*), 0)) * 100
                     FROM asistencia a2 WHERE a2.id_estudiante = e.id)
                )::numeric, 1), 0)
                FROM estudiantes e
            )
        ),
        'recent_activity', (
            SELECT json_agg(act) FROM (
                SELECT
                    'entrevista' as tipo,
                    e.motivo as descripcion,
                    e.fecha_entrevista as fecha,
                    est.nombre || ' ' || est.apellido as estudiante
                FROM entrevistas e
                JOIN estudiantes est ON e.id_estudiante = est.id
                ORDER BY e.fecha_entrevista DESC
                LIMIT 5
            ) act
        ),
        'charts', json_build_object(
            'asistencia_mensual', (
                SELECT json_agg(am) FROM (
                    SELECT
                        TO_CHAR(fecha, 'Mon') as mes,
                        COUNT(CASE WHEN tipo = 'Presente' THEN 1 END) as presentes,
                        COUNT(*) as total
                    FROM asistencia
                    WHERE fecha >= CURRENT_DATE - INTERVAL '6 months'
                    GROUP BY date_trunc('month', fecha), TO_CHAR(fecha, 'Mon')
                    ORDER BY date_trunc('month', fecha)
                ) am
            )
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
