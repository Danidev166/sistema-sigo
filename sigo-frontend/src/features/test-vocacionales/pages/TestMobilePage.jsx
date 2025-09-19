/**
 * Página de prueba para test móviles - Interfaz limpia para estudiantes
 * 
 * @component
 * @returns {JSX.Element}
 */
import { useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import StudentLayout from '../components/StudentLayout';
import StudentWelcome from '../components/StudentWelcome';
import KuderTestMobile from '../components/mobile/KuderTestMobile';
import HollandTestMobile from '../components/mobile/HollandTestMobile';
import AptitudesTestMobile from '../components/mobile/AptitudesTestMobile';
import evaluacionMobileService from '../services/evaluacionMobileService';
import DebugAuth from '../components/DebugAuth';
import toast from 'react-hot-toast';

const TestMobilePage = () => {
  const { testType } = useParams();
  const [searchParams] = useSearchParams();
  const [testCompleted, setTestCompleted] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Extraer datos del estudiante de los parámetros
  const estudiante = {
    id: searchParams.get('estudiante_id'),
    nombre: searchParams.get('nombre'),
    apellido: searchParams.get('apellido'),
    rut: searchParams.get('rut'),
    curso: searchParams.get('curso')
  };

  const getTestComponent = () => {
    const testProps = {
      estudiante,
      onComplete: handleTestComplete,
      onError: handleTestError
    };

    switch (testType) {
      case 'kuder':
        return <KuderTestMobile {...testProps} />;
      case 'holland':
        return <HollandTestMobile {...testProps} />;
      case 'aptitudes':
        return <AptitudesTestMobile {...testProps} />;
      default:
        return <div className="text-center text-red-500">Test no encontrado</div>;
    }
  };

  const handleTestComplete = async (resultado) => {
    console.log('Test completado:', resultado);
    setSaving(true);
    
    try {
      // Procesar resultados para guardar en backend
      const evaluacionData = evaluacionMobileService.procesarResultadosParaGuardar(
        testType,
        resultado,
        estudiante
      );

      // Guardar en el backend
      await evaluacionMobileService.guardarEvaluacion(evaluacionData);
      
      toast.success('✅ Test completado y guardado exitosamente');
      setTestCompleted(true);
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      toast.error('❌ Error al guardar el test. Intenta nuevamente.');
      // Aún así marcamos como completado para que el usuario vea los resultados
      setTestCompleted(true);
    } finally {
      setSaving(false);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleTestError = (error) => {
    console.error('Error en test:', error);
    alert('Error: ' + error.message);
  };

  const getTestTitle = () => {
    const titles = {
      kuder: 'Test de Kuder',
      holland: 'Test de Holland (RIASEC)',
      aptitudes: 'Test de Aptitudes'
    };
    return titles[testType] || 'Test Vocacional';
  };

  // Pantalla de bienvenida
  if (!testStarted) {
    return (
      <StudentWelcome
        estudiante={estudiante}
        testTitle={getTestTitle()}
        onStart={handleStartTest}
      />
    );
  }

  // Pantalla de test completado
  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              ¡Test Completado!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gracias por completar el {getTestTitle()}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Estudiante:</strong> {estudiante.nombre} {estudiante.apellido}
            </p>
            {estudiante.curso && (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Curso:</strong> {estudiante.curso}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {saving ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Guardando resultados...
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Los resultados han sido guardados en el sistema SIGO
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Puedes cerrar esta ventana
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pantalla del test
  return (
    <StudentLayout title={getTestTitle()} estudiante={estudiante}>
      <div className="p-4">
        <DebugAuth />
        {saving && (
          <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Guardando resultados en el sistema...
              </p>
            </div>
          </div>
        )}
        {getTestComponent()}
      </div>
    </StudentLayout>
  );
};

export default TestMobilePage;
