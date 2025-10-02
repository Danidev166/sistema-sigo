const fs = require('fs');
const path = require('path');

// Función para convertir SQL Server syntax a PostgreSQL
function convertToPostgres(content) {
  let converted = content;
  
  // Convertir .request().input().query() a .query() con parámetros
  converted = converted.replace(
    /const result = await pool\.request\(\)\s*([\s\S]*?)\.query\(`([\s\S]*?)`\);/g,
    (match, inputs, query) => {
      // Extraer parámetros de .input()
      const params = [];
      const inputMatches = inputs.match(/\.input\('([^']+)',\s*([^)]+)\)/g);
      
      if (inputMatches) {
        inputMatches.forEach((inputMatch, index) => {
          const paramMatch = inputMatch.match(/\.input\('([^']+)',\s*([^)]+)\)/);
          if (paramMatch) {
            const paramName = paramMatch[1];
            const paramValue = paramMatch[2];
            
            // Reemplazar @paramName con $index en la query
            query = query.replace(new RegExp(`@${paramName}`, 'g'), `$${index + 1}`);
            params.push(paramValue);
          }
        });
      }
      
      // Crear la nueva query con parámetros
      const paramString = params.length > 0 ? `, [${params.join(', ')}]` : '';
      return `const result = await pool.query(\`${query}\`${paramString});`;
    }
  );
  
  // Convertir .request().input().query() sin result
  converted = converted.replace(
    /await pool\.request\(\)\s*([\s\S]*?)\.query\(`([\s\S]*?)`\);/g,
    (match, inputs, query) => {
      const params = [];
      const inputMatches = inputs.match(/\.input\('([^']+)',\s*([^)]+)\)/g);
      
      if (inputMatches) {
        inputMatches.forEach((inputMatch, index) => {
          const paramMatch = inputMatch.match(/\.input\('([^']+)',\s*([^)]+)\)/);
          if (paramMatch) {
            const paramName = paramMatch[1];
            query = query.replace(new RegExp(`@${paramName}`, 'g'), `$${index + 1}`);
            params.push(paramMatch[2]);
          }
        });
      }
      
      const paramString = params.length > 0 ? `, [${params.join(', ')}]` : '';
      return `await pool.query(\`${query}\`${paramString});`;
    }
  );
  
  // Convertir result.recordset a result.rows
  converted = converted.replace(/result\.recordset/g, 'result.rows');
  
  return converted;
}

// Función para procesar un archivo
function processFile(filePath) {
  try {
    console.log(`🔄 Procesando: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const converted = convertToPostgres(content);
    
    if (content !== converted) {
      // Crear backup
      fs.writeFileSync(filePath + '.backup', content);
      
      // Escribir archivo convertido
      fs.writeFileSync(filePath, converted);
      console.log(`✅ Convertido: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  Sin cambios: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función principal
function main() {
  console.log('🔄 CONVIRTIENDO MODELOS DE SQL SERVER A POSTGRESQL');
  console.log('==================================================\n');
  
  const modelsDir = path.join(__dirname, 'models');
  const files = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));
  
  let converted = 0;
  let errors = 0;
  
  files.forEach(file => {
    const filePath = path.join(modelsDir, file);
    if (processFile(filePath)) {
      converted++;
    } else {
      errors++;
    }
  });
  
  console.log(`\n📊 RESUMEN:`);
  console.log(`✅ Archivos convertidos: ${converted}`);
  console.log(`⏭️  Archivos sin cambios: ${errors}`);
  console.log(`📁 Total procesados: ${files.length}`);
  
  if (converted > 0) {
    console.log('\n🔧 PRÓXIMOS PASOS:');
    console.log('1. Revisar los archivos convertidos');
    console.log('2. Hacer commit y push');
    console.log('3. Probar en Render');
  }
}

main();
