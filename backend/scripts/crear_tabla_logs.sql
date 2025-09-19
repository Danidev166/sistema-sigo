-- Script para crear la tabla Logs_Actividad
-- Ejecutar este script en SQL Server Management Studio o en tu cliente SQL

-- Verificar si la tabla existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Logs_Actividad' AND xtype='U')
BEGIN
    -- Crear la tabla Logs_Actividad
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
        fecha_accion DATETIME NOT NULL DEFAULT GETDATE()
    );

    -- Crear índices
    CREATE INDEX IX_LogsActividad_Usuario ON Logs_Actividad(id_usuario);
    CREATE INDEX IX_LogsActividad_Fecha ON Logs_Actividad(fecha_accion);
    CREATE INDEX IX_LogsActividad_Accion ON Logs_Actividad(accion);

    PRINT 'Tabla Logs_Actividad creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La tabla Logs_Actividad ya existe';
END

-- Insertar algunos datos de prueba
IF NOT EXISTS (SELECT * FROM Logs_Actividad)
BEGIN
    INSERT INTO Logs_Actividad (id_usuario, accion, tabla_afectada, id_registro, datos_anteriores, datos_nuevos, ip_address, user_agent) VALUES
    (1, 'Login', 'usuarios', 1, NULL, '{"email": "admin@test.com"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
    (1, 'Crear', 'estudiantes', 1, NULL, '{"nombre": "Juan Pérez", "curso": "1A"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
    (1, 'Actualizar', 'estudiantes', 1, '{"nombre": "Juan Pérez"}', '{"nombre": "Juan Carlos Pérez"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    PRINT 'Datos de prueba insertados en Logs_Actividad';
END
ELSE
BEGIN
    PRINT 'La tabla Logs_Actividad ya tiene datos';
END 