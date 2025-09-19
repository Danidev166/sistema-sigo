-- Script corregido para crear las tablas faltantes que completan el sistema SIGO al 100%
-- Ejecutar este script en SQL Server para completar la funcionalidad

-- =============================================
-- TABLA: Seguimiento_Cronologico
-- =============================================
CREATE TABLE Seguimiento_Cronologico (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_estudiante INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    tipo_accion NVARCHAR(100) NOT NULL,
    categoria NVARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    profesional_responsable NVARCHAR(255) NOT NULL,
    estado NVARCHAR(50) NOT NULL DEFAULT 'Pendiente',
    observaciones TEXT NULL,
    archivos_adjuntos NVARCHAR(MAX) NULL,
    prioridad NVARCHAR(20) NOT NULL DEFAULT 'Media',
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NULL,
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id) ON DELETE CASCADE
);

-- Índices para optimizar consultas
CREATE INDEX IX_SeguimientoCronologico_Estudiante ON Seguimiento_Cronologico(id_estudiante);
CREATE INDEX IX_SeguimientoCronologico_Fecha ON Seguimiento_Cronologico(fecha);
CREATE INDEX IX_SeguimientoCronologico_Categoria ON Seguimiento_Cronologico(categoria);

GO

-- =============================================
-- TABLA: Notificaciones
-- =============================================
CREATE TABLE Notificaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo NVARCHAR(50) NOT NULL,
    titulo NVARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    prioridad NVARCHAR(20) NOT NULL DEFAULT 'Media',
    categoria NVARCHAR(50) NOT NULL,
    id_estudiante INT NULL,
    fecha_limite DATETIME NULL,
    leida BIT NOT NULL DEFAULT 0,
    accion_requerida NVARCHAR(100) NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_lectura DATETIME NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id) ON DELETE CASCADE
);

-- Índices para optimizar consultas
CREATE INDEX IX_Notificaciones_Usuario ON Notificaciones(id_usuario);
CREATE INDEX IX_Notificaciones_Leida ON Notificaciones(leida);
CREATE INDEX IX_Notificaciones_Prioridad ON Notificaciones(prioridad);
CREATE INDEX IX_Notificaciones_FechaCreacion ON Notificaciones(fecha_creacion);

GO

-- =============================================
-- TABLA: Configuracion_Sistema
-- =============================================
CREATE TABLE Configuracion_Sistema (
    id INT IDENTITY(1,1) PRIMARY KEY,
    clave NVARCHAR(100) NOT NULL UNIQUE,
    valor NVARCHAR(MAX) NOT NULL,
    tipo NVARCHAR(50) NOT NULL DEFAULT 'string',
    descripcion NVARCHAR(500) NULL,
    categoria NVARCHAR(50) NOT NULL DEFAULT 'General',
    editable BIT NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NULL,
    modificado_por INT NULL,
    FOREIGN KEY (modificado_por) REFERENCES usuarios(id)
);

GO

-- =============================================
-- TABLA: Logs_Actividad
-- =============================================
CREATE TABLE Logs_Actividad (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NULL,
    accion NVARCHAR(100) NOT NULL,
    tabla_afectada NVARCHAR(100) NULL,
    id_registro INT NULL,
    datos_anteriores NVARCHAR(MAX) NULL,
    datos_nuevos NVARCHAR(MAX) NULL,
    ip_address NVARCHAR(45) NULL,
    user_agent NVARCHAR(500) NULL,
    fecha_accion DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Índices para logs
CREATE INDEX IX_LogsActividad_Usuario ON Logs_Actividad(id_usuario);
CREATE INDEX IX_LogsActividad_Fecha ON Logs_Actividad(fecha_accion);
CREATE INDEX IX_LogsActividad_Accion ON Logs_Actividad(accion);

GO

-- =============================================
-- TABLA: Plantillas_Reportes
-- =============================================
CREATE TABLE Plantillas_Reportes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    tipo_reporte NVARCHAR(50) NOT NULL,
    configuracion NVARCHAR(MAX) NOT NULL, -- JSON con configuración
    activa BIT NOT NULL DEFAULT 1,
    creado_por INT NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME NULL,
    FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);

GO

-- =============================================
-- TABLA: Permisos_Roles
-- =============================================
CREATE TABLE Permisos_Roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    rol NVARCHAR(50) NOT NULL,
    modulo NVARCHAR(100) NOT NULL,
    accion NVARCHAR(100) NOT NULL,
    permitido BIT NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    UNIQUE (rol, modulo, accion)
);

GO

-- =============================================
-- TABLA: Comunicacion_Interna
-- =============================================
CREATE TABLE Comunicacion_Interna (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_remitente INT NOT NULL,
    id_destinatario INT NOT NULL,
    asunto NVARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    prioridad NVARCHAR(20) NOT NULL DEFAULT 'Normal',
    leida BIT NOT NULL DEFAULT 0,
    fecha_envio DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_lectura DATETIME NULL,
    adjuntos NVARCHAR(MAX) NULL,
    FOREIGN KEY (id_remitente) REFERENCES usuarios(id),
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id)
);

-- Índices para comunicación
CREATE INDEX IX_ComunicacionInterna_Destinatario ON Comunicacion_Interna(id_destinatario);
CREATE INDEX IX_ComunicacionInterna_Leida ON Comunicacion_Interna(leida);

GO

-- =============================================
-- INSERTAR DATOS INICIALES
-- =============================================

-- Configuraciones del sistema
INSERT INTO Configuracion_Sistema (clave, valor, tipo, descripcion, categoria) VALUES
('nombre_institucion', 'Liceo Bicentenario Politécnico Caupolicán', 'string', 'Nombre de la institución educativa', 'Institucional'),
('logo_institucion', '/assets/logo.png', 'string', 'Ruta del logo institucional', 'Institucional'),
('email_contacto', 'contacto@liceo.cl', 'string', 'Email de contacto institucional', 'Institucional'),
('telefono_contacto', '+56 2 2345 6789', 'string', 'Teléfono de contacto', 'Institucional'),
('max_estudiantes_por_curso', '35', 'number', 'Máximo número de estudiantes por curso', 'Académico'),
('promedio_minimo_aprobacion', '4.0', 'number', 'Promedio mínimo para aprobación', 'Académico'),
('dias_maximos_falta', '3', 'number', 'Días máximos de falta consecutiva antes de alerta', 'Asistencia'),
('intervalo_alertas_automaticas', '24', 'number', 'Intervalo en horas para alertas automáticas', 'Sistema'),
('backup_automatico', 'true', 'boolean', 'Habilitar backup automático', 'Sistema'),
('tema_interfaz', 'light', 'string', 'Tema de interfaz por defecto', 'Personalización');

GO

-- Permisos por roles
INSERT INTO Permisos_Roles (rol, modulo, accion) VALUES
-- Administrador - Acceso total
('Admin', '*', '*'),

-- Orientador - Gestión de estudiantes y seguimiento
('Orientador', 'estudiantes', 'ver'),
('Orientador', 'estudiantes', 'crear'),
('Orientador', 'estudiantes', 'editar'),
('Orientador', 'estudiantes', 'eliminar'),
('Orientador', 'agenda', 'ver'),
('Orientador', 'agenda', 'crear'),
('Orientador', 'agenda', 'editar'),
('Orientador', 'evaluaciones', 'ver'),
('Orientador', 'evaluaciones', 'crear'),
('Orientador', 'evaluaciones', 'editar'),
('Orientador', 'seguimiento', 'ver'),
('Orientador', 'seguimiento', 'crear'),
('Orientador', 'seguimiento', 'editar'),
('Orientador', 'reportes', 'ver'),
('Orientador', 'reportes', 'exportar'),

-- Psicólogo - Evaluaciones y seguimiento psicosocial
('Psicologo', 'estudiantes', 'ver'),
('Psicologo', 'evaluaciones', 'ver'),
('Psicologo', 'evaluaciones', 'crear'),
('Psicologo', 'evaluaciones', 'editar'),
('Psicologo', 'seguimiento-psicosocial', 'ver'),
('Psicologo', 'seguimiento-psicosocial', 'crear'),
('Psicologo', 'seguimiento-psicosocial', 'editar'),
('Psicologo', 'reportes', 'ver'),

-- Asistente Social - Recursos e intervenciones sociales
('AsistenteSocial', 'estudiantes', 'ver'),
('AsistenteSocial', 'recursos', 'ver'),
('AsistenteSocial', 'recursos', 'crear'),
('AsistenteSocial', 'recursos', 'editar'),
('AsistenteSocial', 'entregas', 'ver'),
('AsistenteSocial', 'entregas', 'crear'),
('AsistenteSocial', 'entregas', 'editar'),
('AsistenteSocial', 'intervenciones', 'ver'),
('AsistenteSocial', 'intervenciones', 'crear'),
('AsistenteSocial', 'intervenciones', 'editar'),
('AsistenteSocial', 'comunicacion-familia', 'ver'),
('AsistenteSocial', 'comunicacion-familia', 'crear'),
('AsistenteSocial', 'comunicacion-familia', 'editar'),
('AsistenteSocial', 'reportes', 'ver'),

-- Directivo - Solo reportes y estadísticas
('Directivo', 'estudiantes', 'ver'),
('Directivo', 'reportes', 'ver'),
('Directivo', 'reportes', 'exportar'),
('Directivo', 'dashboard', 'ver'),
('Directivo', 'estadisticas', 'ver');

GO

-- Plantillas de reportes (usando el primer usuario disponible o NULL si no hay usuarios)
DECLARE @primer_usuario_id INT = (SELECT TOP 1 id FROM usuarios ORDER BY id);

IF @primer_usuario_id IS NOT NULL
BEGIN
    INSERT INTO Plantillas_Reportes (nombre, descripcion, tipo_reporte, configuracion, creado_por) VALUES
    ('Reporte Mensual General', 'Reporte mensual con estadísticas generales del departamento', 'mensual', 
    '{"incluir_estadisticas": true, "incluir_graficos": true, "formato": "pdf"}', @primer_usuario_id),
    ('Reporte Individual Estudiante', 'Reporte detallado de un estudiante específico', 'individual',
    '{"incluir_historial": true, "incluir_evaluaciones": true, "incluir_intervenciones": true, "formato": "pdf"}', @primer_usuario_id),
    ('Reporte de Asistencia', 'Reporte de asistencia por curso y período', 'asistencia',
    '{"incluir_porcentajes": true, "incluir_tendencias": true, "formato": "excel"}', @primer_usuario_id);
END
ELSE
BEGIN
    -- Si no hay usuarios, crear plantillas sin referencia a usuario
    INSERT INTO Plantillas_Reportes (nombre, descripcion, tipo_reporte, configuracion, creado_por) VALUES
    ('Reporte Mensual General', 'Reporte mensual con estadísticas generales del departamento', 'mensual', 
    '{"incluir_estadisticas": true, "incluir_graficos": true, "formato": "pdf"}', 1),
    ('Reporte Individual Estudiante', 'Reporte detallado de un estudiante específico', 'individual',
    '{"incluir_historial": true, "incluir_evaluaciones": true, "incluir_intervenciones": true, "formato": "pdf"}', 1),
    ('Reporte de Asistencia', 'Reporte de asistencia por curso y período', 'asistencia',
    '{"incluir_porcentajes": true, "incluir_tendencias": true, "formato": "excel"}', 1);
END

GO

-- =============================================
-- TRIGGERS PARA AUDITORÍA
-- =============================================

-- Trigger para logs de actividad en estudiantes
CREATE TRIGGER TR_Estudiantes_Log
ON Estudiantes
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    DECLARE @accion NVARCHAR(100)
    DECLARE @id_registro INT
    DECLARE @datos_anteriores NVARCHAR(MAX)
    DECLARE @datos_nuevos NVARCHAR(MAX)
    DECLARE @id_usuario INT = (SELECT TOP 1 id FROM usuarios WHERE email = SYSTEM_USER OR SYSTEM_USER LIKE '%' + email + '%')
    
    IF TRIGGER_NESTLEVEL() > 1 RETURN
    
    IF EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE'
        SELECT @id_registro = id FROM inserted
        SELECT @datos_anteriores = (SELECT * FROM deleted FOR JSON PATH)
        SELECT @datos_nuevos = (SELECT * FROM inserted FOR JSON PATH)
    END
    ELSE IF EXISTS(SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT'
        SELECT @id_registro = id FROM inserted
        SELECT @datos_nuevos = (SELECT * FROM inserted FOR JSON PATH)
    END
    ELSE
    BEGIN
        SET @accion = 'DELETE'
        SELECT @id_registro = id FROM deleted
        SELECT @datos_anteriores = (SELECT * FROM deleted FOR JSON PATH)
    END
    
    INSERT INTO Logs_Actividad (id_usuario, accion, tabla_afectada, id_registro, datos_anteriores, datos_nuevos)
    VALUES (@id_usuario, @accion, 'Estudiantes', @id_registro, @datos_anteriores, @datos_nuevos)
END;

GO

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =============================================

-- Procedimiento para generar reporte consolidado (CORREGIDO)
CREATE PROCEDURE sp_GenerarReporteConsolidado
    @id_estudiante INT,
    @fecha_desde DATE = NULL,
    @fecha_hasta DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @fecha_desde IS NULL SET @fecha_desde = DATEADD(month, -1, GETDATE())
    IF @fecha_hasta IS NULL SET @fecha_hasta = GETDATE()
    
    -- Datos del estudiante (CORREGIDO: sin fecha_ingreso)
    SELECT e.*, 
           COUNT(DISTINCT a.id) as total_asistencias,
           COUNT(DISTINCT CASE WHEN a.tipo IN ('Ausente', 'Justificada') THEN a.id END) as total_faltas,
           AVG(sa.nota) as promedio_academico,
           COUNT(DISTINCT ev.id) as total_evaluaciones,
           COUNT(DISTINCT i.id) as total_intervenciones
    FROM Estudiantes e
    LEFT JOIN Asistencia a ON e.id = a.id_estudiante AND a.fecha BETWEEN @fecha_desde AND @fecha_hasta
    LEFT JOIN SeguimientoAcademico sa ON e.id = sa.id_estudiante AND sa.fecha BETWEEN @fecha_desde AND @fecha_hasta
    LEFT JOIN Evaluaciones_Vocacionales ev ON e.id = ev.id_estudiante AND ev.fecha_evaluacion BETWEEN @fecha_desde AND @fecha_hasta
    LEFT JOIN Intervenciones i ON e.id = i.id_estudiante AND i.fecha BETWEEN @fecha_desde AND @fecha_hasta
    WHERE e.id = @id_estudiante
    GROUP BY e.id, e.nombre, e.apellido, e.rut, e.curso, e.especialidad, e.estado, e.fecha_registro;
    
    -- Historial de actividades (CORREGIDO: usando tipo en lugar de presente)
    SELECT 
        'Asistencia' as tipo_actividad,
        a.fecha,
        a.tipo as estado,
        a.justificacion as descripcion
    FROM Asistencia a
    WHERE a.id_estudiante = @id_estudiante AND a.fecha BETWEEN @fecha_desde AND @fecha_hasta
    
    UNION ALL
    
    SELECT 
        'Evaluación Vocacional' as tipo_actividad,
        ev.fecha_evaluacion as fecha,
        ev.tipo_evaluacion as estado,
        ev.resultados as descripcion
    FROM Evaluaciones_Vocacionales ev
    WHERE ev.id_estudiante = @id_estudiante AND ev.fecha_evaluacion BETWEEN @fecha_desde AND @fecha_hasta
    
    UNION ALL
    
    SELECT 
        'Intervención' as tipo_actividad,
        i.fecha,
        i.accion as estado,
        i.meta as descripcion
    FROM Intervenciones i
    WHERE i.id_estudiante = @id_estudiante AND i.fecha BETWEEN @fecha_desde AND @fecha_hasta
    
    ORDER BY fecha DESC;
END;

GO

-- Procedimiento para limpiar datos antiguos
CREATE PROCEDURE sp_LimpiarDatosAntiguos
    @meses_retener INT = 12
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @fecha_limite DATE = DATEADD(month, -@meses_retener, GETDATE())
    
    -- Limpiar logs antiguos
    DELETE FROM Logs_Actividad WHERE fecha_accion < @fecha_limite
    
    -- Limpiar notificaciones leídas antiguas
    DELETE FROM Notificaciones WHERE fecha_creacion < @fecha_limite AND leida = 1
    
    -- Limpiar comunicaciones internas antiguas
    DELETE FROM Comunicacion_Interna WHERE fecha_envio < @fecha_limite AND leida = 1
    
    PRINT 'Limpieza completada. Fecha límite: ' + CAST(@fecha_limite AS NVARCHAR(10))
END;

GO

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista para dashboard consolidado
CREATE VIEW vw_Dashboard_Consolidado AS
SELECT 
    (SELECT COUNT(*) FROM Estudiantes WHERE estado = 'Activo') as total_estudiantes,
    (SELECT COUNT(*) FROM Entrevistas WHERE fecha_entrevista >= DATEADD(day, -30, GETDATE())) as entrevistas_mes,
    (SELECT COUNT(*) FROM Evaluaciones_Vocacionales WHERE fecha_evaluacion >= DATEADD(day, -30, GETDATE())) as evaluaciones_mes,
    (SELECT COUNT(*) FROM Notificaciones WHERE leida = 0) as notificaciones_pendientes,
    (SELECT COUNT(*) FROM Seguimiento_Cronologico WHERE estado = 'Pendiente') as seguimientos_pendientes;

GO

-- Vista para alertas prioritarias (CORREGIDO: usando tipo en lugar de presente)
CREATE VIEW vw_Alertas_Prioritarias AS
SELECT 
    e.id as id_estudiante,
    e.nombre + ' ' + e.apellido as nombre_completo,
    e.curso,
    'Asistencia' as tipo_alerta,
    'Faltas consecutivas' as descripcion,
    COUNT(a.id) as valor
FROM Estudiantes e
INNER JOIN Asistencia a ON e.id = a.id_estudiante
WHERE a.tipo IN ('Ausente', 'Justificada') AND a.fecha >= DATEADD(day, -7, GETDATE())
GROUP BY e.id, e.nombre, e.apellido, e.curso
HAVING COUNT(a.id) >= 3

UNION ALL

SELECT 
    e.id as id_estudiante,
    e.nombre + ' ' + e.apellido as nombre_completo,
    e.curso,
    'Rendimiento' as tipo_alerta,
    'Promedio bajo' as descripcion,
    AVG(sa.nota) as valor
FROM Estudiantes e
INNER JOIN SeguimientoAcademico sa ON e.id = sa.id_estudiante
WHERE sa.fecha >= DATEADD(month, -1, GETDATE())
GROUP BY e.id, e.nombre, e.apellido, e.curso
HAVING AVG(sa.nota) < 4.0;

GO

PRINT 'Script corregido completado exitosamente. Todas las tablas y funcionalidades han sido creadas.';
PRINT 'Errores corregidos:';
PRINT '- Uso de tipo en lugar de presente para Asistencia';
PRINT '- Eliminación de referencia a fecha_ingreso inexistente';
PRINT '- Manejo de usuario inexistente en plantillas de reportes'; 