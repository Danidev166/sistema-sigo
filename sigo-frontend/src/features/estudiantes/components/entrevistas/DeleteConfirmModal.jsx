/**
 * Modal de confirmación para eliminar entrevistas del estudiante.
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
// src/features/estudiantes/components/entrevistas/DeleteConfirmModal.jsx
import { Dialog } from "@headlessui/react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-6 py-10">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl transition-all">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
            Confirmar eliminación
          </Dialog.Title>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {title || "¿Estás seguro que deseas eliminar este registro?"}
          </p>

          <div className="mt-6 flex justify-end gap-3 flex-wrap">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-slate-500 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
