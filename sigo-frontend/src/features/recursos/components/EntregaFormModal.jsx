/**
 * Modal de formulario para crear entregas de recursos.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Array} props.recursos - Lista de recursos disponibles
 * @param {Array} props.estudiantes - Lista de estudiantes
 * @returns {JSX.Element}
 *
 * @example
 * <EntregaFormModal isOpen={true} onClose={fn} onSubmit={fn} recursos={[]} estudiantes={[]} />
 */
// src/features/recursos/components/EntregaFormModal.jsx
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import EstudianteSelector from "../../../components/ui/EstudianteSelector";

export default function EntregaFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  recursoId,
}) {
  const [form, setForm] = useState({
    id_estudiante: null,
    cantidad: "",
    fecha_entrega: new Date().toISOString().split("T")[0],
    observaciones: "",
  });

  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        id_estudiante: initialData.id_estudiante || null,
        cantidad: initialData.cantidad || "",
        fecha_entrega: initialData.fecha_entrega?.split("T")[0] || "",
        observaciones: initialData.observaciones || "",
      });
      setEstudianteSeleccionado({
        value: initialData.id_estudiante,
        label: initialData.nombre_estudiante || "Estudiante seleccionado",
      });
    } else {
      setForm({
        id_estudiante: null,
        cantidad: "",
        fecha_entrega: new Date().toISOString().split("T")[0],
        observaciones: "",
      });
      setEstudianteSeleccionado(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEstudiante = (selected) => {
    setEstudianteSeleccionado(selected);
    setForm((prev) => ({
      ...prev,
      id_estudiante: selected ? selected.value : null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id_estudiante || !form.cantidad) {
      alert("Todos los campos obligatorios deben estar completos.");
      return;
    }

    onSubmit({
      ...form,
      id_recurso: recursoId,
      cantidad: parseInt(form.cantidad),
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-lg p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {initialData ? "Editar Entrega" : "Nueva Entrega"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Estudiante Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estudiante *
              </label>
              <EstudianteSelector value={estudianteSeleccionado} onChange={handleEstudiante} />
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cantidad entregada *
              </label>
              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                min="1"
                required
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>

            {/* Fecha de entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de entrega *
              </label>
              <input
                type="date"
                name="fecha_entrega"
                value={form.fecha_entrega}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows={3}
                placeholder="Opcional"
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>

            {/* Botones */}
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
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
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
