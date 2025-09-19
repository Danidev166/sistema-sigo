import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import SelectTipoRecurso from "./SelectTipoRecurso";

/**
 * Modal de formulario para crear o editar recursos.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <RecursoFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
export default function RecursoFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    nombre: "",
    tipo_recurso: "",
    descripcion: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || "",
        tipo_recurso: initialData.tipo_recurso || "",
        descripcion: initialData.descripcion || ""
      });
    } else {
      setForm({ nombre: "", tipo_recurso: "", descripcion: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.tipo_recurso) return;
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-lg p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {initialData ? "Editar Recurso" : "Nuevo Recurso"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de recurso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de recurso *
              </label>
              <select
                name="tipo_recurso"
                value={form.tipo_recurso}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              >
                <option value="">Seleccione tipo</option>
                <option value="Útiles Escolares">Útiles Escolares</option>
                <option value="Uniforme">Uniforme</option>
                <option value="Textil">Textil</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Higiene">Higiene</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre *
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={2}
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
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
