import { Link } from "react-router-dom";
import {
  Search,
  CalendarPlus,
  PackagePlus,
  FileDown,
  UserPlus,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function QuickActionsPanelV2({ 
  loading = false, 
  error = null, 
  userRole = 'user' 
}) {
  // Si hay error, mostrar mensaje de error
  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
        <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  // Si está cargando, mostrar estado de carga
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
        <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  // Acciones básicas para todos los usuarios
  const basicActions = [
    {
      to: "/estudiantes",
      icon: <Search size={18} className="sm:w-5 sm:h-5" />,
      text: "Buscar estudiante",
      role: "button",
      "aria-label": "Buscar estudiante"
    },
    {
      to: "/agenda",
      icon: <CalendarPlus size={18} className="sm:w-5 sm:h-5" />,
      text: "Agendar entrevista",
      role: "button",
      "aria-label": "Agendar entrevista"
    },
    {
      to: "/recursos",
      icon: <PackagePlus size={18} className="sm:w-5 sm:h-5" />,
      text: "Registrar recurso",
      role: "button",
      "aria-label": "Registrar recurso"
    },
    {
      to: "/reportes",
      icon: <FileDown size={18} className="sm:w-5 sm:h-5" />,
      text: "Generar reporte PDF",
      role: "button",
      "aria-label": "Generar reporte PDF"
    },
  ];

  // Acciones adicionales para usuarios regulares
  const userActions = [
    {
      to: "/estudiantes/nuevo",
      icon: <UserPlus size={18} className="sm:w-5 sm:h-5" />,
      text: "Nuevo estudiante",
      role: "button",
      "aria-label": "Nuevo estudiante"
    },
  ];

  // Acciones adicionales para administradores
  const adminActions = [
    {
      to: "/usuarios",
      icon: <Users size={18} className="sm:w-5 sm:h-5" />,
      text: "Gestión de usuarios",
      role: "button",
      "aria-label": "Gestión de usuarios"
    },
  ];

  // Combinar acciones según el rol
  let actions = [...basicActions];
  if (userRole === 'user') {
    actions = [...actions, ...userActions];
  } else if (userRole === 'admin') {
    actions = [...actions, ...adminActions];
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
        Acciones rápidas
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            role={action.role}
            aria-label={action["aria-label"]}
            className="flex items-center gap-2 sm:gap-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 p-2.5 sm:p-3 rounded-md transition text-gray-800 dark:text-white text-sm sm:text-base font-medium"
          >
            {action.icon}
            {action.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
