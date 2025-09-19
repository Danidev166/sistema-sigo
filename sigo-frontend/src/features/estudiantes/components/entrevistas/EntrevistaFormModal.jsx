/**
 * Modal de formulario para crear o editar entrevistas del estudiante.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <EntrevistaFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
// src/features/estudiantes/components/entrevistas/EntrevistaFormModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";

export default function EntrevistaFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    fecha_entrevista: "",
    motivo: "",
    observaciones: "",
    conclusiones: "",
    acciones_acordadas: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        fecha_entrevista: initialData.fecha_entrevista
          ? format(new Date(initialData.fecha_entrevista), "yyyy-MM-dd")
          : "",
        motivo: initialData.motivo || "",
        observaciones: initialData.observaciones || "",
        conclusiones: initialData.conclusiones || "",
        acciones_acordadas: initialData.acciones_acordadas || "",
      });
    } else {
      setForm({
        fecha_entrevista: "",
        motivo: "",
        observaciones: "",
        conclusiones: "",
        acciones_acordadas: "",
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
      fecha_entrevista: new Date(form.fecha_entrevista),
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-6 py-10">
        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl transition-all overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {initialData ? "Editar Entrevista Realizada" : "Registrar Entrevista Realizada"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de realización
              </label>
              <input
                type="date"
                name="fecha_entrevista"
                value={form.fecha_entrevista}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Motivo
              </label>
              <select
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un motivo</option>
                <option value="Psicológico">Psicológico</option>
                <option value="Vocacional">Vocacional</option>
                <option value="Académico">Académico</option>
                <option value="Familiar">Familiar</option>
                <option value="Social">Social</option>
                <option value="Otro">Otro</option>
              </select>
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
                placeholder="Observaciones generales de la entrevista"
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Conclusiones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conclusiones
              </label>
              <textarea
                name="conclusiones"
                value={form.conclusiones}
                onChange={handleChange}
                rows={3}
                placeholder="Conclusiones obtenidas de la entrevista"
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Acciones acordadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Acciones acordadas
              </label>
              <textarea
                name="acciones_acordadas"
                value={form.acciones_acordadas}
                onChange={handleChange}
                rows={3}
                placeholder="Acciones a seguir o compromisos"
                className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-600">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-slate-500 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
