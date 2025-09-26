/**
 * Componente de modal responsive mejorado
 * 
 * Este componente proporciona un modal que se adapta automáticamente
 * a diferentes tamaños de pantalla con mejor UX
 */

import { memo, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * @typedef {Object} ResponsiveModalProps
 * @property {boolean} isOpen - Si el modal está abierto
 * @property {Function} onClose - Función para cerrar el modal
 * @property {string} [title] - Título del modal
 * @property {string} [size] - Tamaño del modal: 'sm', 'md', 'lg', 'xl', 'full'
 * @property {boolean} [closeOnOverlayClick] - Si se cierra al hacer clic en el overlay
 * @property {boolean} [showCloseButton] - Si mostrar el botón de cerrar
 * @property {string} [className] - Clases CSS adicionales
 * @property {React.ReactNode} children - Contenido del modal
 */

const ResponsiveModal = memo(({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  children,
  ...props
}) => {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md sm:max-w-lg',
    lg: 'max-w-lg sm:max-w-xl lg:max-w-2xl',
    xl: 'max-w-xl sm:max-w-2xl lg:max-w-3xl',
    full: 'max-w-full mx-4 sm:mx-6 lg:mx-8'
  };

  const modalClasses = cn(
    'relative w-full bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-xl',
    sizeClasses[size],
    className
  );

  return (
    <Dialog
      open={isOpen}
      onClose={closeOnOverlayClick ? onClose : () => {}}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      {...props}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className={modalClasses}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
            {title && (
              <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </Dialog.Title>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </Dialog>
  );
});

ResponsiveModal.displayName = 'ResponsiveModal';

export default ResponsiveModal;
