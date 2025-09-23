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
import SkeletonLoader from "../../../components/ui/SkeletonLoader";

export default function QuickActionsPanelV2({ 
  loading = false, 
  error = null, 
  userRole = 'user' 
}) {
  // Si hay error, mostrar mensaje de error
  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-fade-in">
        <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  // Si está cargando, mostrar skeleton loading
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-fade-in">
        <div className="space-y-4">
          <SkeletonLoader variant="text" lines={1} className="h-6 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLoader key={index} variant="button" className="h-12 w-full" />
            ))}
          </div>
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-fade-in">
      <h2 className="section-title">
        Acciones rápidas
      </h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            role={action.role}
            aria-label={action["aria-label"]}
            className="
              flex items-center gap-3 bg-gray-100 dark:bg-slate-700 
              hover:bg-gray-200 dark:hover:bg-slate-600 
              p-3 rounded-lg transition-all duration-200 ease-in-out
              text-gray-800 dark:text-white text-sm font-medium
              hover:scale-105 hover:shadow-md group
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            "
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <span className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
              {action.icon}
            </span>
            <span className="flex-1">{action.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
