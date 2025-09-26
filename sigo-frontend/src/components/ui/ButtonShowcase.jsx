// src/components/ui/ButtonShowcase.jsx
import React from 'react';
import ModernButton from './ModernButton';
import { 
  PlusIcon, 
  CheckIcon, 
  XMarkIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  DownloadIcon,
  UploadIcon,
  SaveIcon,
  EditIcon
} from '@heroicons/react/24/outline';

/**
 * Componente de demostración para mostrar todos los estilos de botones modernos
 */
const ButtonShowcase = () => {
  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Sistema de Botones Modernos
        </h1>
        
        {/* Variantes de botones */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Variantes de Botones
            </h2>
            <div className="flex flex-wrap gap-4">
              <ModernButton variant="primary" icon={<PlusIcon className="w-4 h-4" />}>
                Primario
              </ModernButton>
              <ModernButton variant="secondary" icon={<PencilIcon className="w-4 h-4" />}>
                Secundario
              </ModernButton>
              <ModernButton variant="success" icon={<CheckIcon className="w-4 h-4" />}>
                Éxito
              </ModernButton>
              <ModernButton variant="warning" icon={<EyeIcon className="w-4 h-4" />}>
                Advertencia
              </ModernButton>
              <ModernButton variant="danger" icon={<TrashIcon className="w-4 h-4" />}>
                Peligro
              </ModernButton>
              <ModernButton variant="info" icon={<DownloadIcon className="w-4 h-4" />}>
                Información
              </ModernButton>
              <ModernButton variant="ghost" icon={<EditIcon className="w-4 h-4" />}>
                Fantasma
              </ModernButton>
            </div>
          </section>

          {/* Tamaños de botones */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Tamaños de Botones
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <ModernButton size="xs" icon={<PlusIcon className="w-3 h-3" />}>
                Extra Pequeño
              </ModernButton>
              <ModernButton size="sm" icon={<PlusIcon className="w-4 h-4" />}>
                Pequeño
              </ModernButton>
              <ModernButton size="md" icon={<PlusIcon className="w-4 h-4" />}>
                Mediano
              </ModernButton>
              <ModernButton size="lg" icon={<PlusIcon className="w-5 h-5" />}>
                Grande
              </ModernButton>
              <ModernButton size="xl" icon={<PlusIcon className="w-6 h-6" />}>
                Extra Grande
              </ModernButton>
            </div>
          </section>

          {/* Posición de iconos */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Posición de Iconos
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Icono a la Izquierda (por defecto)
                </h3>
                <div className="flex flex-wrap gap-4">
                  <ModernButton icon={<SaveIcon className="w-4 h-4" />}>
                    Guardar
                  </ModernButton>
                  <ModernButton variant="success" icon={<CheckIcon className="w-4 h-4" />}>
                    Confirmar
                  </ModernButton>
                  <ModernButton variant="info" icon={<DownloadIcon className="w-4 h-4" />}>
                    Descargar
                  </ModernButton>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Icono a la Derecha
                </h3>
                <div className="flex flex-wrap gap-4">
                  <ModernButton icon={<UploadIcon className="w-4 h-4" />} iconPosition="right">
                    Subir Archivo
                  </ModernButton>
                  <ModernButton variant="success" icon={<CheckIcon className="w-4 h-4" />} iconPosition="right">
                    Completado
                  </ModernButton>
                  <ModernButton variant="danger" icon={<XMarkIcon className="w-4 h-4" />} iconPosition="right">
                    Cancelar
                  </ModernButton>
                </div>
              </div>
            </div>
          </section>

          {/* Estados de botones */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Estados de Botones
            </h2>
            <div className="flex flex-wrap gap-4">
              <ModernButton icon={<SaveIcon className="w-4 h-4" />}>
                Normal
              </ModernButton>
              <ModernButton loading icon={<SaveIcon className="w-4 h-4" />}>
                Cargando
              </ModernButton>
              <ModernButton disabled icon={<SaveIcon className="w-4 h-4" />}>
                Deshabilitado
              </ModernButton>
            </div>
          </section>

          {/* Botones para acciones específicas del sistema */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Botones para el Sistema SIGO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Gestión de Estudiantes
                </h3>
                <div className="space-y-2">
                  <ModernButton variant="primary" icon={<PlusIcon className="w-4 h-4" />} className="w-full">
                    Agregar Estudiante
                  </ModernButton>
                  <ModernButton variant="info" icon={<EyeIcon className="w-4 h-4" />} className="w-full">
                    Ver Detalles
                  </ModernButton>
                  <ModernButton variant="warning" icon={<PencilIcon className="w-4 h-4" />} className="w-full">
                    Editar
                  </ModernButton>
                  <ModernButton variant="danger" icon={<TrashIcon className="w-4 h-4" />} className="w-full">
                    Eliminar
                  </ModernButton>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Reportes y Exportación
                </h3>
                <div className="space-y-2">
                  <ModernButton variant="success" icon={<DownloadIcon className="w-4 h-4" />} className="w-full">
                    Exportar PDF
                  </ModernButton>
                  <ModernButton variant="info" icon={<DownloadIcon className="w-4 h-4" />} className="w-full">
                    Exportar Excel
                  </ModernButton>
                  <ModernButton variant="secondary" icon={<EyeIcon className="w-4 h-4" />} className="w-full">
                    Ver Reporte
                  </ModernButton>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Acciones del Sistema
                </h3>
                <div className="space-y-2">
                  <ModernButton variant="primary" icon={<SaveIcon className="w-4 h-4" />} className="w-full">
                    Guardar Cambios
                  </ModernButton>
                  <ModernButton variant="ghost" icon={<XMarkIcon className="w-4 h-4" />} className="w-full">
                    Cancelar
                  </ModernButton>
                  <ModernButton variant="success" icon={<CheckIcon className="w-4 h-4" />} className="w-full">
                    Confirmar
                  </ModernButton>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;
