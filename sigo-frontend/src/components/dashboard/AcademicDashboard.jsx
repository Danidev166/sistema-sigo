import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, BookOpen, Users, Download, RefreshCw, FileText } from 'lucide-react';
import AcademicPerformanceChart from '../charts/AcademicPerformanceChart';
import AttendanceChart from '../charts/AttendanceChart';
// import exportToPDF from '../../services/exportService';

const AcademicDashboard = ({ 
  idEstudiante, 
  seguimientoData = [], 
  asistenciaData = [],
  estadisticasSeguimiento = null,
  estadisticasAsistencia = null,
  onRefresh,
  className = ''
}) => {
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [selectedAttendanceType, setSelectedAttendanceType] = useState('line');
  const [isLoading, setIsLoading] = useState(false);

  // Procesar datos para gráficos
  const processedSeguimientoData = seguimientoData.map(item => ({
    ...item,
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }));

  const processedAsistenciaData = asistenciaData.map(item => ({
    ...item,
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    porcentaje_asistencia: item.tipo === 'Presente' || item.tipo === 'Justificada' ? 100 : 0
  }));

  // Agrupar datos de asistencia por mes
  const monthlyAttendanceData = asistenciaData.reduce((acc, item) => {
    const month = new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { mes: month, presentes: 0, ausentes: 0, justificadas: 0, pendientes: 0 };
    }
    
    if (item.tipo === 'Presente') acc[month].presentes++;
    else if (item.tipo === 'Ausente') acc[month].ausentes++;
    else if (item.tipo === 'Justificada') acc[month].justificadas++;
    else if (item.tipo === 'Pendiente') acc[month].pendientes++;
    
    return acc;
  }, {});

  const monthlyData = Object.values(monthlyAttendanceData);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await onRefresh();
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Crear datos para exportación
    const exportData = {
      seguimiento: seguimientoData,
      asistencia: asistenciaData,
      estadisticas: {
        seguimiento: estadisticasSeguimiento,
        asistencia: estadisticasAsistencia
      },
      fecha_exportacion: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-academico-${idEstudiante}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = (type) => {
    // Temporalmente deshabilitado para debug
    console.log('Exportación PDF temporalmente deshabilitada:', type);
    return;
    
    // const estudianteInfo = {
    //   nombre: `Estudiante ${idEstudiante}`,
    //   curso: 'Curso Actual'
    // };

    // let pdf;
    
    // switch (type) {
    //   case 'seguimiento':
    //     pdf = exportToPDF.seguimientoAcademico(seguimientoData, estudianteInfo);
    //     break;
    //   case 'asistencia':
    //     pdf = exportToPDF.asistencia(asistenciaData, estudianteInfo);
    //     break;
    //   case 'dashboard':
    //     pdf = exportToPDF.dashboardCompleto({
    //       seguimiento: seguimientoData,
    //       asistencia: asistenciaData
    //     }, estudianteInfo);
    //     break;
    //   default:
    //     return;
    // }

    // pdf.save(`reporte-${type}-${idEstudiante}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header del Dashboard */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Dashboard Académico
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Análisis visual del rendimiento y asistencia del estudiante
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            
            <div className="relative group">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              
              {/* Menú desplegable de exportación */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-2">
                  <button
                    onClick={() => handleExportPDF('dashboard')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Dashboard Completo (PDF)
                  </button>
                  <button
                    onClick={() => handleExportPDF('seguimiento')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Seguimiento (PDF)
                  </button>
                  <button
                    onClick={() => handleExportPDF('asistencia')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Asistencia (PDF)
                  </button>
                  <div className="border-t border-gray-200 dark:border-slate-700 my-1"></div>
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Datos (JSON)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Promedio General */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio General</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {estadisticasSeguimiento?.promedio_general || 'N/A'}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {estadisticasSeguimiento?.total_notas || 0} notas registradas
          </div>
        </div>

        {/* Asistencia */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Asistencia</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {estadisticasAsistencia?.porcentaje_asistencia || 0}%
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {estadisticasAsistencia?.presentes || 0} presentes
          </div>
        </div>

        {/* Asignaturas */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Asignaturas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {estadisticasSeguimiento?.asignaturas_unicas || 0}
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Únicas registradas
          </div>
        </div>

        {/* Total Registros */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {estadisticasAsistencia?.total_registros || 0}
              </p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Registros de asistencia
          </div>
        </div>
      </div>

      {/* Gráficos de Rendimiento Académico */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rendimiento Académico
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedChartType('line')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedChartType === 'line'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Líneas
            </button>
            <button
              onClick={() => setSelectedChartType('bar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedChartType === 'bar'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Barras
            </button>
            <button
              onClick={() => setSelectedChartType('pie')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedChartType === 'pie'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Pastel
            </button>
          </div>
        </div>
        
        <AcademicPerformanceChart
          data={processedSeguimientoData}
          type={selectedChartType}
          height={350}
        />
      </div>

      {/* Gráficos de Asistencia */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Análisis de Asistencia
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedAttendanceType('line')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedAttendanceType === 'line'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Tendencia
            </button>
            <button
              onClick={() => setSelectedAttendanceType('bar')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedAttendanceType === 'bar'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setSelectedAttendanceType('pie')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedAttendanceType === 'pie'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Distribución
            </button>
          </div>
        </div>
        
        <AttendanceChart
          data={selectedAttendanceType === 'bar' ? monthlyData : processedAsistenciaData}
          type={selectedAttendanceType}
          height={350}
        />
      </div>
    </div>
  );
};

export default AcademicDashboard;
