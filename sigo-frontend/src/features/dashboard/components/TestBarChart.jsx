import { memo, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatearCurso } from '../../../features/estudiantes/constants/cursos';
import useResponsive from '../../../hooks/useResponsive';

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
  const { isMobile, isSmallScreen } = useResponsive();
  
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
      'Test Kuder': Number(item.Kuder) || 0,
      'Test Holland': Number(item.Holland) || 0,
      'Test Aptitudes': Number(item.Aptitudes) || 0,
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
          Evaluaciones Vocacionales por Especialidad
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Distribución de tests aplicados según tipo de evaluación
        </p>
      </div>
      <div className="chart-responsive">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ 
              top: 10, 
              right: isMobile ? 5 : 20, 
              left: isMobile ? 5 : 10, 
              bottom: isMobile ? 60 : 50 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="especialidad" 
              stroke="#64748b"
              angle={isMobile ? -90 : -45}
              textAnchor="end"
              height={isMobile ? 100 : 80}
              fontSize={isMobile ? 10 : 12}
              interval={isMobile ? 0 : "preserveStartEnd"}
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
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                maxWidth: isMobile ? "200px" : "300px"
              }}
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `Especialidad: ${label}`}
            />
            <Legend 
              verticalAlign="top" 
              height={isMobile ? 50 : 36}
              wrapperStyle={{ 
                paddingBottom: '10px',
                fontSize: isMobile ? '10px' : '12px'
              }}
            />
            <Bar 
              dataKey="Test Kuder" 
              fill="#2563eb" 
              name="Test Kuder"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="Test Holland" 
              fill="#7c3aed" 
              name="Test Holland"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="Test Aptitudes" 
              fill="#059669" 
              name="Test Aptitudes"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

TestBarChart.displayName = 'TestBarChart';

export default TestBarChart;
