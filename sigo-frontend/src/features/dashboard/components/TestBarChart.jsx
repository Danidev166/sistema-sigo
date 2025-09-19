import { memo, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatearCurso } from '../../../features/estudiantes/constants/cursos';

/**
 * Gráfico de barras para mostrar tests por especialidad.
 *
 * @param {Object} props
 * @param {Array} props.data - Datos de tests por especialidad
 * @returns {JSX.Element}
 *
 * @example
 * <TestBarChart data={testData} />
 */
const TestBarChart = memo(({ data }) => {
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    // Filtrar datos válidos (solo cursos de enseñanza media)
    const datosValidos = data.filter(item => {
      const curso = item.especialidad?.toString().toLowerCase() || '';
      // Filtrar valores de prueba, debug, test, etc.
      const valoresInvalidos = ['debug', 'test', 'prueba', 'demo', 'ejemplo', 'null', 'undefined', ''];
      return !valoresInvalidos.includes(curso) && curso.length > 0;
    });
    
    return datosValidos.map(item => ({
      especialidad: formatearCurso(item.especialidad),
      Kuder: Number(item.Kuder) || 0,
      Holland: Number(item.Holland) || 0,
      Aptitudes: Number(item.Aptitudes) || 0,
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
        Test aplicados por especialidad
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="especialidad" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              fontSize: "0.875rem",
            }}
          />
          <Bar dataKey="Kuder" fill="#3b82f6" />
          <Bar dataKey="Holland" fill="#8b5cf6" />
          <Bar dataKey="Aptitudes" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

TestBarChart.displayName = 'TestBarChart';

export default TestBarChart;
