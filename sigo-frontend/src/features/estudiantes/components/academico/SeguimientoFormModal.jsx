/**
 * Modal de formulario para crear o editar seguimientos académicos del estudiante.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <SeguimientoFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
// src/features/estudiantes/components/academico/SeguimientoFormModal.jsx
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { AlertCircle, CheckCircle, BookOpen, Calculator, Calendar, TrendingUp } from "lucide-react";
import ValidatedInput from "../../../../components/ui/ValidatedInput";

export default function SeguimientoFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  idEstudiante 
}) {
  const [form, setForm] = useState({
    asignatura: "",
    nota: "",
    promedio_curso: "",
    fecha: new Date().toISOString().slice(0, 10)
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        asignatura: initialData.asignatura || "",
        nota: initialData.nota || "",
        promedio_curso: initialData.promedio_curso || "",
        fecha: initialData.fecha ? new Date(initialData.fecha).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
      });
    } else {
      setForm({
        asignatura: "",
        nota: "",
        promedio_curso: "",
        fecha: new Date().toISOString().slice(0, 10)
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'asignatura':
        if (!value.trim()) {
          newErrors.asignatura = 'La asignatura es obligatoria';
        } else if (value.trim().length < 2) {
          newErrors.asignatura = 'La asignatura debe tener al menos 2 caracteres';
        } else if (value.trim().length > 100) {
          newErrors.asignatura = 'La asignatura no puede tener más de 100 caracteres';
        } else {
          delete newErrors.asignatura;
        }
        break;
        
      case 'nota':
        const nota = parseFloat(value);
        if (!value) {
          newErrors.nota = 'La nota es obligatoria';
        } else if (isNaN(nota)) {
          newErrors.nota = 'La nota debe ser un número válido';
        } else if (nota < 1.0 || nota > 7.0) {
          newErrors.nota = 'La nota debe estar entre 1.0 y 7.0';
        } else {
          delete newErrors.nota;
        }
        break;
        
      case 'promedio_curso':
        const promedio = parseFloat(value);
        if (!value) {
          newErrors.promedio_curso = 'El promedio del curso es obligatorio';
        } else if (isNaN(promedio)) {
          newErrors.promedio_curso = 'El promedio del curso debe ser un número válido';
        } else if (promedio < 1.0 || promedio > 7.0) {
          newErrors.promedio_curso = 'El promedio del curso debe estar entre 1.0 y 7.0';
        } else {
          delete newErrors.promedio_curso;
        }
        break;
        
      case 'fecha':
        if (!value) {
          newErrors.fecha = 'La fecha es obligatoria';
        } else if (new Date(value) > new Date()) {
          newErrors.fecha = 'La fecha no puede ser futura';
        } else {
          delete newErrors.fecha;
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
    validateField('asignatura', form.asignatura);
    validateField('nota', form.nota);
    validateField('promedio_curso', form.promedio_curso);
    validateField('fecha', form.fecha);

    // Verificar si hay errores
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        id_estudiante: idEstudiante,
        asignatura: form.asignatura.trim(),
        nota: parseFloat(form.nota),
        promedio_curso: parseFloat(form.promedio_curso),
        fecha: new Date(form.fecha)
      });
    } catch (error) {
      console.error('Error al guardar seguimiento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isFormValid = Object.keys(errors).length === 0 && 
    form.asignatura.trim() && 
    form.nota && 
    form.promedio_curso && 
    form.fecha;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 max-w-md w-full rounded-lg p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {initialData ? "Editar Seguimiento Académico" : "Nuevo Seguimiento Académico"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Asignatura */}
            <ValidatedInput
              label="Asignatura"
              name="asignatura"
              value={form.asignatura}
              onChange={handleChange}
              placeholder="Ej: Matemáticas, Lenguaje, Historia..."
              error={errors.asignatura}
              success={form.asignatura && !errors.asignatura ? "Asignatura válida" : null}
              required
              icon={BookOpen}
              helpText="Ingrese el nombre de la asignatura"
            />

            {/* Nota */}
            <ValidatedInput
              label="Nota del Estudiante"
              name="nota"
              type="number"
              step="0.1"
              min="1.0"
              max="7.0"
              value={form.nota}
              onChange={handleChange}
              placeholder="Ej: 5.5"
              error={errors.nota}
              success={form.nota && !errors.nota ? "Nota válida" : null}
              required
              icon={TrendingUp}
              helpText="Nota del estudiante (escala 1.0 - 7.0)"
            />

            {/* Promedio del Curso */}
            <ValidatedInput
              label="Promedio del Curso"
              name="promedio_curso"
              type="number"
              step="0.1"
              min="1.0"
              max="7.0"
              value={form.promedio_curso}
              onChange={handleChange}
              placeholder="Ej: 4.8"
              error={errors.promedio_curso}
              success={form.promedio_curso && !errors.promedio_curso ? "Promedio válido" : null}
              required
              icon={Calculator}
              helpText="Promedio general del curso (escala 1.0 - 7.0)"
            />

            {/* Fecha */}
            <ValidatedInput
              label="Fecha de Registro"
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={handleChange}
              max={new Date().toISOString().slice(0, 10)}
              error={errors.fecha}
              success={form.fecha && !errors.fecha ? "Fecha válida" : null}
              required
              icon={Calendar}
              helpText="Fecha en que se registró la evaluación"
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
                {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Guardar')}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
