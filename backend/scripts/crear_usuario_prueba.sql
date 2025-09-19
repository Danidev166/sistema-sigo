-- Script para crear usuario de prueba
-- Ejecutar este script en SQL Server Management Studio

-- Verificar si la tabla Usuarios existe
IF EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
BEGIN
    -- Verificar si ya existe el usuario de prueba
    IF NOT EXISTS (SELECT * FROM Usuarios WHERE CorreoElectronico = 'admin@test.com')
    BEGIN
        -- Insertar usuario de prueba
        INSERT INTO Usuarios (NombreCompleto, NumeroIdentificacion, CorreoElectronico, Contraseña, Rol, NombreUsuario) 
        VALUES (
            'Admin Sistema', 
            '12345678-9', 
            'admin@test.com', 
            '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: "password"
            'Admin', 
            'admin'
        );
        
        PRINT 'Usuario de prueba creado exitosamente';
        PRINT 'Email: admin@test.com';
        PRINT 'Password: password';
    END
    ELSE
    BEGIN
        PRINT 'El usuario de prueba ya existe';
    END
END
ELSE
BEGIN
    PRINT 'La tabla Usuarios no existe. Ejecuta primero el script de creación de tablas.';
END
