import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";

/**
 * Modal de formulario para crear o editar registros de conducta del estudiante.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <ConductaFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
export default function ConductaFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    fecha: "",
    categoria: "",
    observacion: "",
  });

  // Maneja cambios de initialData con seguridad
  useEffect(() => {
    if (isOpen) {
      setForm({
        fecha: initialData?.fecha ? format(new Date(initialData.fecha), "yyyy-MM-dd") : "",
        categoria: initialData?.categoria ?? "",
        observacion: initialData?.observacion ?? "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fechaValida = form.fecha ? new Date(form.fecha) : null;
    onSubmit({ ...form, fecha: fechaValida });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {initialData ? "Editar Registro de Conducta" : "Nueva Conducta"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Categoría</label>
              <input
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Ej: agresividad, desobediencia..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Observación</label>
              <textarea
                name="observacion"
                value={form.observacion}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
                placeholder="Describe la conducta observada"
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
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
