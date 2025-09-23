import { memo } from 'react';
import tokens from '../../../styles/design-tokens';

/**
 * Tarjeta de resumen optimizada para el dashboard.
 *
 * @param {Object} props
 * @param {string} props.title - Título de la tarjeta
 * @param {string|number} props.value - Valor a mostrar
 * @param {React.ReactNode} props.icon - Icono de la tarjeta
 * @param {string} props.color - Color de la tarjeta
 * @param {boolean} props.loading - Estado de carga
 * @returns {JSX.Element}
 *
 * @example
 * <OptimizedSummaryCard title="Estudiantes" value={150} icon={<UsersIcon />} color="blue" />
 */
const OptimizedSummaryCard = memo(({ title, value, icon, color = "blue", loading = false }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-500 dark:bg-blue-600",
      iconBg: "bg-blue-600 dark:bg-blue-700",
      hover: "hover:bg-blue-600 dark:hover:bg-blue-700",
    },
    green: {
      bg: "bg-green-500 dark:bg-green-600",
      iconBg: "bg-green-600 dark:bg-green-700",
      hover: "hover:bg-green-600 dark:hover:bg-green-700",
    },
    red: {
      bg: "bg-red-500 dark:bg-red-600",
      iconBg: "bg-red-600 dark:bg-red-700",
      hover: "hover:bg-red-600 dark:hover:bg-red-700",
    },
    violet: {
      bg: "bg-violet-500 dark:bg-violet-600",
      iconBg: "bg-violet-600 dark:bg-violet-700",
      hover: "hover:bg-violet-600 dark:hover:bg-violet-700",
    },
    yellow: {
      bg: "bg-yellow-400 dark:bg-yellow-500",
      iconBg: "bg-yellow-500 dark:bg-yellow-600",
      hover: "hover:bg-yellow-500 dark:hover:bg-yellow-600",
    },
  };

  const styles = colorMap[color] || colorMap.blue;

  if (loading) {
    return (
      <div className="rounded-xl shadow-md bg-gray-200 dark:bg-gray-700 p-6 flex justify-between items-center animate-pulse">
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`
      rounded-xl shadow-lg text-white transition-all duration-300 ease-in-out
      ${styles.bg} ${styles.hover} hover:shadow-2xl hover:scale-105
      p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center group
      animate-fade-in hover-lift
      relative overflow-hidden min-h-[120px] sm:min-h-[140px]
    `}>
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      <div className="flex-1 relative z-10 w-full">
        <p className="text-label opacity-90 text-xs sm:text-sm">
          {title}
        </p>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 transition-all duration-200 group-hover:scale-105 text-glow">
          {value}
        </h3>
      </div>
      <div className={`
        p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out
        ${styles.iconBg} group-hover:scale-110 group-hover:rotate-3
        shadow-lg group-hover:shadow-xl
        relative z-10 self-end sm:self-center mt-2 sm:mt-0
      `}>
        <div className="w-6 h-6 sm:w-7 sm:h-7">
          {icon}
        </div>
      </div>
    </div>
  );
});

OptimizedSummaryCard.displayName = 'OptimizedSummaryCard';

export default OptimizedSummaryCard;
