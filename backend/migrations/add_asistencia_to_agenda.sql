-- Migración para agregar campo asistencia a la tabla agenda
ALTER TABLE agenda ADD COLUMN asistencia VARCHAR(50) DEFAULT 'Pendiente';

-- Comentario para documentar el campo
COMMENT ON COLUMN agenda.asistencia IS 'Estado de asistencia: Pendiente, Presente, Ausente, Justificada';
