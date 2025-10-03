import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { AlertCircle, CheckCircle, Calculator, Users, FileText } from "lucide-react";
import ValidatedTextarea from "../../../../components/ui/ValidatedTextarea";

/**
 * Modal de formulario para crear o editar datos académicos del estudiante.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <AcademicoFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
export default function AcademicoFormModal({
  isOpen,
  onClose,
  onSubmit,
  idEstudiante,
  seguimiento = [],
  asistencias = [],
}) {
  const [observaciones, setObservaciones] = useState("");
  const [promedio, setPromedio] = useState(0);
  const [asistencia, setAsistencia] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setObservaciones("");
      setErrors({});

      // Calcular promedio de notas
      const notas = seguimiento.map((s) => parseFloat(s.nota)).filter(Boolean);
      if (notas.length > 0) {
        const avg = notas.reduce((sum, n) => sum + n, 0) / notas.length;
        setPromedio(avg.toFixed(1));
      } else {
        setPromedio(0);
      }

      // Calcular porcentaje de asistencia
      const actuales = asistencias.filter(
        (a) => new Date(a.fecha).getFullYear() === new Date().getFullYear()
      );

      if (actuales.length > 0) {
        // ✅ Consideramos como asistencia válida: "Presente" o "Justificada"
        const presentes = actuales.filter(
          (a) => a.tipo === "Presente" || a.tipo === "Justificada"
        ).length;

        const porcentaje = (presentes / actuales.length) * 100;
        setAsistencia(porcentaje.toFixed(1));
      } else {
        setAsistencia(0);
      }
    }
  }, [isOpen, seguimiento, asistencias]);

  const validateForm = () => {
    const newErrors = {};

    if (!observaciones.trim()) {
      newErrors.observaciones = 'Las observaciones son obligatorias';
    } else if (observaciones.trim().length < 10) {
      newErrors.observaciones = 'Las observaciones deben tener al menos 10 caracteres';
    } else if (observaciones.trim().length > 1000) {
      newErrors.observaciones = 'Las observaciones no pueden tener más de 1000 caracteres';
    }

    if (seguimiento.length === 0) {
      newErrors.seguimiento = 'Debe haber al menos un registro de seguimiento para generar el historial';
    }

    if (asistencias.length === 0) {
      newErrors.asistencias = 'Debe haber al menos un registro de asistencia para generar el historial';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        id_estudiante: idEstudiante,
        fecha_actualizacion: new Date(),
        observaciones_academicas: observaciones.trim(),
        promedio_general: parseFloat(promedio),
        asistencia: parseFloat(asistencia),
      });
    } catch (error) {
      console.error('Error al guardar historial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isFormValid = observaciones.trim().length >= 10 && 
    seguimiento.length > 0 && 
    asistencias.length > 0;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-lg p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Nuevo Registro Académico
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resumen de datos calculados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Promedio General
                  </label>
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {promedio}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-300">
                  Calculado automáticamente
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <label className="text-sm font-medium text-green-800 dark:text-green-200">
                    Asistencia
                  </label>
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {asistencia}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-300">
                  Calculado automáticamente
                </div>
              </div>
            </div>

            {/* Validaciones de datos requeridos */}
            {errors.seguimiento && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {errors.seguimiento}
                  </p>
                </div>
              </div>
            )}

            {errors.asistencias && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {errors.asistencias}
                  </p>
                </div>
              </div>
            )}

            {/* Campo de observaciones */}
            <ValidatedTextarea
              label="Observaciones Generales"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Buen desempeño general, mejora en matemática, necesita apoyo en ciencias..."
              error={errors.observaciones}
              success={observaciones && !errors.observaciones ? "Observaciones válidas" : null}
              required
              icon={FileText}
              helpText="Describa el rendimiento general del estudiante"
              maxLength={1000}
              minLength={10}
              rows={4}
            />

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  isFormValid && !isSubmitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Historial'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
