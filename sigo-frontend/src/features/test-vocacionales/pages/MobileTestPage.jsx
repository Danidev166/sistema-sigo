/**
 * Página móvil optimizada para test vocacionales
 * 
 * Interfaz específicamente diseñada para dispositivos móviles
 * que acceden a través de códigos QR
 * 
 * @component
 * @returns {JSX.Element} Página móvil de test vocacionales
 * 
 * @example
 * <Route path="/test-mobile/:testType" element={<MobileTestPage />} />
 */
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import KuderTestMobile from '../components/mobile/KuderTestMobile';
import HollandTestMobile from '../components/mobile/HollandTestMobile';
import AptitudesTestMobile from '../components/mobile/AptitudesTestMobile';

const MobileTestPage = () => {
  const { testType } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEstudianteData();
  }, []);

  const loadEstudianteData = () => {
    try {
      const estudianteData = {
        id: searchParams.get('estudiante_id'),
        nombre: searchParams.get('nombre'),
        apellido: searchParams.get('apellido'),
        rut: searchParams.get('rut'),
        curso: searchParams.get('curso')
      };

      // Validar datos requeridos
      if (!estudianteData.id || !estudianteData.nombre) {
        setError('Datos del estudiante incompletos');
        return;
      }

      setEstudiante(estudianteData);
    } catch (err) {
      console.error('Error cargando datos del estudiante:', err);
      setError('Error al cargar datos del estudiante');
    } finally {
      setLoading(false);
    }
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
        return <div>Test no encontrado</div>;
    }
  };

  const handleTestComplete = (resultado) => {
    // Aquí se guardaría el resultado en el backend
    console.log('Test completado:', resultado);
    // Mostrar mensaje de éxito y opciones
  };

  const handleTestError = (error) => {
    console.error('Error en test:', error);
    setError(error.message || 'Error al procesar el test');
  };

  const getTestTitle = () => {
    const titles = {
      kuder: 'Test de Kuder',
      holland: 'Test de Holland (RIASEC)',
      aptitudes: 'Test de Aptitudes'
    };
    return titles[testType] || 'Test Vocacional';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header móvil */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                {getTestTitle()}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {estudiante?.nombre} {estudiante?.apellido}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-blue-500">
              <Smartphone className="h-5 w-5" />
              <span className="text-xs font-medium">MÓVIL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información del estudiante */}
      <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Estudiante: {estudiante?.nombre} {estudiante?.apellido}
            </p>
            {estudiante?.curso && (
              <p className="text-xs text-blue-600 dark:text-blue-300">
                Curso: {estudiante.curso}
              </p>
            )}
          </div>
          <CheckCircle className="h-5 w-5 text-blue-500" />
        </div>
      </div>

      {/* Contenido del test */}
      <div className="p-4">
        {getTestComponent()}
      </div>

      {/* Footer móvil */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4">
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

export default MobileTestPage;


