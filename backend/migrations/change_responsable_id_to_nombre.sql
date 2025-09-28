-- Migración para cambiar responsable_id a responsable_nombre en comunicacion_familia
-- Fecha: 2025-09-28

-- Agregar la nueva columna responsable_nombre
ALTER TABLE comunicacion_familia 
ADD COLUMN responsable_nombre VARCHAR(100);

-- Copiar los datos existentes (si los hay) de responsable_id a responsable_nombre
-- Esto asume que responsable_id contenía nombres de texto
UPDATE comunicacion_familia 
SET responsable_nombre = responsable_id::text 
WHERE responsable_id IS NOT NULL;

-- Eliminar la columna responsable_id
ALTER TABLE comunicacion_familia 
DROP COLUMN responsable_id;

-- Agregar comentario a la nueva columna
COMMENT ON COLUMN comunicacion_familia.responsable_nombre IS 'Nombre del profesional responsable de la comunicación';
