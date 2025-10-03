import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const AttendanceChart = ({ 
  data = [], 
  type = 'line', 
  height = 300,
  showLegend = true,
  showGrid = true,
  className = ''
}) => {
  // Colores para los diferentes tipos de asistencia
  const colors = {
    presente: '#10B981',
    ausente: '#EF4444',
    justificada: '#F59E0B',
    pendiente: '#6B7280',
    porcentaje: '#3B82F6'
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
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Renderizar gráfico de líneas para tendencia de asistencia
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
        <XAxis 
          dataKey="fecha" 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
        />
        <YAxis 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Line 
          type="monotone" 
          dataKey="porcentaje_asistencia" 
          stroke={colors.porcentaje} 
          strokeWidth={3}
          dot={{ fill: colors.porcentaje, strokeWidth: 2, r: 5 }}
          name="Porcentaje de Asistencia"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Renderizar gráfico de barras para comparación mensual
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
        <XAxis 
          dataKey="mes" 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
        />
        <YAxis 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Bar 
          dataKey="presentes" 
          fill={colors.presente}
          name="Presentes"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="ausentes" 
          fill={colors.ausente}
          name="Ausentes"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="justificadas" 
          fill={colors.justificada}
          name="Justificadas"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Renderizar gráfico de área para tendencia
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
        <XAxis 
          dataKey="fecha" 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
        />
        <YAxis 
          stroke="#6B7280"
          fontSize={12}
          tick={{ fill: '#6B7280' }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Area
          type="monotone"
          dataKey="porcentaje_asistencia"
          stroke={colors.porcentaje}
          fill={colors.porcentaje}
          fillOpacity={0.3}
          name="Porcentaje de Asistencia"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  // Renderizar gráfico de pastel para distribución
  const renderPieChart = () => {
    const pieData = [
      { name: 'Presentes', value: data.reduce((sum, item) => sum + (item.presentes || 0), 0), color: colors.presente },
      { name: 'Ausentes', value: data.reduce((sum, item) => sum + (item.ausentes || 0), 0), color: colors.ausente },
      { name: 'Justificadas', value: data.reduce((sum, item) => sum + (item.justificadas || 0), 0), color: colors.justificada },
      { name: 'Pendientes', value: data.reduce((sum, item) => sum + (item.pendientes || 0), 0), color: colors.pendiente }
    ].filter(item => item.value > 0);

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
      {type === 'area' && renderAreaChart()}
      {type === 'pie' && renderPieChart()}
    </div>
  );
};

export default AttendanceChart;
