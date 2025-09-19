-- Script para optimizar la base de datos con índices
-- Ejecutar solo si no existen los índices

-- Índices para tabla Asistencia (consultas de alertas)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Asistencia_Estudiante_Fecha_Tipo')
CREATE NONCLUSTERED INDEX IX_Asistencia_Estudiante_Fecha_Tipo 
ON Asistencia (id_estudiante, fecha, tipo)
INCLUDE (id);

-- Índices para tabla Historial_Academico (consultas de alertas)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Historial_Estudiante_Promedio')
CREATE NONCLUSTERED INDEX IX_Historial_Estudiante_Promedio 
ON Historial_Academico (id_estudiante, promedio_general)
INCLUDE (id);

-- Índices para tabla Alertas (evitar duplicados)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alertas_Estudiante_Tipo_Fecha')
CREATE NONCLUSTERED INDEX IX_Alertas_Estudiante_Tipo_Fecha 
ON Alertas (id_estudiante, tipo_alerta, fecha_alerta)
INCLUDE (estado);

-- Índices para tabla Estudiantes (consultas frecuentes)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Estudiantes_Estado')
CREATE NONCLUSTERED INDEX IX_Estudiantes_Estado 
ON Estudiantes (estado)
INCLUDE (id, nombre, apellido, rut, email, curso);

-- Índices para tabla Logs_Actividad (consultas de auditoría)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Logs_Fecha_Usuario')
CREATE NONCLUSTERED INDEX IX_Logs_Fecha_Usuario 
ON Logs_Actividad (fecha_accion DESC, id_usuario)
INCLUDE (accion, tabla_afectada);

-- Índices para tabla Entrevistas (consultas por estudiante)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Entrevistas_Estudiante_Estado')
CREATE NONCLUSTERED INDEX IX_Entrevistas_Estudiante_Estado 
ON Entrevistas (id_estudiante, estado)
INCLUDE (id, fecha, motivo);

PRINT 'Índices de optimización creados exitosamente';



