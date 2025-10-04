// src/features/estudiantes/components/tabs/Academico.jsx
import { useEffect, useState, useCallback, memo } from "react";
import { format } from "date-fns";
import estudianteService from "../../services/estudianteService";
import { toast } from "react-hot-toast";
import { Button } from "../ui/Button";
import AcademicoFormModal from "../../components/academico/AcademicoFormModal";
import SeguimientoFormModal from "../../components/academico/SeguimientoFormModal";
import SeguimientoTable from "../../components/academico/SeguimientoTable";
import DeleteConfirmModal from "../../components/academico/DeleteConfirmModal";
// import AcademicDashboard from "../../../../components/dashboard/AcademicDashboard";
// import useNotifications from "../../../../hooks/useNotifications";
import useOptimizedData from "../../../../hooks/useOptimizedData";
// import MobileNavigation from "../../../../components/ui/MobileNavigation";
// import OptimizedLoading from "../../../../components/ui/OptimizedLoading";
// import ErrorBoundary from "../../../../components/ui/ErrorBoundary";

const Academico = memo(({ idEstudiante }) => {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);
  const [modalSeguimientoOpen, setModalSeguimientoOpen] = useState(false);
  const [editingSeguimiento, setEditingSeguimiento] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDashboard, setShowDashboard] = useState(true);

  // Hook optimizado para datos
  const {
    data,
    loading,
    error,
    fetchData,
    refresh,
    updateData,
    calculatedStats
  } = useOptimizedData(idEstudiante, anio);

  // Extraer datos del hook optimizado
  const {
    historial,
    seguimiento,
    asistencias,
    estadisticasSeguimiento,
    estadisticasAsistencia
  } = data;

  // Procesar notificaciones cuando cambien los datos - TEMPORALMENTE DESHABILITADO
  // useEffect(() => {
  //   if (seguimiento.length > 0 || asistencias.length > 0) {
  //     processNotifications(seguimiento, asistencias, estadisticasSeguimiento, estadisticasAsistencia);
  //   }
  // }, [seguimiento, asistencias, estadisticasSeguimiento, estadisticasAsistencia, processNotifications]);

  const handleGuardarSeguimiento = async (formData) => {
    try {
      if (editingSeguimiento) {
        await estudianteService.actualizarSeguimiento(editingSeguimiento.id, formData);
        toast.success("Seguimiento actualizado");
      } else {
        await estudianteService.crearSeguimiento(formData);
        toast.success("Seguimiento creado");
      }
      setModalSeguimientoOpen(false);
      setEditingSeguimiento(null);
      refresh();
    } catch (error) {
      console.error("Error al guardar seguimiento:", error);
      toast.error("Error al guardar seguimiento");
    }
  };

  const handleEliminarSeguimiento = async () => {
    try {
      await estudianteService.eliminarSeguimiento(deleteTarget.id);
      toast.success("Seguimiento eliminado");
      setDeleteTarget(null);
      refresh();
    } catch (error) {
      console.error("Error al eliminar seguimiento:", error);
      toast.error("Error al eliminar seguimiento");
    }
  };

  const handleRegistrarHistorial = async (formData) => {
    if (seguimiento.length === 0 || asistencias.length === 0) {
      toast.error("Debe haber al menos una nota y una asistencia registrada para generar el historial.");
      return;
    }

    try {
      await estudianteService.crearHistorialAcademico({
        id_estudiante: idEstudiante,
        fecha_actualizacion: new Date(),
        observaciones_academicas: formData.observaciones_academicas,
        promedio_general: parseFloat(formData.promedio_general),
        asistencia: parseFloat(formData.asistencia),
      });

      toast.success("✅ Historial guardado correctamente");
      setModalHistorialOpen(false);
      refresh();
    } catch (error) {
      console.error("❌ Error al registrar historial:", error);
      toast.error("No se pudo guardar el historial");
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando datos académicos...</div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold text-red-600 mb-4">
          Error al cargar datos académicos
        </h3>
        <p className="text-gray-600 mb-4">{error?.message || 'Error desconocido'}</p>
        <button
          onClick={() => fetchData(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* === CONTROLES DE VISTA === */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            📊 Análisis Académico
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowDashboard(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showDashboard
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setShowDashboard(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showDashboard
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              📋 Tabla de Datos
            </button>
          </div>
        </div>
      </div>

      {/* === DASHBOARD CON GRÁFICOS - TEMPORALMENTE DESHABILITADO === */}
      {showDashboard && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            📊 Dashboard Académico (Modo Debug)
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Dashboard temporalmente simplificado para debug. 
            Datos: {seguimiento.length} seguimientos, {asistencias.length} asistencias.
          </p>
        </div>
      )}
      {/* <AcademicDashboard
        idEstudiante={idEstudiante}
        seguimientoData={seguimiento}
        asistenciaData={asistencias}
        estadisticasSeguimiento={estadisticasSeguimiento}
        estadisticasAsistencia={estadisticasAsistencia}
        onRefresh={refresh}
      /> */}

      {/* === VISTA DE TABLA DE DATOS === */}
      {!showDashboard && (
        <>
          {/* === ESTADÍSTICAS GENERALES === */}
          {(estadisticasSeguimiento || estadisticasAsistencia) && (
            <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
                📊 Estadísticas Generales
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Estadísticas de Seguimiento */}
                {estadisticasSeguimiento && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {estadisticasSeguimiento.promedio_general || 'N/A'}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-300">
                        Promedio General
                      </div>
                      <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                        {estadisticasSeguimiento.total_notas} notas registradas
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {estadisticasSeguimiento.asignaturas_unicas || 0}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-300">
                        Asignaturas
                      </div>
                      <div className="text-xs text-green-500 dark:text-green-400 mt-1">
                        {estadisticasSeguimiento.tendencia === 'mejorando' ? '📈 Mejorando' :
                         estadisticasSeguimiento.tendencia === 'empeorando' ? '📉 Empeorando' :
                         estadisticasSeguimiento.tendencia === 'estable' ? '➡️ Estable' : '📊 Sin datos'}
                      </div>
                    </div>
                  </>
                )}

                {/* Estadísticas de Asistencia */}
                {estadisticasAsistencia && (
                  <>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {estadisticasAsistencia.porcentaje_asistencia || 0}%
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-300">
                        Asistencia
                      </div>
                      <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                        {estadisticasAsistencia.presentes} presentes, {estadisticasAsistencia.ausentes} ausentes
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        {estadisticasAsistencia.total_registros || 0}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-300">
                        Total Registros
                      </div>
                      <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                        {estadisticasAsistencia.tendencia === 'mejorando' ? '📈 Mejorando' :
                         estadisticasAsistencia.tendencia === 'empeorando' ? '📉 Empeorando' :
                         estadisticasAsistencia.tendencia === 'estable' ? '➡️ Estable' : '📊 Sin datos'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* === HISTORIAL ACADÉMICO === */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            Historial Académico
          </h2>
          <Button onClick={() => setModalHistorialOpen(true)} className="bg-blue-600 text-white">
            + Nuevo Registro
          </Button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mr-2 text-gray-700 dark:text-gray-300">Año:</label>
          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="border px-2 py-1 rounded text-sm dark:bg-slate-700 dark:text-white"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-300">Cargando datos...</p>
        ) : historial.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No hay registros académicos para este año.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border rounded shadow">
              <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white">
                <tr>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Promedio</th>
                  <th className="px-4 py-2">Asistencia</th>
                  <th className="px-4 py-2">Observaciones</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">
                {historial.map((item) => (
                  <tr key={item.id} className="border-t dark:border-slate-700">
                    <td className="px-4 py-2">
                      {format(new Date(item.fecha_actualizacion), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-2">{item.promedio_general}</td>
                    <td className="px-4 py-2">{item.asistencia}%</td>
                    <td className="px-4 py-2">{item.observaciones_academicas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* === SEGUIMIENTO ACADÉMICO === */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            Seguimiento Académico
          </h2>
          <Button
            onClick={() => {
              setEditingSeguimiento(null);
              setModalSeguimientoOpen(true);
            }}
            className="bg-blue-600 text-white"
          >
            + Nuevo Seguimiento
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-300">Cargando datos...</p>
        ) : seguimiento.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No hay datos de seguimiento para este año.</p>
        ) : (
          <SeguimientoTable
            registros={seguimiento}
            onEdit={(item) => {
              setEditingSeguimiento(item);
              setModalSeguimientoOpen(true);
            }}
            onDelete={(item) => setDeleteTarget(item)}
          />
        )}
      </div>

      {/* Modals */}
      <AcademicoFormModal
        isOpen={modalHistorialOpen}
        onClose={() => setModalHistorialOpen(false)}
        onSubmit={handleRegistrarHistorial}
        idEstudiante={idEstudiante}
        seguimiento={seguimiento}
        asistencias={asistencias}
      />

      <SeguimientoFormModal
        isOpen={modalSeguimientoOpen}
        onClose={() => {
          setModalSeguimientoOpen(false);
          setEditingSeguimiento(null);
        }}
        onSubmit={handleGuardarSeguimiento}
        initialData={editingSeguimiento}
        idEstudiante={idEstudiante}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleEliminarSeguimiento}
        title="¿Deseas eliminar este seguimiento?"
      />

      {/* Navegación móvil - TEMPORALMENTE DESHABILITADA */}
      {/* <MobileNavigation
        showDashboard={showDashboard}
        onToggleView={setShowDashboard}
        onRefresh={refresh}
        onExport={() => {
          // Función de exportación básica para móvil
          const data = {
            seguimiento,
            asistencias,
            estadisticas: {
              seguimiento: estadisticasSeguimiento,
              asistencia: estadisticasAsistencia
            }
          };
          
          const dataStr = JSON.stringify(data, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `datos-academicos-${idEstudiante}-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }}
        isLoading={loading}
      /> */}
      </div>
    // </ErrorBoundary>
  );
});

Academico.displayName = 'Academico';

export default Academico;
