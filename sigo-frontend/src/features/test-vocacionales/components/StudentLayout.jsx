/**
 * Layout minimalista para estudiantes
 * 
 * Interfaz limpia sin menús del sistema, solo para test vocacionales
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a renderizar
 * @param {string} props.title - Título del test
 * @param {Object} props.estudiante - Datos del estudiante
 * @returns {JSX.Element}
 */
import { useState } from 'react';

const StudentLayout = ({ children, title, estudiante }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header minimalista */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {estudiante?.nombre} {estudiante?.apellido}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                title="Información del estudiante"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="flex items-center space-x-1 text-blue-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium">MÓVIL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información del estudiante (expandible) */}
        {showInfo && (
          <div className="px-4 pb-3 border-t border-gray-200 dark:border-slate-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Nombre:</span>
                  <p className="text-blue-800 dark:text-blue-200">{estudiante?.nombre} {estudiante?.apellido}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">RUT:</span>
                  <p className="text-blue-800 dark:text-blue-200">{estudiante?.rut || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Curso:</span>
                  <p className="text-blue-800 dark:text-blue-200">{estudiante?.curso || 'No especificado'}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Test:</span>
                  <p className="text-blue-800 dark:text-blue-200">{title}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer minimalista */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-3">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sistema Integrado de Gestión y Orientación (SIGO)
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Acceso móvil vía código QR
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;


