#!/bin/bash

echo "🔧 Convirtiendo archivo .env.production de UTF-16 a UTF-8..."

# Convertir el archivo de UTF-16 a UTF-8
iconv -f UTF-16 -t UTF-8 .env.production > .env.production.tmp

# Reemplazar el archivo original
mv .env.production.tmp .env.production

echo "✅ Conversión completada"
echo "🔍 Verificando el archivo..."

# Verificar que se convirtió correctamente
echo "📄 Primeras líneas del archivo convertido:"
head -5 .env.production | while read line; do
    echo "  $line"
done
