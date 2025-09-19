/**
 * Tarjeta de resumen para reportes.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título de la tarjeta
 * @param {string|number} props.valor - Valor a mostrar
 * @param {string} props.icono - Icono de la tarjeta
 * @returns {JSX.Element}
 *
 * @example
 * <ReporteResumenCard titulo="Total Estudiantes" valor={150} icono="users" />
 */
// src/features/reportes/components/ReporteResumenCard.jsx
import {
  CalendarCheck,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Mapa de íconos estilizados
const iconMap = {
  calendar: <CalendarCheck className="w-6 h-6 text-blue-600" />,
  users: <Users className="w-6 h-6 text-green-600" />,
  alert: <AlertTriangle className="w-6 h-6 text-red-600" />,
  check: <CheckCircle className="w-6 h-6 text-indigo-600" />,
};

export default function ReporteResumenCard({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-4 flex items-center gap-4 min-w-[220px] sm:min-w-0 transition hover:shadow-lg hover:scale-[1.01]">
      <div className="p-3 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center min-w-[48px] min-h-[48px]">
        {iconMap[icon] || <CheckCircle className="w-6 h-6 text-gray-500" />}
      </div>
      <div className="flex flex-col">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium">
          {title}
        </span>
        <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </span>
      </div>
    </div>
  );
}
