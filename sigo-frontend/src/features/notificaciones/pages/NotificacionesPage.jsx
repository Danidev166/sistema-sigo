import React, { useEffect, useState } from 'react';
import notificacionService from '../services/notificacionService';
// Puedes importar Button y Table de tus componentes UI reutilizables
import Button from '../../../components/ui/Button';
import NotificacionFormModal from '../components/NotificacionFormModal';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const NotificacionesPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const { data } = await notificacionService.getAll();
      setNotificaciones(data);
    } catch (err) {
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeida = async (id) => {
    try {
      await notificacionService.marcarLeida(id);
      fetchNotificaciones();
    } catch (err) {
      setError('No se pudo marcar como leída');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta notificación?')) return;
    try {
      await notificacionService.remove(id);
      fetchNotificaciones();
    } catch (err) {
      setError('No se pudo eliminar');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          <Button onClick={() => setOpenModal(true)}>Crear Notificación</Button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <div className="bg-white rounded shadow p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-left">Mensaje</th>
                  <th className="px-4 py-2 text-left">Prioridad</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {notificaciones.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No hay notificaciones</td>
                  </tr>
                ) : (
                  notificaciones.map((n) => (
                    <tr key={n.id} className={n.leida ? 'bg-gray-50' : 'bg-yellow-50'}>
                      <td className="px-4 py-2 font-medium">{n.titulo}</td>
                      <td className="px-4 py-2">{n.mensaje}</td>
                      <td className="px-4 py-2">{n.prioridad || '-'}</td>
                      <td className="px-4 py-2">
                        {n.leida ? (
                          <span className="text-green-600 font-semibold">Leída</span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">No leída</span>
                        )}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        {!n.leida && (
                          <Button size="sm" variant="secondary" onClick={() => handleMarcarLeida(n.id)}>
                            Marcar como leída
                          </Button>
                        )}
                        <Button size="sm" variant="danger" onClick={() => handleEliminar(n.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <NotificacionFormModal open={openModal} onClose={() => setOpenModal(false)} onCreated={fetchNotificaciones} />
      </div>
    </DashboardLayout>
  );
};

export default NotificacionesPage; 