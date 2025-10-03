import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AcademicPerformanceChart = ({ 
  data = [], 
  type = 'line', 
  height = 300,
  showLegend = true,
  showGrid = true,
  className = ''
}) => {
  // Colores para las diferentes métricas
  const colors = {
    nota: '#3B82F6',
    promedio_curso: '#10B981',
    asistencia: '#F59E0B',
    rendimiento: '#8B5CF6'
  };

  // Configuración del tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">
                {entry.name}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Renderizar gráfico de líneas
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
        <XAxis 
          dataKey="asignatura" 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
        />
        <YAxis 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
          domain={[0, 7]}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Line 
          type="monotone" 
          dataKey="nota" 
          stroke={colors.nota} 
          strokeWidth={2}
          dot={{ fill: colors.nota, strokeWidth: 2, r: 4 }}
          name="Nota del Estudiante"
        />
        <Line 
          type="monotone" 
          dataKey="promedio_curso" 
          stroke={colors.promedio_curso} 
          strokeWidth={2}
          dot={{ fill: colors.promedio_curso, strokeWidth: 2, r: 4 }}
          name="Promedio del Curso"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Renderizar gráfico de barras
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
        <XAxis 
          dataKey="asignatura" 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
        />
        <YAxis 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
          domain={[0, 7]}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Bar 
          dataKey="nota" 
          fill={colors.nota}
          name="Nota del Estudiante"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="promedio_curso" 
          fill={colors.promedio_curso}
          name="Promedio del Curso"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Renderizar gráfico de pastel
  const renderPieChart = () => {
    const pieData = data.map(item => ({
      name: item.asignatura,
      value: item.nota,
      color: item.nota >= 6 ? '#10B981' : item.nota >= 4 ? '#F59E0B' : '#EF4444'
    }));

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-${height} bg-gray-50 dark:bg-slate-800 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-600 mb-2">
            📊
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No hay datos suficientes para mostrar el gráfico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700 ${className}`}>
      {type === 'line' && renderLineChart()}
      {type === 'bar' && renderBarChart()}
      {type === 'pie' && renderPieChart()}
    </div>
  );
};

export default AcademicPerformanceChart;
