import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { publicRoutes, privateRoutes, fallbackRoute } from './configRouter';
import ProtectedRoute from './ProtectedRoute';
import NotificacionesPage from '../features/notificaciones/pages/NotificacionesPage';
import ConsistencyTest from '../components/ConsistencyTest';

// Componente de carga optimizado
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-sm text-gray-600 dark:text-gray-400">Cargando...</p>
    </div>
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route 
            key={path} 
            path={path} 
            element={element}
          />
        ))}

        {privateRoutes.map(({ path, element, roles }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
            }
          />
        ))}

        {/* Fallback para 404 */}
        <Route 
          path={fallbackRoute.path} 
          element={fallbackRoute.element}
        />

        {/* Ruta de notificaciones */}
        <Route path="/notificaciones" element={<NotificacionesPage />} />
        
        {/* Ruta temporal para prueba de consistencia */}
        <Route path="/consistency-test" element={<ConsistencyTest />} />
      </Routes>
    </Suspense>
  );
}
