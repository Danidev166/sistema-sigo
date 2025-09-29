/**
 * Script de prueba para verificar el sistema de recuperación de contraseña
 * Prueba con el usuario daniel1822@gmail.com
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

// Configuración de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función para probar el envío de código de recuperación
async function probarEnvioCodigo(email) {
  console.log(`\n🔍 Probando envío de código de recuperación para: ${email}`);
  
  try {
    const response = await api.post('/auth/recuperar', {
      email: email
    });
    
    console.log('✅ Respuesta del servidor:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar código:', error.response?.data || error.message);
    return false;
  }
}

// Función para probar la verificación del código (simulada)
async function probarVerificacionCodigo(email, codigo, nuevaPassword) {
  console.log(`\n🔍 Probando verificación de código para: ${email}`);
  console.log(`📝 Código: ${codigo}`);
  console.log(`🔑 Nueva contraseña: ${nuevaPassword}`);
  
  try {
    const response = await api.post('/auth/verificar-codigo', {
      email: email,
      codigo: codigo,
      password: nuevaPassword
    });
    
    console.log('✅ Respuesta del servidor:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error al verificar código:', error.response?.data || error.message);
    return false;
  }
}

// Función para probar login con la nueva contraseña
async function probarLogin(email, password) {
  console.log(`\n🔍 Probando login con nueva contraseña para: ${email}`);
  
  try {
    const response = await api.post('/auth/login', {
      email: email,
      password: password
    });
    
    console.log('✅ Login exitoso:', {
      message: response.data.message,
      usuario: response.data.usuario
    });
    return true;
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data || error.message);
    return false;
  }
}

// Función principal de prueba
async function ejecutarPruebas() {
  console.log('🚀 Iniciando pruebas de recuperación de contraseña');
  console.log('=' .repeat(60));
  
  const email = 'daniel1822@gmail.com';
  const nuevaPassword = 'nuevaPassword123';
  
  // Paso 1: Enviar código de recuperación
  console.log('\n📧 PASO 1: Enviar código de recuperación');
  const envioExitoso = await probarEnvioCodigo(email);
  
  if (!envioExitoso) {
    console.log('❌ No se pudo enviar el código. Deteniendo pruebas.');
    return;
  }
  
  // Paso 2: Simular verificación (necesitarías el código real del email)
  console.log('\n🔐 PASO 2: Verificación de código (simulada)');
  console.log('⚠️  NOTA: Para probar completamente, necesitas:');
  console.log('   1. Revisar los logs del servidor para obtener el código');
  console.log('   2. O configurar el envío de emails reales');
  console.log('   3. O revisar la base de datos para obtener el código');
  
  // Simular con un código de prueba
  const codigoSimulado = '123456';
  const verificacionExitoso = await probarVerificacionCodigo(email, codigoSimulado, nuevaPassword);
  
  if (verificacionExitoso) {
    // Paso 3: Probar login con nueva contraseña
    console.log('\n🔑 PASO 3: Probar login con nueva contraseña');
    await probarLogin(email, nuevaPassword);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Pruebas completadas');
}

// Función para verificar el estado del usuario en la base de datos
async function verificarEstadoUsuario(email) {
  console.log(`\n🔍 Verificando estado del usuario: ${email}`);
  
  try {
    // Intentar login con contraseña actual para verificar que el usuario existe
    const response = await api.post('/auth/login', {
      email: email,
      password: 'fran0404' // Contraseña actual conocida
    });
    
    console.log('✅ Usuario encontrado y activo:', response.data.usuario);
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('⚠️  Usuario existe pero contraseña incorrecta o cuenta inactiva');
      console.log('📝 Detalles:', error.response.data);
    } else {
      console.error('❌ Error al verificar usuario:', error.response?.data || error.message);
    }
    return false;
  }
}

// Ejecutar las pruebas
if (require.main === module) {
  ejecutarPruebas().catch(console.error);
}

module.exports = {
  probarEnvioCodigo,
  probarVerificacionCodigo,
  probarLogin,
  verificarEstadoUsuario
};
