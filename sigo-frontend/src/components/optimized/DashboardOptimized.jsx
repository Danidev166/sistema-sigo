import React, { memo, useMemo, useCallback } from 'react';
import { LayoutShiftFix, ListPlaceholder } from '../ui/LayoutShiftFix';
import { useOptimizedAPI } from '../../hooks/useOptimizedAPI';

/**
 * Dashboard Optimizado
 * 
 * Este componente implementa optimizaciones específicas
 * para mejorar el CLS y el rendimiento general.
 */
const DashboardOptimized = memo(() => {
  // API optimizada con cache
  const { data: dashboardData, loading, error } = useOptimizedAPI(
    useCallback(async () => {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Error al cargar dashboard');
      return response.json();
    }, []),
    {
      cacheTime: 5 * 60 * 1000, // 5 minutos
      debounceMs: 0 // Sin debounce para datos críticos
    }
  );

  // Memoizar estadísticas para evitar recálculos
  const stats = useMemo(() => {
    if (!dashboardData) return null;
    
    return {
      estudiantes: dashboardData.estudiantes || 0,
      entrevistas: dashboardData.entrevistas || 0,
      recursos: dashboardData.recursos || 0,
      evaluaciones: dashboardData.evaluaciones || 0
    };
  }, [dashboardData]);

  // Memoizar cards para evitar re-renders
  const StatCard = memo(({ title, value, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  ));

  // Renderizar contenido con layout shift fix
  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          <ListPlaceholder itemCount={5} itemHeight={80} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-600 text-lg">Error al cargar el dashboard</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Estudiantes"
            value={stats?.estudiantes || 0}
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>}
            color="blue"
          />
          <StatCard
            title="Entrevistas"
            value={stats?.entrevistas || 0}
            icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            color="green"
          />
          <StatCard
            title="Recursos"
            value={stats?.recursos || 0}
            icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            color="yellow"
          />
          <StatCard
            title="Evaluaciones"
            value={stats?.evaluaciones || 0}
            icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="purple"
          />
        </div>

        {/* Contenido adicional con layout shift fix */}
        <LayoutShiftFix minHeight="300px">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Actividad Reciente
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Nueva entrevista programada</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Estudiante agregado al sistema</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Evaluación completada</span>
              </div>
            </div>
          </div>
        </LayoutShiftFix>
      </div>
    );
  }, [loading, error, stats]);

  return (
    <LayoutShiftFix minHeight="600px" className="p-6">
      {renderContent()}
    </LayoutShiftFix>
  );
});

DashboardOptimized.displayName = 'DashboardOptimized';

export default DashboardOptimized;
