// src/features/estudiantes/components/Modal.jsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Modal({ isOpen, onClose, title, children, size = "lg" }) {
  if (!isOpen) return null;

  const sizeClass =
    size === "sm"
      ? "max-w-sm"
      : size === "lg"
      ? "max-w-4xl"
      : size === "max"
      ? "max-w-6xl"
      : "max-w-3xl";

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Fondo oscurecido con desenfoque */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${sizeClass} transform rounded-xl bg-white dark:bg-slate-800 shadow-2xl transition-all`}
              >
                {/* Header del modal */}
                <div className="bg-gradient-to-r from-blue-50 to-white dark:from-slate-700 dark:to-slate-800 px-6 py-4 border-b dark:border-slate-600 rounded-t-xl">
                  {title && (
                    <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white">
                      {title}
                    </Dialog.Title>
                  )}
                </div>

                {/* Contenido */}
                <div className="px-6 py-6">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
