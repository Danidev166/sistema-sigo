import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <p className="text-white text-center mt-10">Cargando...</p>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && (!user || !roles.includes(user.rol))) {
    console.warn('⛔ Usuario sin rol autorizado:', user?.rol);
    return <Navigate to="/" replace />;
  }

  return children;
}
