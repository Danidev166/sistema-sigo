import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import configuracionService from '../services/configuracionService';
import InputField from '../../estudiantes/components/InputField';
import ToggleField from '../../../components/ui/ToggleField';
import Button from '../../../components/ui/Button';

/**
 * Formulario de personalización del sistema.
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Datos iniciales
 * @param {Function} props.onSubmit - Callback para guardar
 * @returns {JSX.Element}
 *
 * @example
 * <PersonalizacionForm onSubmit={fn} />
 */

export default function PersonalizacionForm() {
  const [formData, setFormData] = useState({
    nombre_sistema: '',
    color_primario: '#2563eb',
    modo_oscuro: false,
    logo_url: '',
    mostrar_notificaciones: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setIsLoading(true);
      const datos = await configuracionService.obtenerPorTipo('personalizacion');

      const config = Array.isArray(datos)
        ? Object.fromEntries(datos.map(d => [d.clave, d.valor]))
        : {};

      setFormData({
        nombre_sistema: config.nombre_sistema || '',
        color_primario: config.color_primario || '#2563eb',
        modo_oscuro: config.modo_oscuro === 'true',
        logo_url: config.logo_url || '',
        mostrar_notificaciones: config.mostrar_notificaciones !== 'false'
      });
    } catch (error) {
      toast.error('Error al cargar configuración: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      const payload = Object.entries(formData).map(([clave, valor]) => ({
        clave,
        valor: typeof valor === 'boolean' ? String(valor) : valor
      }));

      await configuracionService.actualizar('personalizacion', payload);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar configuración: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Personalización del Sistema
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre del sistema */}
        <div className="col-span-1 sm:col-span-2">
          <InputField
            name="nombre_sistema"
            label="Nombre del Sistema"
            value={formData.nombre_sistema}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        {/* Color primario */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Color Primario
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              name="color_primario"
              value={formData.color_primario}
              onChange={handleChange}
              className="h-10 w-20 rounded cursor-pointer border border-gray-300 dark:border-slate-600 bg-transparent"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formData.color_primario}
            </span>
          </div>
        </div>

        {/* Logo URL */}
        <div className="col-span-1">
          <InputField
            name="logo_url"
            label="URL del Logo"
            type="url"
            value={formData.logo_url}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        {/* Toggles */}
        <div className="col-span-1 sm:col-span-2 space-y-4 pt-2">
          <ToggleField
            name="modo_oscuro"
            label="Modo Oscuro por Defecto"
            checked={formData.modo_oscuro}
            onChange={() => handleToggle('modo_oscuro', !formData.modo_oscuro)}
          />

          <ToggleField
            name="mostrar_notificaciones"
            label="Mostrar Notificaciones"
            checked={formData.mostrar_notificaciones}
            onChange={() => handleToggle('mostrar_notificaciones', !formData.mostrar_notificaciones)}
          />
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  );
}
