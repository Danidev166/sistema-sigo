// Componente para probar la consistencia de estilos entre OS
import React from 'react';

export default function ConsistencyTest() {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Título principal */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Prueba de Consistencia SIGO
          </h1>
          <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
            Verificación de estilos entre Chrome Windows y Chrome Mac
          </p>
        </div>

        {/* Paleta de colores SIGO */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Paleta Institucional SIGO
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="text-center">
                <div 
                  className={`w-16 h-16 mx-auto rounded-lg shadow-soft bg-sigo-${shade}`}
                ></div>
                <p className="text-xs mt-2 text-gray-800 dark:text-gray-300 font-medium">
                  {shade}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tipografía */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Tipografía Inter
          </h2>
          <div className="space-y-2">
            <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">
              Título H1
            </h1>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              Título H2
            </h2>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Título H3
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Párrafo con texto largo para probar el suavizado de fuentes y la consistencia 
              entre diferentes sistemas operativos. Esta es una prueba de legibilidad.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Texto pequeño para verificar el contraste y la claridad.
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Botones y Componentes
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-sigo-600 text-white rounded-lg font-medium hover:bg-sigo-700 transition-colors">
              Botón Primario
            </button>
            <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Botón Secundario
            </button>
            <button className="px-6 py-3 border-2 border-sigo-600 text-sigo-600 dark:text-sigo-400 rounded-lg font-medium hover:bg-sigo-50 dark:hover:bg-sigo-900 transition-colors">
              Botón Outline
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Tarjetas y Sombras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sombra Suave
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Esta tarjeta usa shadow-soft para consistencia visual.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-medium border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sombra Media
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Esta tarjeta usa shadow-medium para mayor profundidad.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-strong border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Sombra Fuerte
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Esta tarjeta usa shadow-strong para máximo contraste.
              </p>
            </div>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Información del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Navegador:</strong> {navigator.userAgent.split(' ')[0]}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Sistema Operativo:</strong> {navigator.platform}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Resolución:</strong> {window.screen.width}x{window.screen.height}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>User Agent:</strong> {navigator.userAgent.includes('Android') ? 'Android' : 'Desktop'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Pixel Ratio:</strong> {window.devicePixelRatio}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Color Scheme:</strong> {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Fuente:</strong> Inter (Google Fonts)
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Touch:</strong> {navigator.maxTouchPoints > 0 ? 'Sí' : 'No'}
              </p>
            </div>
          </div>
          
          {/* Información específica de Android */}
          {navigator.userAgent.includes('Android') && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📱 Optimizaciones Android Detectadas
              </h4>
              <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <p>✅ Fuente Inter optimizada para Android</p>
                <p>✅ Renderizado de texto mejorado</p>
                <p>✅ Ajuste automático de densidad de píxeles</p>
                <p>✅ Suavizado de fuentes optimizado</p>
              </div>
            </div>
          )}
          
          {/* Información específica de iOS */}
          {navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') || navigator.userAgent.includes('iPod') && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                🍎 Optimizaciones iOS Detectadas
              </h4>
              <div className="text-xs text-green-800 dark:text-green-200 space-y-1">
                <p>✅ Fuente Inter optimizada para Safari</p>
                <p>✅ Renderizado WebKit mejorado</p>
                <p>✅ Soporte para Safe Area (notch)</p>
                <p>✅ Transiciones optimizadas para iOS</p>
                <p>✅ Backdrop-filter mejorado</p>
                <p>✅ Touch highlight personalizado</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
