import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import LogsService from '../services/logsService';
import LogsTable from '../components/LogsTable';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ImprovedDashboardLayout from '../../../components/layout/ImprovedDashboardLayout';
import ExportarLogsPDF from '../components/ExportarLogsPDF';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Filtros avanzados
  const [filtros, setFiltros] = useState({
    usuario: '',
    accion: '',
    tabla: '',
    fecha_desde: '',
    fecha_hasta: '',
    ip: '',
  });

  useEffect(() => {
    cargarLogs();
  }, []);

  const cargarLogs = async (filtrosParam = filtros) => {
    try {
      setLoading(true);
      const data = await LogsService.obtenerTodos(filtrosParam);
      setLogs(data);
    } catch (error) {
      toast.error('Error al cargar los logs de actividad');
      console.error('Error cargando logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarLogs(filtros);
  };

  const handleLimpiar = () => {
    setFiltros({ usuario: '', accion: '', tabla: '', fecha_desde: '', fecha_hasta: '', ip: '' });
    cargarLogs({});
  };

  const handleEliminarLog = (log) => {
    setSelectedLog(log);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await LogsService.eliminar(selectedLog.id);
      toast.success('Log de actividad eliminado exitosamente');
      setShowDeleteModal(false);
      setSelectedLog(null);
      cargarLogs(filtros);
    } catch (error) {
      toast.error('Error al eliminar el log de actividad');
      console.error('Error eliminando log:', error);
    }
  };

  return (
    <ImprovedDashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Logs de Actividad</h1>
        </div>

        {/* Filtros avanzados */}
        <form onSubmit={handleBuscar} className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1">Usuario</label>
            <input type="text" name="usuario" value={filtros.usuario} onChange={handleFiltroChange} className="border rounded px-2 py-1 w-36" placeholder="Nombre o ID" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Acción</label>
            <input type="text" name="accion" value={filtros.accion} onChange={handleFiltroChange} className="border rounded px-2 py-1 w-28" placeholder="Ej: Eliminar" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Tabla</label>
            <input type="text" name="tabla" value={filtros.tabla} onChange={handleFiltroChange} className="border rounded px-2 py-1 w-32" placeholder="Ej: estudiantes" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">IP</label>
            <input type="text" name="ip" value={filtros.ip} onChange={handleFiltroChange} className="border rounded px-2 py-1 w-28" placeholder="Ej: 127.0.0.1" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Fecha desde</label>
            <input type="date" name="fecha_desde" value={filtros.fecha_desde} onChange={handleFiltroChange} className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Fecha hasta</label>
            <input type="date" name="fecha_hasta" value={filtros.fecha_hasta} onChange={handleFiltroChange} className="border rounded px-2 py-1" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Buscar</button>
          <button type="button" onClick={handleLimpiar} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition">Limpiar</button>
        </form>

        {/* Botón de exportar PDF */}
        <div className="mb-4">
          <ExportarLogsPDF logs={logs} />
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <LogsTable
            logs={logs}
            loading={loading}
            onDelete={handleEliminarLog}
          />
        </div>

        {showDeleteModal && (
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title="Eliminar Log de Actividad"
            message={`¿Estás seguro de que quieres eliminar el log de actividad "${selectedLog?.accion}"?`}
          />
        )}
      </div>
    </ImprovedDashboardLayout>
  );
};

export default LogsPage; 