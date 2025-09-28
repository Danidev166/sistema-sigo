import { useState } from 'react';
import { X, Users, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { getCursoColor } from '../constants/cursos';

/**
 * Modal para envío masivo de tests a estudiantes por curso
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Array} props.cursosSeleccionados - Cursos seleccionados
 * @param {Array} props.estudiantesPorCurso - Información de estudiantes por curso
 * @param {Function} props.onConfirm - Callback para confirmar envío
 * @returns {JSX.Element}
 */
export default function EnvioMasivoTestsModal({ 
  isOpen, 
  onClose, 
  cursosSeleccionados, 
  estudiantesPorCurso, 
  onConfirm 
}) {
  const [tipoTest, setTipoTest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const tiposTest = [
    { value: 'holland', label: 'Test de Holland', description: 'Intereses vocacionales' },
    { value: 'kuder', label: 'Test de Kuder', description: 'Aptitudes profesionales' },
    { value: 'aptitudes', label: 'Test de Aptitudes', description: 'Habilidades específicas' }
  ];

  const totalEstudiantes = estudiantesPorCurso.reduce((sum, item) => sum + item.count, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tipoTest) {
      setError('Por favor selecciona un tipo de test');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onConfirm({
        cursos: cursosSeleccionados,
        tipoTest,
        estudiantesPorCurso
      });
      
      // Cerrar modal después del envío exitoso
      onClose();
      setTipoTest('');
    } catch (err) {
      setError('Error al enviar los tests. Inténtalo de nuevo.');
      console.error('Error en envío masivo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setTipoTest('');
      setError('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Envío Masivo de Tests
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enviar tests a {totalEstudiantes} estudiante{totalEstudiantes !== 1 ? 's' : ''} de {cursosSeleccionados.length} curso{cursosSeleccionados.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Resumen de cursos seleccionados */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Cursos seleccionados:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {estudiantesPorCurso.map(({ curso, count }) => (
              <div
                key={curso}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCursoColor(curso)}`}>
                    {curso.split(' ')[0]}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {curso}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {count} estudiante{count !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de tipo de test */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de test a enviar:
            </label>
            <div className="space-y-3">
              {tiposTest.map((test) => (
                <label
                  key={test.value}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    tipoTest === test.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="tipoTest"
                    value={test.value}
                    checked={tipoTest === test.value}
                    onChange={(e) => setTipoTest(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 ${
                    tipoTest === test.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-slate-600'
                  }`}>
                    {tipoTest === test.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {test.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {test.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Resumen final */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Resumen del envío
              </span>
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              Se enviará el <strong>{tiposTest.find(t => t.value === tipoTest)?.label || 'test seleccionado'}</strong> a{' '}
              <strong>{totalEstudiantes} estudiante{totalEstudiantes !== 1 ? 's' : ''}</strong> de{' '}
              <strong>{cursosSeleccionados.length} curso{cursosSeleccionados.length !== 1 ? 's' : ''}</strong>.
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!tipoTest || isLoading}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Enviar Tests</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
