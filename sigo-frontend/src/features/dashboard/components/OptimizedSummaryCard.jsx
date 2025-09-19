import { memo } from 'react';

/**
 * Tarjeta de resumen optimizada para el dashboard.
 *
 * @param {Object} props
 * @param {string} props.title - Título de la tarjeta
 * @param {string|number} props.value - Valor a mostrar
 * @param {React.ReactNode} props.icon - Icono de la tarjeta
 * @param {string} props.color - Color de la tarjeta
 * @returns {JSX.Element}
 *
 * @example
 * <OptimizedSummaryCard title="Estudiantes" value={150} icon={<UsersIcon />} color="blue" />
 */
const OptimizedSummaryCard = memo(({ title, value, icon, color = "blue" }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-500 dark:bg-blue-600",
      iconBg: "bg-blue-600 dark:bg-blue-700",
    },
    green: {
      bg: "bg-green-500 dark:bg-green-600",
      iconBg: "bg-green-600 dark:bg-green-700",
    },
    red: {
      bg: "bg-red-500 dark:bg-red-600",
      iconBg: "bg-red-600 dark:bg-red-700",
    },
    violet: {
      bg: "bg-violet-500 dark:bg-violet-600",
      iconBg: "bg-violet-600 dark:bg-violet-700",
    },
    yellow: {
      bg: "bg-yellow-400 dark:bg-yellow-500",
      iconBg: "bg-yellow-500 dark:bg-yellow-600",
    },
  };

  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className={`rounded-lg sm:rounded-xl shadow-md text-white ${styles.bg} p-4 sm:p-6 flex justify-between items-center`}>
      <div>
        <p className="text-xs sm:text-sm uppercase tracking-wide opacity-90">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1">
          {value}
        </h3>
      </div>
      <div className={`p-2 sm:p-3 rounded-full ${styles.iconBg}`}>
        {icon}
      </div>
    </div>
  );
});

OptimizedSummaryCard.displayName = 'OptimizedSummaryCard';

export default OptimizedSummaryCard;
