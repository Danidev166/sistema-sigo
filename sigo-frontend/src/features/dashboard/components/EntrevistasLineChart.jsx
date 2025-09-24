import { memo, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import useResponsive from '../../../hooks/useResponsive';

/**
 * Gráfico de línea para mostrar entrevistas por mes.
 *
 * @param {Object} props
 * @param {Array} props.data - Datos de entrevistas por mes
 * @returns {JSX.Element}
 *
 * @example
 * <EntrevistasLineChart data={entrevistasData} />
 */

const EntrevistasLineChart = memo(({ data }) => {
  const { isMobile, isSmallScreen } = useResponsive();
  
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      ...item,
      total: Number(item.total) || 0
    }));
  }, [data]);

  if (!processedData.length) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 h-80 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-3 sm:p-4 lg:p-6">
      <div className="mb-3 sm:mb-4">
        <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-white mb-1 sm:mb-2">
          Entrevistas Realizadas por Mes
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Evolución mensual de entrevistas con estudiantes
        </p>
      </div>
      <div className="chart-responsive">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData}
            margin={{ 
              top: 10, 
              right: isMobile ? 5 : 20, 
              left: isMobile ? 5 : 10, 
              bottom: 10 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="mes" 
              stroke="#64748b" 
              fontSize={isMobile ? 10 : 12}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={isMobile ? 10 : 12}
              label={{ 
                value: 'Cantidad', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: isMobile ? 10 : 12 }
              }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                maxWidth: isMobile ? "200px" : "300px"
              }}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
              itemStyle={{ color: '#2563eb' }}
              formatter={(value, name) => [value, 'Entrevistas']}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={isMobile ? 2 : 3}
              dot={{ 
                r: isMobile ? 4 : 6, 
                fill: '#2563eb', 
                stroke: '#ffffff', 
                strokeWidth: 2 
              }}
              activeDot={{ 
                r: isMobile ? 6 : 8, 
                fill: '#1d4ed8', 
                stroke: '#ffffff', 
                strokeWidth: 2 
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

EntrevistasLineChart.displayName = 'EntrevistasLineChart';

export default EntrevistasLineChart;
