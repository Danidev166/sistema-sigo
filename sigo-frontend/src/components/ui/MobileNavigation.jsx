import React, { useState } from 'react';
import { Menu, X, BarChart3, Table, Download, RefreshCw } from 'lucide-react';

const MobileNavigation = ({ 
  showDashboard, 
  onToggleView, 
  onRefresh, 
  onExport,
  isLoading = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={`lg:hidden ${className}`}>
      {/* Botón de menú móvil */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleMenu}>
          <div className="absolute bottom-20 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 min-w-64">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Acciones Rápidas
              </h3>
              
              <div className="space-y-2">
                {/* Cambiar vista */}
                <button
                  onClick={() => handleAction(() => onToggleView(!showDashboard))}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {showDashboard ? <Table className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                  <span>{showDashboard ? 'Ver Tabla' : 'Ver Dashboard'}</span>
                </button>

                {/* Actualizar */}
                <button
                  onClick={() => handleAction(onRefresh)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Actualizar Datos</span>
                </button>

                {/* Exportar */}
                <button
                  onClick={() => handleAction(onExport)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Exportar Datos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
