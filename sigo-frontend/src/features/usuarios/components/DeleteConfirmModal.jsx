/**
 * Modal de confirmación para eliminar usuarios.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onConfirm - Callback para confirmar eliminación
 * @param {Object} [props.usuario] - Usuario a eliminar
 * @returns {JSX.Element}
 *
 * @example
 * <DeleteConfirmModal isOpen={true} onClose={fn} onConfirm={fn} usuario={user} />
 */
// src/components/ui/DeleteConfirmModal.jsx

import { Dialog } from "@headlessui/react";
import { TrashIcon } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 z-10 border border-gray-200 dark:border-slate-700">
        <Dialog.Title className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <TrashIcon className="text-red-600" />
          Confirmar eliminación
        </Dialog.Title>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          ¿Estás seguro de que deseas eliminar{" "}
          <span className="font-medium text-gray-900 dark:text-white">{itemName}</span>? Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 dark:text-white border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Dialog>
  );
}
