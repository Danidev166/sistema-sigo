import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import notificacionService from '../services/notificacionService';
import { toast } from 'react-toastify';

const NotificacionBadge = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const [prevNoLeidas, setPrevNoLeidas] = useState(0);

  useEffect(() => {
    fetchNotificaciones();
    // Opcional: polling cada 60s
    const interval = setInterval(fetchNotificaciones, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificaciones = async () => {
    const { data } = await notificacionService.getAll();
    setNotificaciones(data);
    const noLeidas = data.filter(n => !n.leida);
    // Mostrar toast si hay no leídas al cargar
    if (noLeidas.length > 0 && prevNoLeidas === 0) {
      toast.info(`Tienes ${noLeidas.length} notificación(es) sin leer`);
    } else if (noLeidas.length > prevNoLeidas) {
      // Hay nuevas no leídas
      const nuevas = noLeidas.length - prevNoLeidas;
      toast.info(`Tienes ${nuevas} nueva(s) notificación(es)`);
    }
    setPrevNoLeidas(noLeidas.length);
  };

  const noLeidas = notificaciones.filter(n => !n.leida);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative focus:outline-none">
        <BellIcon className="w-5 h-5 text-gray-700" />
        {noLeidas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {noLeidas.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded z-50">
          <div className="p-2 border-b font-bold">Notificaciones</div>
          <ul className="max-h-64 overflow-y-auto">
            {notificaciones.slice(0, 6).map((n) => (
              <li key={n.id} className={`px-4 py-2 border-b last:border-b-0 ${n.leida ? 'bg-gray-50' : 'bg-yellow-50'}`}>
                <div className="font-medium">{n.titulo}</div>
                <div className="text-xs text-gray-500">{n.mensaje}</div>
                <div className="text-xs text-right text-gray-400">{n.prioridad || '-'} | {n.leida ? 'Leída' : 'No leída'}</div>
              </li>
            ))}
            {notificaciones.length === 0 && (
              <li className="px-4 py-2 text-center text-gray-400">Sin notificaciones</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificacionBadge; 