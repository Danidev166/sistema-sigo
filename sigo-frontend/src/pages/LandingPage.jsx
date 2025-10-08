import { useNavigate } from 'react-router-dom'
import logo from '/src/assets/logo.webp'
import Footer from '../components/layout/Footer'
import ButtonPrimary from '../components/ui/ButtonPrimary'

/**
 * Página de bienvenida (Landing Page) del sistema SIGO.
 *
 * Muestra información introductoria y enlaces principales.
 *
 * @component
 * @returns {JSX.Element} Página de bienvenida
 *
 * @example
 * <Route path="/" element={<LandingPage />} />
 */

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#0e1a33] via-[#1a2a4a] to-[#0e1a33] text-white relative overflow-hidden">
      {/* Marca de agua institucional - Responsive */}
      <img
        src={logo}
        alt="Marca de agua"
        className="absolute inset-0 w-full h-full object-contain opacity-5 z-0 pointer-events-none select-none"
      />

      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] z-0"></div>

      {/* Contenido centrado - Completamente responsive */}
      <div className="flex-grow flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl w-full py-8 sm:py-12 md:py-16">
          {/* Logo responsive con animación */}
          <div className="mb-6 sm:mb-8">
            <img
              src={logo}
              alt="Logo SIGO"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mx-auto border-2 border-white rounded-full object-cover shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Título principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-2 sm:mb-3 tracking-wide bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            SIGO
          </h1>
          
          {/* Subtítulo */}
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-4 sm:mb-6 uppercase text-blue-300 tracking-wider">
            Sistema Integral de Gestión de Orientación
          </h2>

          {/* Descripción */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 px-2 sm:px-4 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            Plataforma digital para la administración eficiente de estudiantes,
            recursos y procesos de orientación escolar.
          </p>

          {/* Características destacadas - Solo en pantallas grandes */}
          <div className="hidden md:block mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-2xl mb-2">👥</div>
                <h3 className="text-sm font-semibold text-blue-200">Gestión Estudiantil</h3>
                <p className="text-xs text-gray-400">Administra estudiantes eficientemente</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="text-sm font-semibold text-blue-200">Reportes Avanzados</h3>
                <p className="text-xs text-gray-400">Análisis detallado de datos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="text-sm font-semibold text-blue-200">Seguro y Confiable</h3>
                <p className="text-xs text-gray-400">Protección de datos garantizada</p>
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <ButtonPrimary
              onClick={() => navigate('/login')}
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              🚀 Ingresar al Sistema
            </ButtonPrimary>
            
            {/* Botón secundario para pantallas grandes */}
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:block px-6 py-3 text-sm font-medium text-blue-300 hover:text-white border border-blue-300 hover:border-white rounded-lg transition-colors duration-300"
            >
              Más Información
            </button>
          </div>

          {/* Indicador de scroll - Solo en móvil */}
          <div className="md:hidden mt-8">
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto">
                <div className="w-1 h-3 bg-white/50 rounded-full mx-auto mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer fijo institucional */}
      <Footer />
    </div>
  )
}
