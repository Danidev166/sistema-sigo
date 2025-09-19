/**
 * Modal de confirmación para eliminar intervenciones del estudiante.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onConfirm - Callback para confirmar eliminación
 * @returns {JSX.Element}
 *
 * @example
 * <DeleteConfirmModal isOpen={true} onClose={fn} onConfirm={fn} />
 */
// src/components/ui/DeleteConfirmModal.jsx
import { Dialog } from "@headlessui/react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center px-4 py-12">
        <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-gray-200 dark:border-slate-700">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
            ¿Confirmar eliminación?
          </Dialog.Title>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {title || "¿Estás seguro que deseas eliminar este registro?"}
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-slate-500"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
