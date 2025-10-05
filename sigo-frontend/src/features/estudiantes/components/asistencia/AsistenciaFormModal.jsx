/**
 * Modal de formulario para crear o editar registros de asistencia del estudiante.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <AsistenciaFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
// src/features/estudiantes/components/asistencia/AsistenciaFormModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";
import { AlertCircle, CheckCircle, Calendar, UserCheck, UserX, Clock } from "lucide-react";
import ValidatedInput from "../../../../components/ui/ValidatedInput";
import ValidatedSelect from "../../../../components/ui/ValidatedSelect";
import ValidatedTextarea from "../../../../components/ui/ValidatedTextarea";

export default function AsistenciaFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    fecha: "",
    tipo: "",
    justificacion: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        fecha: initialData.fecha
          ? format(new Date(initialData.fecha), "yyyy-MM-dd")
          : "",
        tipo: initialData.tipo || "",
        justificacion: initialData.justificacion || "",
      });
    } else {
      setForm({
        fecha: "",
        tipo: "",
        justificacion: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'fecha':
        if (!value) {
          newErrors.fecha = 'La fecha es obligatoria';
        } else if (new Date(value) > new Date()) {
          newErrors.fecha = 'La fecha no puede ser futura';
        } else {
          delete newErrors.fecha;
        }
        break;
        
      case 'tipo':
        if (!value) {
          newErrors.tipo = 'El tipo de asistencia es obligatorio';
        } else {
          delete newErrors.tipo;
        }
        break;
        
      case 'justificacion':
        if (form.tipo !== 'Presente' && !value.trim()) {
          newErrors.justificacion = 'La justificación es obligatoria cuando no es Presente';
        } else if (value.length > 500) {
          newErrors.justificacion = 'La justificación no puede tener más de 500 caracteres';
        } else {
          delete newErrors.justificacion;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar todos los campos
    validateField('fecha', form.fecha);
    validateField('tipo', form.tipo);
    validateField('justificacion', form.justificacion);

    // Verificar si hay errores
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        ...form,
        fecha: form.fecha, // Enviar como string, no como Date
      });
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isFormValid = form.fecha && form.tipo && 
    (form.tipo === 'Presente' || form.justificacion.trim());

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Presente': return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'Ausente': return <UserX className="w-4 h-4 text-red-600" />;
      case 'Justificada': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Pendiente': return <Clock className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {initialData ? "Editar Asistencia" : "Nueva Asistencia"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fecha */}
            <ValidatedInput
              label="Fecha de Asistencia"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              max={new Date().toISOString().slice(0, 10)}
              error={errors.fecha}
              success={form.fecha && !errors.fecha ? "Fecha válida" : null}
              required
              icon={Calendar}
              helpText="Fecha en que se registra la asistencia"
            />

            {/* Tipo de Asistencia */}
            <ValidatedSelect
              label="Tipo de Asistencia"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              placeholder="Seleccione el tipo de asistencia..."
              error={errors.tipo}
              success={form.tipo && !errors.tipo ? "Tipo seleccionado" : null}
              required
              options={[
                { value: "Presente", label: "✅ Presente" },
                { value: "Ausente", label: "❌ Ausente" },
                { value: "Justificada", label: "⏰ Justificada" },
                { value: "Pendiente", label: "⏳ Pendiente" }
              ]}
              helpText="Seleccione el estado de asistencia del estudiante"
            />

            {/* Justificación */}
            <ValidatedTextarea
              label={`Justificación ${form.tipo === "Presente" ? "(no aplica)" : "(requerida)"}`}
              name="justificacion"
              value={form.justificacion}
              onChange={handleChange}
              placeholder={
                form.tipo === "Presente"
                  ? "No requiere justificación"
                  : form.tipo === "Ausente"
                  ? "Explique el motivo de la ausencia..."
                  : form.tipo === "Justificada"
                  ? "Describa la justificación presentada..."
                  : "Explique el motivo del estado pendiente..."
              }
              error={errors.justificacion}
              success={form.justificacion && !errors.justificacion ? "Justificación válida" : null}
              required={form.tipo !== "Presente"}
              disabled={form.tipo === "Presente"}
              maxLength={500}
              rows={3}
              helpText={
                form.tipo === "Presente" 
                  ? "No se requiere justificación para asistencia presente"
                  : "Explique el motivo de la ausencia o estado pendiente"
              }
            />

            {/* Resumen del tipo seleccionado */}
            {form.tipo && (
              <div className={`p-3 rounded-lg border ${
                form.tipo === 'Presente' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                form.tipo === 'Ausente' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                form.tipo === 'Justificada' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
              }`}>
                <div className="flex items-center gap-2">
                  {getTipoIcon(form.tipo)}
                  <span className="text-sm font-medium">
                    {form.tipo === 'Presente' ? 'Asistencia registrada correctamente' :
                     form.tipo === 'Ausente' ? 'Ausencia sin justificación' :
                     form.tipo === 'Justificada' ? 'Ausencia con justificación válida' :
                     'Estado pendiente de confirmación'}
                  </span>
                </div>
              </div>
            )}

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
                {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Guardar')}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
