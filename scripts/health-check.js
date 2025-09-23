#!/usr/bin/env node
/**
 * Script de verificación de salud del sistema SIGO PRO
 * Verifica que todos los componentes estén funcionando correctamente
 */

const axios = require('axios');
const { Pool } = require('pg');

// Configuración
const config = {
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5174',
    timeout: 5000
  },
  backend: {
    url: process.env.BACKEND_URL || 'http://localhost:3001',
    timeout: 5000
  },
  database: {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'sigo_db'
  }
};

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Función para imprimir con colores
function print(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Función para verificar frontend
async function checkFrontend() {
  try {
    print(colors.blue, '🔍 Verificando Frontend...');
    const response = await axios.get(config.frontend.url, { timeout: config.frontend.timeout });
    
    if (response.status === 200) {
      print(colors.green, '✅ Frontend: OK');
      return true;
    } else {
      print(colors.red, `❌ Frontend: Error ${response.status}`);
      return false;
    }
  } catch (error) {
    print(colors.red, `❌ Frontend: ${error.message}`);
    return false;
  }
}

// Función para verificar backend
async function checkBackend() {
  try {
    print(colors.blue, '🔍 Verificando Backend...');
    
    // Verificar endpoint de salud
    const healthResponse = await axios.get(`${config.backend.url}/api/health`, { 
      timeout: config.backend.timeout 
    });
    
    if (healthResponse.status === 200) {
      print(colors.green, '✅ Backend Health: OK');
    } else {
      print(colors.yellow, `⚠️ Backend Health: ${healthResponse.status}`);
    }

    // Verificar endpoint de estudiantes
    const studentsResponse = await axios.get(`${config.backend.url}/api/estudiantes`, { 
      timeout: config.backend.timeout 
    });
    
    if (studentsResponse.status === 200) {
      print(colors.green, '✅ Backend API: OK');
      return true;
    } else {
      print(colors.red, `❌ Backend API: Error ${studentsResponse.status}`);
      return false;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      print(colors.yellow, '⚠️ Backend: Requiere autenticación (normal)');
      return true;
    }
    print(colors.red, `❌ Backend: ${error.message}`);
    return false;
  }
}

// Función para verificar base de datos
async function checkDatabase() {
  try {
    print(colors.blue, '🔍 Verificando Base de Datos...');
    
    const pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      max: 1,
      idleTimeoutMillis: 5000,
      connectionTimeoutMillis: 5000
    });

    const client = await pool.connect();
    
    // Verificar conexión básica
    const result = await client.query('SELECT 1 as test');
    
    if (result.rows[0].test === 1) {
      print(colors.green, '✅ Base de Datos: Conexión OK');
    }

    // Verificar tablas principales
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('estudiantes', 'usuarios', 'entrevistas', 'evaluaciones_vocacionales')
      ORDER BY table_name
    `);

    const expectedTables = ['estudiantes', 'usuarios', 'entrevistas', 'evaluaciones_vocacionales'];
    const existingTables = tablesResult.rows.map(row => row.table_name);
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));

    if (missingTables.length === 0) {
      print(colors.green, '✅ Base de Datos: Tablas principales OK');
    } else {
      print(colors.yellow, `⚠️ Base de Datos: Faltan tablas: ${missingTables.join(', ')}`);
    }

    // Verificar conteo de registros
    const countResult = await client.query('SELECT COUNT(*) as total FROM estudiantes');
    const studentCount = parseInt(countResult.rows[0].total);
    
    if (studentCount > 0) {
      print(colors.green, `✅ Base de Datos: ${studentCount} estudiantes encontrados`);
    } else {
      print(colors.yellow, '⚠️ Base de Datos: No hay estudiantes registrados');
    }

    client.release();
    await pool.end();
    
    return true;
  } catch (error) {
    print(colors.red, `❌ Base de Datos: ${error.message}`);
    return false;
  }
}

// Función para verificar configuración
function checkConfiguration() {
  print(colors.blue, '🔍 Verificando Configuración...');
  
  const requiredEnvVars = [
    'PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE',
    'JWT_SECRET', 'NODE_ENV', 'PORT'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length === 0) {
    print(colors.green, '✅ Configuración: Variables de entorno OK');
    return true;
  } else {
    print(colors.red, `❌ Configuración: Faltan variables: ${missingVars.join(', ')}`);
    return false;
  }
}

// Función para verificar puertos
function checkPorts() {
  print(colors.blue, '🔍 Verificando Puertos...');
  
  const netstat = require('child_process').execSync('netstat -tuln', { encoding: 'utf8' });
  
  const frontendPort = config.frontend.url.includes('5174') ? '5174' : '80';
  const backendPort = config.backend.url.includes('3001') ? '3001' : '80';
  
  const frontendListening = netstat.includes(`:${frontendPort}`);
  const backendListening = netstat.includes(`:${backendPort}`);
  
  if (frontendListening) {
    print(colors.green, `✅ Puerto ${frontendPort}: Frontend escuchando`);
  } else {
    print(colors.red, `❌ Puerto ${frontendPort}: Frontend no está escuchando`);
  }
  
  if (backendListening) {
    print(colors.green, `✅ Puerto ${backendPort}: Backend escuchando`);
  } else {
    print(colors.red, `❌ Puerto ${backendPort}: Backend no está escuchando`);
  }
  
  return frontendListening && backendListening;
}

// Función principal
async function main() {
  print(colors.bold, '\n🏥 VERIFICACIÓN DE SALUD - SIGO PRO\n');
  print(colors.blue, '=' .repeat(50));
  
  const results = {
    configuration: checkConfiguration(),
    ports: checkPorts(),
    database: await checkDatabase(),
    backend: await checkBackend(),
    frontend: await checkFrontend()
  };
  
  print(colors.blue, '\n' + '=' .repeat(50));
  print(colors.bold, '\n📊 RESUMEN DE VERIFICACIÓN\n');
  
  const allPassed = Object.values(results).every(result => result === true);
  
  Object.entries(results).forEach(([component, passed]) => {
    const status = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    print(color, `${status} ${component.toUpperCase()}`);
  });
  
  print(colors.blue, '\n' + '=' .repeat(50));
  
  if (allPassed) {
    print(colors.green, '\n🎉 ¡SIGO PRO está funcionando correctamente!');
    process.exit(0);
  } else {
    print(colors.red, '\n⚠️ Se encontraron problemas en el sistema.');
    print(colors.yellow, 'Revisa los errores anteriores y corrige los problemas.');
    process.exit(1);
  }
}

// Manejo de errores
process.on('unhandledRejection', (error) => {
  print(colors.red, `\n❌ Error inesperado: ${error.message}`);
  process.exit(1);
});

// Ejecutar verificación
if (require.main === module) {
  main().catch(error => {
    print(colors.red, `\n❌ Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main, checkFrontend, checkBackend, checkDatabase, checkConfiguration, checkPorts };
