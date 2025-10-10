-- Crear tabla para decisiones de promoción
CREATE TABLE IF NOT EXISTS decisiones_promocion (
    id SERIAL PRIMARY KEY,
    id_estudiante INTEGER NOT NULL,
    decision VARCHAR(20) NOT NULL CHECK (decision IN ('PROMOVIDO', 'REPITE')),
    razon TEXT NOT NULL,
    usuario_id INTEGER NOT NULL,
    fecha_decision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear índices por separado
CREATE INDEX IF NOT EXISTS idx_decisiones_estudiante ON decisiones_promocion(id_estudiante);
CREATE INDEX IF NOT EXISTS idx_decisiones_fecha ON decisiones_promocion(fecha_decision);
CREATE INDEX IF NOT EXISTS idx_decisiones_decision ON decisiones_promocion(decision);

-- Comentarios
COMMENT ON TABLE decisiones_promocion IS 'Registro de decisiones de promoción de estudiantes';
COMMENT ON COLUMN decisiones_promocion.decision IS 'Decisión tomada: PROMOVIDO o REPITE';
COMMENT ON COLUMN decisiones_promocion.razon IS 'Justificación de la decisión tomada';
COMMENT ON COLUMN decisiones_promocion.usuario_id IS 'Usuario que tomó la decisión';
