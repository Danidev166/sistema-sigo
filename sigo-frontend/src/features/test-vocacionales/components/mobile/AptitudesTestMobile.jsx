/**
 * Test de Aptitudes optimizado para móviles
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
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Brain, Calculator, Lightbulb } from 'lucide-react';

const preguntas = [
  // APTITUD MATEMÁTICA (5 preguntas)
  { 
    id: 1, 
    texto: "Resuelvo problemas matemáticos con facilidad.", 
    categoria: "Matemática",
    icon: "🧮"
  },
  { 
    id: 2, 
    texto: "Puedo realizar cálculos mentales rápidamente.", 
    categoria: "Matemática",
    icon: "🧮"
  },
  { 
    id: 3, 
    texto: "Entiendo conceptos de álgebra y geometría sin dificultad.", 
    categoria: "Matemática",
    icon: "🧮"
  },
  { 
    id: 4, 
    texto: "Me gusta trabajar con números y estadísticas.", 
    categoria: "Matemática",
    icon: "🧮"
  },
  { 
    id: 5, 
    texto: "Puedo resolver problemas de lógica matemática.", 
    categoria: "Matemática",
    icon: "🧮"
  },
  
  // APTITUD CIENTÍFICA (5 preguntas)
  { 
    id: 6, 
    texto: "Comprendo conceptos científicos rápidamente.", 
    categoria: "Científica",
    icon: "🔬"
  },
  { 
    id: 7, 
    texto: "Me interesa entender cómo funcionan las cosas.", 
    categoria: "Científica",
    icon: "🔬"
  },
  { 
    id: 8, 
    texto: "Puedo analizar datos experimentales.", 
    categoria: "Científica",
    icon: "🔬"
  },
  { 
    id: 9, 
    texto: "Entiendo principios de física y química.", 
    categoria: "Científica",
    icon: "🔬"
  },
  { 
    id: 10, 
    texto: "Me gusta hacer experimentos y observaciones.", 
    categoria: "Científica",
    icon: "🔬"
  },
  
  // APTITUD VERBAL (5 preguntas)
  { 
    id: 11, 
    texto: "Me expreso claramente por escrito.", 
    categoria: "Verbal",
    icon: "✍️"
  },
  { 
    id: 12, 
    texto: "Comprendo rápidamente lo que leo.", 
    categoria: "Verbal",
    icon: "📖"
  },
  { 
    id: 13, 
    texto: "Tengo facilidad para aprender idiomas.", 
    categoria: "Verbal",
    icon: "🌍"
  },
  { 
    id: 14, 
    texto: "Puedo explicar conceptos complejos de manera simple.", 
    categoria: "Verbal",
    icon: "💬"
  },
  { 
    id: 15, 
    texto: "Me gusta escribir y redactar textos.", 
    categoria: "Verbal",
    icon: "📝"
  },
  
  // APTITUD LÓGICA (5 preguntas)
  { 
    id: 16, 
    texto: "Encuentro patrones o relaciones fácilmente.", 
    categoria: "Lógica",
    icon: "🔍"
  },
  { 
    id: 17, 
    texto: "Tomo decisiones con lógica y razonamiento.", 
    categoria: "Lógica",
    icon: "⚖️"
  },
  { 
    id: 18, 
    texto: "Puedo resolver problemas paso a paso.", 
    categoria: "Lógica",
    icon: "🧩"
  },
  { 
    id: 19, 
    texto: "Analizo situaciones desde diferentes perspectivas.", 
    categoria: "Lógica",
    icon: "🔍"
  },
  { 
    id: 20, 
    texto: "Identifico errores en argumentos o razonamientos.", 
    categoria: "Lógica",
    icon: "⚠️"
  },
  
  // APTITUD ESPACIAL (5 preguntas)
  { 
    id: 21, 
    texto: "Puedo visualizar objetos en tres dimensiones.", 
    categoria: "Espacial",
    icon: "🎯"
  },
  { 
    id: 22, 
    texto: "Tengo facilidad para leer mapas y planos.", 
    categoria: "Espacial",
    icon: "🗺️"
  },
  { 
    id: 23, 
    texto: "Puedo imaginar cómo se vería algo desde otro ángulo.", 
    categoria: "Espacial",
    icon: "🔄"
  },
  { 
    id: 24, 
    texto: "Me gusta resolver rompecabezas y laberintos.", 
    categoria: "Espacial",
    icon: "🧩"
  },
  { 
    id: 25, 
    texto: "Tengo buena orientación espacial.", 
    categoria: "Espacial",
    icon: "🧭"
  },
  
  // APTITUD MECÁNICA (5 preguntas)
  { 
    id: 26, 
    texto: "Entiendo cómo funcionan las máquinas.", 
    categoria: "Mecánica",
    icon: "⚙️"
  },
  { 
    id: 27, 
    texto: "Puedo arreglar objetos mecánicos.", 
    categoria: "Mecánica",
    icon: "🔧"
  },
  { 
    id: 28, 
    texto: "Me gusta trabajar con herramientas.", 
    categoria: "Mecánica",
    icon: "🛠️"
  },
  { 
    id: 29, 
    texto: "Comprendo diagramas técnicos y esquemas.", 
    categoria: "Mecánica",
    icon: "📐"
  },
  { 
    id: 30, 
    texto: "Tengo habilidad para el trabajo manual.", 
    categoria: "Mecánica",
    icon: "✋"
  }
];

const categorias = {
  "Matemática": { color: "bg-blue-500", descripcion: "Habilidad para trabajar con números y conceptos matemáticos" },
  "Científica": { color: "bg-green-500", descripcion: "Capacidad para entender principios científicos" },
  "Verbal": { color: "bg-indigo-500", descripcion: "Facilidad para expresarse y comprender textos" },
  "Lógica": { color: "bg-red-500", descripcion: "Capacidad de razonamiento lógico y análisis" },
  "Espacial": { color: "bg-purple-500", descripcion: "Habilidad para visualizar y orientarse en el espacio" },
  "Mecánica": { color: "bg-orange-500", descripcion: "Facilidad para entender y trabajar con máquinas" }
};

const AptitudesTestMobile = ({ estudiante, onComplete, onError }) => {
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

    // Calcular promedio general
    const total = Object.values(respuestas).reduce((a, b) => a + b, 0);
    const promedio = total / preguntas.length;

    // Ordenar categorías por puntaje
    const categoriasOrdenadas = Object.entries(puntajes)
      .sort(([,a], [,b]) => b - a)
      .map(([categoria, puntaje]) => ({
        categoria,
        puntaje,
        promedio: puntaje / preguntas.filter(p => p.categoria === categoria).length
      }));

    const resultado = {
      puntajes,
      categoriasOrdenadas,
      total,
      promedio: Math.round(promedio * 10) / 10,
      totalPreguntas: preguntas.length,
      respuestas,
      estudiante,
      fecha: new Date().toISOString(),
      tipo: 'aptitudes'
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
            Test de Aptitudes
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
                <span className="text-2xl">{pregunta.icon}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categorias[pregunta.categoria].color}`}>
                  {pregunta.categoria}
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
                  5: "Muy de acuerdo",
                  4: "De acuerdo", 
                  3: "Neutral",
                  2: "En desacuerdo",
                  1: "Muy en desacuerdo"
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
              Tu perfil de aptitudes
            </p>
          </div>

          {/* Puntaje general */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Brain className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  Puntaje General
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {resultado.promedio}/5.0
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {resultado.promedio >= 4 ? "Excelente" : 
                 resultado.promedio >= 3 ? "Bueno" : 
                 resultado.promedio >= 2 ? "Regular" : "Necesita mejorar"}
              </p>
            </div>
          </div>

          {/* Aptitudes por categoría */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-white">
              Aptitudes por Categoría:
            </h4>
            {resultado.categoriasOrdenadas.map((item, index) => (
              <div key={item.categoria} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{preguntas.find(p => p.categoria === item.categoria)?.icon}</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {item.categoria}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {item.promedio.toFixed(1)}/5.0
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${categorias[item.categoria].color}`}
                    style={{ width: `${(item.promedio / 5) * 100}%` }}
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

export default AptitudesTestMobile;
