// Utilidad para debuggear la autenticación
export const debugAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('🔍 Debug de autenticación:');
  console.log('- Token existe:', !!token);
  console.log('- Token valor:', token ? token.substring(0, 20) + '...' : 'No hay token');
  console.log('- User existe:', !!user);
  console.log('- User valor:', user);
  
  if (!token) {
    console.error('❌ No hay token de autenticación');
    console.log('💡 Solución: El usuario debe iniciar sesión');
  }
  
  if (!user) {
    console.error('❌ No hay datos de usuario');
    console.log('💡 Solución: El usuario debe iniciar sesión');
  }
  
  return { token, user };
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return false;
  }
  
  try {
    const userData = JSON.parse(user);
    return userData && userData.id;
  } catch (error) {
    console.error('Error al parsear datos de usuario:', error);
    return false;
  }
};
