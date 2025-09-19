import React, { useState, useContext } from 'react';
import notificacionService from '../services/notificacionService';
import Button from '../../../components/ui/Button';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const NotificacionFormModal = ({ open, onClose, onCreated }) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    titulo: '',
    mensaje: '',
    prioridad: 'Media',
    categoria: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await notificacionService.create({
        ...form,
        id_usuario: user?.id, // Asegura que se envía el id del usuario logueado
        tipo: 'Alerta', // Puedes cambiar el tipo si lo necesitas
        leida: false, // Siempre enviar leida como false
      });
      onCreated && onCreated();
      toast.success('Notificación creada con éxito');
      onClose();
    } catch (err) {
      setError('Error al crear notificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Notificación</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Título</label>
            <input name="titulo" value={form.titulo} onChange={handleChange} required className="input w-full" />
          </div>
          <div>
            <label className="block font-medium">Mensaje</label>
            <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required className="input w-full" />
          </div>
          <div>
            <label className="block font-medium">Prioridad</label>
            <select name="prioridad" value={form.prioridad} onChange={handleChange} className="input w-full">
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Categoría</label>
            <input name="categoria" value={form.categoria} onChange={handleChange} required className="input w-full" />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={loading}>Crear</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificacionFormModal; 