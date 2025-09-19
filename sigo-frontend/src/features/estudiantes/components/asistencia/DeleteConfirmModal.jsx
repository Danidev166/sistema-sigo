/**
 * Modal de confirmación para eliminar registros de asistencia.
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
// src/features/estudiantes/components/asistencia/DeleteConfirmModal.jsx
import { Dialog } from "@headlessui/react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 rounded-lg max-w-sm w-full p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
            Confirmar eliminación
          </Dialog.Title>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {title || "¿Estás seguro que deseas eliminar este registro?"}
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
