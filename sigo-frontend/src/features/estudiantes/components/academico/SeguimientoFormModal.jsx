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
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.asignatura.trim() || !form.nota || !form.promedio_curso) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    onSubmit({
      id_estudiante: idEstudiante,
      asignatura: form.asignatura.trim(),
      nota: parseFloat(form.nota),
      promedio_curso: parseFloat(form.promedio_curso),
      fecha: new Date(form.fecha)
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 max-w-md w-full rounded-lg p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {initialData ? "Editar Seguimiento Académico" : "Nuevo Seguimiento Académico"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Asignatura
              </label>
              <input
                type="text"
                name="asignatura"
                value={form.asignatura}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 text-sm dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nota
              </label>
              <input
                type="number"
                step="0.1"
                name="nota"
                value={form.nota}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 text-sm dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Promedio del Curso
              </label>
              <input
                type="number"
                step="0.1"
                name="promedio_curso"
                value={form.promedio_curso}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 text-sm dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha de Registro
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 text-sm dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {initialData ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
