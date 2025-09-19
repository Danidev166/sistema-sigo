// Script para probar login con usuario real
require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testLoginReal() {
  try {
    console.log('��� Probando login con usuario real...\n');

    // 1. Probar login con usuario activo
    console.log('1. Probando login con usuario ACTIVO (pamefern5@gmail.com)...');
    try {
      const loginActivo = await axios.post(`${API_BASE}/auth/login`, {
        email: 'pamefern5@gmail.com',
        password: '12345678' // Asumiendo contraseña por defecto
      });
      console.log('✅ Login exitoso con usuario activo');
      console.log('Token:', loginActivo.data.token.substring(0, 20) + '...');
    } catch (error) {
      console.log('❌ Error con usuario activo:', error.response?.data?.error || error.message);
    }

    console.log('\n2. Probando login con usuario INACTIVO (daniel1822@gmail.com)...');
    try {
      const loginInactivo = await axios.post(`${API_BASE}/auth/login`, {
        email: 'daniel1822@gmail.com',
        password: '12345678'
      });
      console.log('❌ ERROR: El usuario inactivo pudo hacer login');
    } catch (error) {
      if (error.response?.data?.error?.includes('inactiva')) {
        console.log('✅ CORRECTO: El usuario inactivo no puede hacer login');
        console.log('Mensaje:', error.response.data.error);
      } else {
        console.log('❌ Error inesperado:', error.response?.data?.error || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testLoginReal();
