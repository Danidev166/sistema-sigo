/**
 * Modal de formulario para crear o editar intervenciones del estudiante.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <IntervencionFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
// src/features/estudiantes/components/intervenciones/IntervencionFormModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";

export default function IntervencionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    fecha: "",
    accion: "",
    meta: "",
    compromiso: "",
    responsable: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        fecha: initialData.fecha
          ? format(new Date(initialData.fecha), "yyyy-MM-dd")
          : "",
        accion: initialData.accion || "",
        meta: initialData.meta || "",
        compromiso: initialData.compromiso || "",
        responsable: initialData.responsable || "",
      });
    } else {
      setForm({
        fecha: "",
        accion: "",
        meta: "",
        compromiso: "",
        responsable: "",
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
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-12">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-gray-200 dark:border-slate-700">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {initialData ? "Editar Intervención" : "Nueva Intervención"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Acción</label>
              <input
                type="text"
                name="accion"
                value={form.accion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Meta</label>
              <textarea
                name="meta"
                value={form.meta}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Compromiso</label>
              <textarea
                name="compromiso"
                value={form.compromiso}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">Responsable</label>
              <input
                type="text"
                name="responsable"
                value={form.responsable}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
