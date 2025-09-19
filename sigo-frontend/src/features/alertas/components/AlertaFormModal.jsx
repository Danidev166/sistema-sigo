import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";

/**
 * Modal de formulario para crear o editar alertas.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <AlertaFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
export default function AlertaFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    id_estudiante: "",
    fecha_alerta: "",
    tipo_alerta: "",
    descripcion: "",
    estado: "Activa",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id_estudiante: initialData.id_estudiante,
        fecha_alerta: initialData.fecha_alerta
          ? format(new Date(initialData.fecha_alerta), "yyyy-MM-dd")
          : "",
        tipo_alerta: initialData.tipo_alerta,
        descripcion: initialData.descripcion || "",
        estado: initialData.estado,
      });
    } else {
      setForm({
        id_estudiante: "",
        fecha_alerta: "",
        tipo_alerta: "",
        descripcion: "",
        estado: "Activa",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      fecha_alerta: form.fecha_alerta ? new Date(form.fecha_alerta) : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6 mx-4">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {initialData ? "Editar Alerta" : "Nueva Alerta"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                ID Estudiante
              </label>
              <input
                type="number"
                name="id_estudiante"
                value={form.id_estudiante}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border text-sm bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                Fecha de Alerta
              </label>
              <input
                type="date"
                name="fecha_alerta"
                value={form.fecha_alerta}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border text-sm bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                Tipo de Alerta
              </label>
              <input
                type="text"
                name="tipo_alerta"
                value={form.tipo_alerta}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border text-sm bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 rounded border text-sm bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border text-sm bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="Activa">Activa</option>
                <option value="Atendida">Atendida</option>
                <option value="Cerrada">Cerrada</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
