const fs = require('fs');
const path = require('path');

const swaggerDir = path.join(__dirname, 'modules');

const swaggerFiles = fs.readdirSync(swaggerDir).filter(file => file.endsWith('.swagger.json'));

console.log("\n📄 Swagger JSON cargados:");
swaggerFiles.forEach(file => {
  console.log(`✅ ${file}`);
});
