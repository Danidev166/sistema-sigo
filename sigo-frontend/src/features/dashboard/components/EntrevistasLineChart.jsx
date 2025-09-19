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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Entrevistas por mes
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="mes" stroke="#8884d8" className="text-sm" />
          <YAxis stroke="#8884d8" className="text-sm" />
          <Tooltip
            contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            labelStyle={{ color: '#374151', fontWeight: 600 }}
            itemStyle={{ color: '#2563eb' }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

EntrevistasLineChart.displayName = 'EntrevistasLineChart';

export default EntrevistasLineChart;
