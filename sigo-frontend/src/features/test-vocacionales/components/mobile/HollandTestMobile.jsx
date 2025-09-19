/**
 * Test de Holland (RIASEC) optimizado para móviles
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

const preguntas = [
  // REALISTA (R) - 5 preguntas
  { id: 1, texto: "¿Disfrutas reparando objetos mecánicos o arreglando cosas?", categoria: "Realista" },
  { id: 2, texto: "¿Te gusta trabajar con herramientas y máquinas?", categoria: "Realista" },
  { id: 3, texto: "¿Prefieres trabajos que requieren actividad física?", categoria: "Realista" },
  { id: 4, texto: "¿Te interesa la agricultura, pesca o actividades al aire libre?", categoria: "Realista" },
  { id: 5, texto: "¿Disfrutas construyendo o fabricando objetos?", categoria: "Realista" },
  
  // INVESTIGADOR (I) - 5 preguntas
  { id: 6, texto: "¿Te interesa hacer experimentos científicos?", categoria: "Investigador" },
  { id: 7, texto: "¿Disfrutas analizando problemas complejos?", categoria: "Investigador" },
  { id: 8, texto: "¿Te gusta estudiar y aprender sobre temas específicos?", categoria: "Investigador" },
  { id: 9, texto: "¿Prefieres trabajos que requieren pensamiento abstracto?", categoria: "Investigador" },
  { id: 10, texto: "¿Te interesa la investigación y el descubrimiento?", categoria: "Investigador" },
  
  // ARTÍSTICO (A) - 5 preguntas
  { id: 11, texto: "¿Te gusta participar en actividades creativas como la música o el arte?", categoria: "Artístico" },
  { id: 12, texto: "¿Te interesa expresarte a través del arte o la música?", categoria: "Artístico" },
  { id: 13, texto: "¿Disfrutas creando cosas originales y únicas?", categoria: "Artístico" },
  { id: 14, texto: "¿Te gusta trabajar de forma independiente y flexible?", categoria: "Artístico" },
  { id: 15, texto: "¿Prefieres ambientes de trabajo no convencionales?", categoria: "Artístico" },
  
  // SOCIAL (S) - 5 preguntas
  { id: 16, texto: "¿Disfrutas ayudar a otras personas con sus problemas?", categoria: "Social" },
  { id: 17, texto: "¿Te gusta enseñar o ayudar a otros a aprender?", categoria: "Social" },
  { id: 18, texto: "¿Te interesa trabajar en equipo y colaborar?", categoria: "Social" },
  { id: 19, texto: "¿Disfrutas escuchando y entendiendo a otras personas?", categoria: "Social" },
  { id: 20, texto: "¿Te gusta participar en actividades de servicio comunitario?", categoria: "Social" },
  
  // EMPRENDEDOR (E) - 5 preguntas
  { id: 21, texto: "¿Te interesa liderar proyectos o equipos?", categoria: "Emprendedor" },
  { id: 22, texto: "¿Disfrutas vender ideas o productos?", categoria: "Emprendedor" },
  { id: 23, texto: "¿Te gusta tomar decisiones importantes?", categoria: "Emprendedor" },
  { id: 24, texto: "¿Prefieres trabajos que requieren persuasión y negociación?", categoria: "Emprendedor" },
  { id: 25, texto: "¿Te interesa iniciar y dirigir tu propio negocio?", categoria: "Emprendedor" },
  
  // CONVENCIONAL (C) - 5 preguntas
  { id: 26, texto: "¿Prefieres seguir instrucciones claras y trabajar con datos?", categoria: "Convencional" },
  { id: 27, texto: "¿Te gustan los trabajos organizados y estructurados?", categoria: "Convencional" },
  { id: 28, texto: "¿Disfrutas trabajando con números y cálculos?", categoria: "Convencional" },
  { id: 29, texto: "¿Prefieres ambientes de trabajo estables y predecibles?", categoria: "Convencional" },
  { id: 30, texto: "¿Te gusta mantener registros y archivos organizados?", categoria: "Convencional" },
];

const categorias = {
  "Realista": { color: "bg-red-500", icon: "🔧", descripcion: "Práctico, realista, orientado a objetos" },
  "Investigador": { color: "bg-blue-500", icon: "🔬", descripcion: "Analítico, intelectual, curioso" },
  "Artístico": { color: "bg-purple-500", icon: "🎨", descripcion: "Creativo, expresivo, original" },
  "Social": { color: "bg-green-500", icon: "👥", descripcion: "Cooperativo, empático, servicial" },
  "Emprendedor": { color: "bg-yellow-500", icon: "💼", descripcion: "Líder, persuasivo, ambicioso" },
  "Convencional": { color: "bg-gray-500", icon: "📊", descripcion: "Organizado, detallista, confiable" }
};

const HollandTestMobile = ({ estudiante, onComplete, onError }) => {
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [completado, setCompletado] = useState(false);

  const handleRespuesta = (valor) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaActual]: parseInt(valor)
    }));
  };

  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(prev => prev + 1);
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(prev => prev - 1);
    }
  };

  const calcularResultado = () => {
    if (Object.keys(respuestas).length !== preguntas.length) {
      onError({ message: 'Debes responder todas las preguntas' });
      return;
    }

    // Calcular puntajes por categoría
    const puntajes = {};
    preguntas.forEach((pregunta, index) => {
      const categoria = pregunta.categoria;
      const puntaje = respuestas[index] || 0;
      puntajes[categoria] = (puntajes[categoria] || 0) + puntaje;
    });

    // Ordenar categorías por puntaje
    const categoriasOrdenadas = Object.entries(puntajes)
      .sort(([,a], [,b]) => b - a)
      .map(([categoria, puntaje]) => ({
        categoria,
        puntaje,
        porcentaje: Math.round((puntaje / (preguntas.filter(p => p.categoria === categoria).length * 5)) * 100)
      }));

    const resultado = {
      puntajes,
      categoriasOrdenadas,
      totalPreguntas: preguntas.length,
      respuestas,
      estudiante,
      fecha: new Date().toISOString(),
      tipo: 'holland'
    };

    setResultado(resultado);
    setCompletado(true);
    onComplete(resultado);
  };

  const progreso = ((Object.keys(respuestas).length / preguntas.length) * 100).toFixed(0);
  const preguntaCompletada = respuestas[preguntaActual] !== undefined;
  const pregunta = preguntas[preguntaActual];

  return (
    <div className="max-w-md mx-auto">
      {/* Header del test */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Test de Holland (RIASEC)
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {preguntaActual + 1} de {preguntas.length}
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
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categorias[pregunta.categoria].color}`}>
                  {categorias[pregunta.categoria].icon} {pregunta.categoria}
                </span>
              </div>
              <h3 className="text-base font-medium text-gray-800 dark:text-white">
                {pregunta.texto}
              </h3>
            </div>
            
            {/* Escala de respuesta */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((valor) => {
                const etiquetas = {
                  5: "Totalmente de acuerdo",
                  4: "De acuerdo", 
                  3: "Neutral",
                  2: "En desacuerdo",
                  1: "Totalmente en desacuerdo"
                };
                
                return (
                  <button
                    key={valor}
                    onClick={() => handleRespuesta(valor)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      respuestas[preguntaActual] === valor
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        respuestas[preguntaActual] === valor
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-slate-500'
                      }`}>
                        {respuestas[preguntaActual] === valor && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < valor ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-slate-600'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <span className="text-sm font-medium">{etiquetas[valor]}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
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
              {preguntaActual < preguntas.length - 1 ? (
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
              Tu perfil vocacional RIASEC
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-white">
              Perfil de Personalidad:
            </h4>
            {resultado.categoriasOrdenadas.map((item, index) => (
              <div key={item.categoria} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{categorias[item.categoria].icon}</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {item.categoria}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {item.porcentaje}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${categorias[item.categoria].color}`}
                    style={{ width: `${item.porcentaje}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {categorias[item.categoria].descripcion}
                </p>
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

export default HollandTestMobile;
