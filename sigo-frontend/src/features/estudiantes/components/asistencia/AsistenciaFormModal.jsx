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
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      fecha: new Date(form.fecha),
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {initialData ? "Editar Asistencia" : "Nueva Asistencia"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border text-sm bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                Tipo de Asistencia
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border text-sm bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="">Seleccione...</option>
                <option value="Presente">Presente</option>
                <option value="Ausente">Ausente</option>
                <option value="Justificada">Justificada</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                Justificación{" "}
                {form.tipo === "Presente" ? "(no aplica)" : "(si aplica)"}
              </label>
              <textarea
                name="justificacion"
                value={form.justificacion}
                onChange={handleChange}
                rows={2}
                disabled={form.tipo === "Presente"} // 🚀 desactivar si es Presente
                placeholder={
                  form.tipo === "Presente"
                    ? "No requiere justificación"
                    : "Ingrese la justificación..."
                }
                className={`w-full px-3 py-2 rounded border text-sm bg-white dark:bg-slate-700 dark:text-white ${
                  form.tipo === "Presente"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
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
