import logo from "../../../assets/logo-pages.png";
import { useAuth } from "../../../context/useAuth";
import NotificacionBadge from '../../notificaciones/components/NotificacionBadge';

/**
 * Header del dashboard con información del usuario.
 *
 * @param {Object} props
 * @param {Object} props.user - Datos del usuario autenticado
 * @returns {JSX.Element}
 *
 * @example
 * <DashboardHeader user={user} />
 */

export default function DashboardHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4 bg-white dark:bg-slate-800 rounded-xl shadow p-4 sm:p-6 mb-6">
      {/* Logo y bienvenida */}
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="Logo institucional"
          className="w-16 h-16 object-cover rounded-full border-2 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-slate-100 p-1"
        />
        <div className="text-left">
          <p className="text-body-sm text-gray-500 dark:text-gray-300">Bienvenido/a</p>
          <h1 className="text-h4 font-semibold text-gray-800 dark:text-white">
            {user.nombre} {user.apellido}
          </h1>
          <span className="text-caption text-gray-500 dark:text-gray-400 font-medium">
            {user.rol}
          </span>
        </div>
      </div>

      {/* Badge de notificaciones en la barra superior */}
      <NotificacionBadge />

      {/* Texto institucional */}
      <div className="text-body-sm text-gray-400 dark:text-gray-300 font-medium text-center sm:text-right">
        SIGO · Liceo Politécnico Bicentenario Caupolicán
      </div>
    </div>
  );
}
