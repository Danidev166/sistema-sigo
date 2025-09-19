/**
 * Página de bienvenida para estudiantes
 * 
 * Interfaz de presentación antes de comenzar el test
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.estudiante - Datos del estudiante
 * @param {string} props.testTitle - Título del test
 * @param {Function} props.onStart - Callback para comenzar el test
 * @returns {JSX.Element}
 */
import { CheckCircle, Clock, Smartphone, BookOpen } from 'lucide-react';

const StudentWelcome = ({ estudiante, testTitle, onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            ¡Bienvenido/a!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Estás a punto de realizar el {testTitle}
          </p>
        </div>

        {/* Información del estudiante */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
            Información del Estudiante
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300">Nombre:</span>
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                {estudiante.nombre} {estudiante.apellido}
              </span>
            </div>
            {estudiante.curso && (
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Curso:</span>
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  {estudiante.curso}
                </span>
              </div>
            )}
            {estudiante.rut && (
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">RUT:</span>
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  {estudiante.rut}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Instrucciones:
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Responde todas las preguntas con sinceridad
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tómate tu tiempo para pensar cada respuesta
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Puedes usar tu dispositivo móvil cómodamente
              </p>
            </div>
          </div>
        </div>

        {/* Información del test */}
        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Sobre este test:
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Este test te ayudará a identificar tus intereses y aptitudes vocacionales. 
            Los resultados serán utilizados para orientarte en tu futuro académico y profesional.
          </p>
        </div>

        {/* Botón de inicio */}
        <button
          onClick={onStart}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <BookOpen className="w-5 h-5" />
          <span>Comenzar Test</span>
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sistema Integrado de Gestión y Orientación (SIGO)
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentWelcome;


