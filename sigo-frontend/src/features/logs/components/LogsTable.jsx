import React, { useState } from 'react';

const LogDetailModal = ({ log, isOpen, onClose }) => {
  if (!isOpen || !log) return null;

  // Extraer nombre del usuario o estudiante eliminado si corresponde
  let entidadEliminada = null;
  if (
    log.accion && log.accion.toLowerCase().includes('eliminar') &&
    log.tabla_afectada &&
    (log.tabla_afectada.toLowerCase() === 'usuarios' || log.tabla_afectada.toLowerCase() === 'estudiantes') &&
    log.datos_anteriores
  ) {
    try {
      // Puede venir como array JSON o como objeto
      const datos = JSON.parse(log.datos_anteriores);
      const entidad = Array.isArray(datos) ? datos[0] : datos;
      if (entidad && (entidad.nombre || entidad.email || entidad.id)) {
        entidadEliminada = entidad.nombre
          ? `${entidad.nombre} ${entidad.apellido || ''}`.trim()
          : entidad.email || entidad.id;
      }
    } catch (e) {
      // Si falla el parseo, no mostrar nada extra
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Detalle del Log</h2>
        <div className="space-y-2">
          <div><strong>ID:</strong> {log.id}</div>
          <div><strong>Usuario:</strong> {log.usuario_nombre || 'Sistema'}</div>
          <div><strong>Acción:</strong> {log.accion}</div>
          <div><strong>Tabla:</strong> {log.tabla_afectada}</div>
          <div><strong>ID Registro:</strong> {log.id_registro}</div>
          <div><strong>IP:</strong> {log.ip_address}</div>
          <div><strong>Fecha:</strong> {new Date(log.fecha_accion).toLocaleString('es-ES')}</div>
          <div><strong>User Agent:</strong> <span className="break-all">{log.user_agent}</span></div>
          {entidadEliminada && (
            <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
              <strong>{log.tabla_afectada.toLowerCase() === 'usuarios' ? 'Usuario' : 'Estudiante'} eliminado:</strong> {entidadEliminada}
            </div>
          )}
          <div>
            <strong>Datos Anteriores:</strong>
            <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{log.datos_anteriores || '-'}</pre>
          </div>
          <div>
            <strong>Datos Nuevos:</strong>
            <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{log.datos_nuevos || '-'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogsTable = ({ logs, loading, onEdit, onDelete }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAccionColor = (accion) => {
    const accionLower = accion.toLowerCase();
    if (accionLower.includes('crear') || accionLower.includes('insert')) {
      return 'bg-green-100 text-green-800';
    } else if (accionLower.includes('actualizar') || accionLower.includes('update')) {
      return 'bg-blue-100 text-blue-800';
    } else if (accionLower.includes('eliminar') || accionLower.includes('delete')) {
      return 'bg-red-100 text-red-800';
    } else if (accionLower.includes('login') || accionLower.includes('logout')) {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No hay logs de actividad registrados</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tabla
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Registro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {log.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.usuario_nombre || 'Sistema'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccionColor(log.accion)}`}>
                  {log.accion}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.tabla_afectada || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.id_registro || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.ip_address || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(log.fecha_accion)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setSelectedLog(log); setShowDetailModal(true); }}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    title="Ver detalles"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(log)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LogDetailModal log={selectedLog} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
    </div>
  );
};

export default LogsTable; 