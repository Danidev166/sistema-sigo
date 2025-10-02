import { useState, useEffect } from 'react';
import { X, Send, Calendar, Clock, MapPin, User, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

const FamiliaModal = ({ isOpen, onClose, onSubmit, apoderado, editingData = null }) => {
  // Debug: verificar datos del apoderado
  console.log("🔍 FamiliaModal - apoderado recibido:", apoderado);
  
  const [form, setForm] = useState({
    fecha_comunicacion: '',
    tipo_comunicacion: '',
    medio: 'Email',
    asunto: '',
    contenido: '',
    responsable_nombre: '',
    hora_reunion: '',
    lugar_reunion: '',
    enviar_email: false,
    estado: 'Enviado'
  });

  const tiposComunicacion = [
    'Citación a Reunión',
    'Informe Académico', 
    'Alerta/Urgente',
    'Seguimiento',
    'Otro'
  ];

  const mediosComunicacion = [
    'Email',
    'Teléfono',
    'Presencial',
    'WhatsApp',
    'Carta'
  ];

  useEffect(() => {
    if (editingData) {
      setForm({
        fecha_comunicacion: editingData.fecha_comunicacion?.split('T')[0] || '',
        tipo_comunicacion: editingData.tipo_comunicacion || '',
        medio: editingData.medio || 'Email',
        asunto: editingData.asunto || '',
        contenido: editingData.contenido || '',
        responsable_nombre: editingData.responsable_nombre || '',
        hora_reunion: editingData.hora_reunion || '',
        lugar_reunion: editingData.lugar_reunion || '',
        enviar_email: editingData.enviar_email || false,
        estado: editingData.estado || 'Enviado'
      });
    } else {
      setForm({
        fecha_comunicacion: new Date().toISOString().split('T')[0],
        tipo_comunicacion: '',
        medio: 'Email',
        asunto: '',
        contenido: '',
        responsable_nombre: '',
        hora_reunion: '',
        lugar_reunion: '',
        enviar_email: false,
        estado: 'Enviado'
      });
    }
  }, [editingData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.tipo_comunicacion || !form.asunto || !form.contenido) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    onSubmit(form);
  };

  const isCitacion = form.tipo_comunicacion === 'Citación a Reunión';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-institutional-2xl text-gray-900 dark:text-white">
                {editingData ? 'Editar Comunicación' : 'Nueva Comunicación'}
              </h2>
              <p className="text-institutional-sm text-gray-500 dark:text-gray-400">
                {apoderado?.nombre_apoderado || 'Apoderado'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Comunicación */}
          <div>
            <label className="block text-form-label text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Comunicación *
            </label>
            <select
              name="tipo_comunicacion"
              value={form.tipo_comunicacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-form-input"
              required
            >
              <option value="">Seleccionar tipo</option>
              {tiposComunicacion.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Medio y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-form-label text-gray-700 dark:text-gray-300 mb-2">
                Medio de Comunicación
              </label>
              <select
                name="medio"
                value={form.medio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-form-input"
              >
                {mediosComunicacion.map(medio => (
                  <option key={medio} value={medio}>{medio}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-form-label text-gray-700 dark:text-gray-300 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha_comunicacion"
                value={form.fecha_comunicacion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-form-input"
                required
              />
            </div>
          </div>

          {/* Asunto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Asunto *
            </label>
            <input
              type="text"
              name="asunto"
              value={form.asunto}
              onChange={handleChange}
              placeholder="Ej: Citación a reunión de seguimiento académico"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-form-input"
              required
            />
          </div>

          {/* Campos específicos para citación */}
          {isCitacion && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Detalles de la Reunión
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                    Hora de la Reunión
                  </label>
                  <input
                    type="time"
                    name="hora_reunion"
                    value={form.hora_reunion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                    Lugar
                  </label>
                  <input
                    type="text"
                    name="lugar_reunion"
                    value={form.lugar_reunion}
                    onChange={handleChange}
                    placeholder="Ej: Sala de reuniones, Oficina de orientación"
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenido del Mensaje *
            </label>
            <textarea
              name="contenido"
              value={form.contenido}
              onChange={handleChange}
              rows={4}
              placeholder="Escriba el contenido del mensaje..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-form-input"
              required
            />
          </div>

          {/* Enviar por Email */}
          {form.medio === 'Email' && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <input
                type="checkbox"
                name="enviar_email"
                checked={form.enviar_email}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div>
                <label className="text-sm font-medium text-green-800 dark:text-green-200">
                  Enviar por correo electrónico al apoderado
                </label>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Se enviará un email profesional a: {apoderado?.email_apoderado || 'No disponible'}
                </p>
              </div>
            </div>
          )}

          {/* Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Responsable
            </label>
            <input
              type="text"
              name="responsable_nombre"
              value={form.responsable_nombre}
              onChange={handleChange}
              placeholder="Nombre del profesional responsable (ej: Pamela González)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-form-input"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-600">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {editingData ? 'Actualizar' : 'Enviar'} Comunicación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FamiliaModal;
