/**
 * Test de Kuder optimizado para móviles
 * 
 * Interfaz táctil optimizada para dispositivos móviles
 * con navegación por gestos y diseño responsive
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.estudiante - Datos del estudiante
 * @param {Function} props.onComplete - Callback cuando se completa el test
 * @param {Function} props.onError - Callback para errores
 * @returns {JSX.Element}
 */
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const triadas = [
  // GRUPO 1-5: Actividades técnicas y mecánicas
  ["Arreglar una bicicleta", "Resolver un problema matemático", "Enseñar a niños"],
  ["Reparar un motor", "Diseñar un edificio", "Escribir un artículo"],
  ["Trabajar con herramientas", "Analizar datos científicos", "Dirigir una orquesta"],
  ["Construir una maqueta", "Hacer experimentos", "Pintar un cuadro"],
  ["Instalar un sistema eléctrico", "Calcular presupuestos", "Enseñar a adultos"],
  
  // GRUPO 6-10: Actividades creativas y artísticas
  ["Diseñar un afiche", "Organizar archivos", "Investigar sobre plantas"],
  ["Crear una obra de arte", "Vender productos", "Trabajar al aire libre"],
  ["Escribir cuentos", "Hacer experimentos", "Cantar en público"],
  ["Tocar un instrumento musical", "Leer poesía", "Convencer a alguien de una idea"],
  ["Fotografiar paisajes", "Organizar eventos", "Estudiar historia"],
  
  // GRUPO 11-15: Actividades sociales y de servicio
  ["Cuidar animales", "Reparar un motor", "Calcular presupuestos"],
  ["Ayudar a personas enfermas", "Resolver problemas matemáticos", "Dirigir una orquesta"],
  ["Trabajar en equipo", "Trabajar solo", "Liderar un proyecto"],
  ["Enseñar a niños", "Diseñar un edificio", "Analizar datos científicos"],
  ["Participar en voluntariado", "Crear una obra de arte", "Vender productos"],
  
  // GRUPO 16-20: Actividades de liderazgo y emprendimiento
  ["Convencer a alguien de una idea", "Leer poesía", "Tocar un instrumento musical"],
  ["Dirigir una empresa", "Investigar en laboratorio", "Escribir un libro"],
  ["Liderar un proyecto", "Trabajar con números", "Trabajar con personas"],
  ["Tomar decisiones importantes", "Seguir instrucciones", "Innovar constantemente"],
  ["Vender ideas", "Organizar archivos", "Debatir un tema"],
  
  // GRUPO 21-25: Actividades de investigación y análisis
  ["Investigar sobre plantas", "Diseñar un afiche", "Organizar archivos"],
  ["Analizar datos científicos", "Ayudar a personas enfermas", "Resolver problemas matemáticos"],
  ["Estudiar medicina", "Crear una obra de arte", "Vender productos"],
  ["Hacer experimentos", "Escribir cuentos", "Cantar en público"],
  ["Investigar en laboratorio", "Dirigir una orquesta", "Leer poesía"],
  
  // GRUPO 26-30: Actividades organizativas y administrativas
  ["Organizar archivos", "Investigar sobre plantas", "Diseñar un afiche"],
  ["Calcular presupuestos", "Cuidar animales", "Reparar un motor"],
  ["Trabajar con números", "Trabajar con personas", "Trabajar con ideas"],
  ["Seguir instrucciones", "Tomar decisiones", "Innovar constantemente"],
  ["Mantener registros", "Planificar actividades", "Supervisar trabajos"]
];

const KuderTestMobile = ({ estudiante, onComplete, onError }) => {
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [completado, setCompletado] = useState(false);

  const handleSeleccion = (opcion) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaActual]: opcion
    }));
  };

  const siguientePregunta = () => {
    if (preguntaActual < triadas.length - 1) {
      setPreguntaActual(prev => prev + 1);
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(prev => prev - 1);
    }
  };

  const calcularResultado = () => {
    if (Object.keys(respuestas).length !== triadas.length) {
      onError({ message: 'Debes responder todas las preguntas' });
      return;
    }

    const conteo = {};
    Object.values(respuestas).forEach((valor, i) => {
      const actividad = triadas[i][valor];
      conteo[actividad] = (conteo[actividad] || 0) + 1;
    });

    const resultado = {
      conteo,
      totalPreguntas: triadas.length,
      respuestas,
      estudiante,
      fecha: new Date().toISOString(),
      tipo: 'kuder'
    };

    setResultado(resultado);
    setCompletado(true);
    onComplete(resultado);
  };

  const progreso = ((Object.keys(respuestas).length / triadas.length) * 100).toFixed(0);
  const preguntaCompletada = respuestas[preguntaActual] !== undefined;

  return (
    <div className="max-w-md mx-auto">
      {/* Header del test */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Test de Kuder
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {preguntaActual + 1} de {triadas.length}
          </span>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {progreso}% completado
        </p>
      </div>

      {!completado ? (
        <>
          {/* Pregunta actual */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-4">
            <h3 className="text-base font-medium text-gray-800 dark:text-white mb-4">
              ¿Cuál de estas actividades prefieres?
            </h3>
            
            <div className="space-y-3">
              {triadas[preguntaActual].map((opcion, index) => (
                <button
                  key={index}
                  onClick={() => handleSeleccion(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    respuestas[preguntaActual] === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                      : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      respuestas[preguntaActual] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-slate-500'
                    }`}>
                      {respuestas[preguntaActual] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium">{opcion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-between items-center">
            <button
              onClick={preguntaAnterior}
              disabled={preguntaActual === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <div className="flex space-x-2">
              {preguntaActual < triadas.length - 1 ? (
                <button
                  onClick={siguientePregunta}
                  disabled={!preguntaCompletada}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={calcularResultado}
                  disabled={!preguntaCompletada}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Finalizar</span>
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Resultado del test */
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              ¡Test Completado!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Gracias por completar el test de Kuder
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 dark:text-white">
              Resultados:
            </h4>
            {Object.entries(resultado.conteo)
              .sort(([,a], [,b]) => b - a)
              .map(([actividad, puntaje]) => (
                <div key={actividad} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {actividad}
                  </span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {puntaje} puntos
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              Los resultados han sido guardados en el sistema SIGO
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KuderTestMobile;
