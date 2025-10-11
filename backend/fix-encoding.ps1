# Script para convertir .env.production de UTF-16 a UTF-8
$filePath = ".\backend\.env.production"

Write-Host "🔧 Convirtiendo archivo .env.production de UTF-16 a UTF-8..."

# Leer el archivo como UTF-16
$content = Get-Content -Path $filePath -Encoding Unicode

# Escribir el archivo como UTF-8
$content | Out-File -FilePath $filePath -Encoding UTF8

Write-Host "✅ Conversión completada"
Write-Host "🔍 Verificando el archivo..."

# Verificar que se convirtió correctamente
$newContent = Get-Content -Path $filePath -Encoding UTF8
Write-Host "📄 Primeras líneas del archivo convertido:"
$newContent | Select-Object -First 5 | ForEach-Object { Write-Host "  $_" }
