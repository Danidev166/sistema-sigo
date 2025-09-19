import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook personalizado para manejar la autenticación
 * 
 * Proporciona acceso al contexto de autenticación y métodos útiles
 * para verificar el estado de autenticación del usuario.
 * 
 * @returns {Object} Objeto con el estado de autenticación y métodos
 * @returns {Object|null} returns.user - Datos del usuario autenticado
 * @returns {boolean} returns.isAuthenticated - Si el usuario está autenticado
 * @returns {boolean} returns.isLoading - Si está cargando la autenticación
 * @returns {Function} returns.login - Función para iniciar sesión
 * @returns {Function} returns.logout - Función para cerrar sesión
 * @returns {Function} returns.register - Función para registrar usuario
 * @returns {boolean} returns.isAdmin - Si el usuario es administrador
 * @returns {boolean} returns.isOrientador - Si el usuario es orientador
 * 
 * @example
 * ```jsx
 * import { useAuth } from '../hooks/useAuth';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 * 
 *   if (!isAuthenticated) {
 *     return <div>Por favor, inicie sesión</div>;
 *   }
 * 
 *   return (
 *     <div>
 *       <h1>Bienvenido, {user.nombre}</h1>
 *       <button onClick={logout}>Cerrar sesión</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```jsx
 * // Verificar roles de usuario
 * function AdminPanel() {
 *   const { isAdmin, isOrientador } = useAuth();
 * 
 *   if (!isAdmin) {
 *     return <div>Acceso denegado</div>;
 *   }
 * 
 *   return <div>Panel de administración</div>;
 * }
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  const { user, login, logout, register, isLoading } = context;
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    isAdmin: user?.rol === 'Admin',
    isOrientador: user?.rol === 'Orientador',
  };
}; 