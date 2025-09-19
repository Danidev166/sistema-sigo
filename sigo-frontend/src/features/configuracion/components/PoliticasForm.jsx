import { useState, useEffect } from "react";
import configuracionService from '../services/configuracionService';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';

/**
 * Formulario de políticas del sistema.
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Datos iniciales
 * @param {Function} props.onSubmit - Callback para guardar
 * @returns {JSX.Element}
 *
 * @example
 * <PoliticasForm onSubmit={fn} />
 */

export default function PoliticasForm() {
  const [formData, setFormData] = useState({
    privacidad: '',
    seguridad: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        const data = await configuracionService.obtenerPoliticas();
        const privacidad = data.find(item => item.clave === 'privacidad')?.valor || '';
        const seguridad = data.find(item => item.clave === 'seguridad')?.valor || '';
        setFormData({ privacidad, seguridad });
      } catch (error) {
        console.error('Error al obtener políticas:', error);
        toast.error('Error al cargar políticas');
      }
    };

    fetchPoliticas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      await configuracionService.guardarPoliticas([
        { clave: 'privacidad', valor: formData.privacidad },
        { clave: 'seguridad', valor: formData.seguridad },
      ]);
      toast.success('Políticas actualizadas correctamente');
    } catch (error) {
      console.error('Error al guardar políticas:', error);
      toast.error('Error al guardar políticas');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Políticas Institucionales
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Política de Privacidad */}
        <div>
          <label
            htmlFor="privacidad"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Política de privacidad
          </label>
          <textarea
            id="privacidad"
            name="privacidad"
            value={formData.privacidad}
            onChange={handleChange}
            rows="6"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Ingrese la política de privacidad..."
          />
        </div>

        {/* Política de Seguridad */}
        <div>
          <label
            htmlFor="seguridad"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Política de seguridad
          </label>
          <textarea
            id="seguridad"
            name="seguridad"
            value={formData.seguridad}
            onChange={handleChange}
            rows="6"
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            placeholder="Ingrese la política de seguridad..."
          />
        </div>
      </div>

      {/* Botón de Guardar */}
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
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
