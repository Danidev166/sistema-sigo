-- Migración para agregar CHECK constraint a la columna tipo de asistencia
-- Esto asegura que solo se permitan valores válidos para el estado de asistencia

-- Primero, verificar si el constraint ya existe
DO $$
BEGIN
    -- Agregar constraint si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'chk_asistencia_tipo'
    ) THEN
        ALTER TABLE asistencia 
        ADD CONSTRAINT chk_asistencia_tipo 
        CHECK (tipo IN ('Presente', 'Ausente', 'Justificada', 'Pendiente', 'P', 'A', 'J', 'PE'));
        
        RAISE NOTICE 'Constraint chk_asistencia_tipo agregado exitosamente';
    ELSE
        RAISE NOTICE 'Constraint chk_asistencia_tipo ya existe';
    END IF;
END $$;

-- Comentario para documentar los valores válidos
COMMENT ON COLUMN asistencia.tipo IS 'Estado de asistencia: Presente/P, Ausente/A, Justificada/J, Pendiente/PE';
