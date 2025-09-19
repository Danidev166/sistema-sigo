import { useNavigate } from 'react-router-dom'
import logo from '/src/assets/logo.png'
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
    <div className="min-h-screen flex flex-col justify-between bg-[#0e1a33] text-white relative overflow-hidden">
      {/* Marca de agua institucional */}
      <img
        src={logo}
        alt="Marca de agua"
        className="absolute inset-0 w-full h-full object-contain opacity-5 z-0 pointer-events-none select-none"
      />

      {/* Contenido centrado */}
      <div className="flex-grow flex items-center justify-center relative z-10 px-4">
        <div className="text-center max-w-xl w-full py-10">
          <img
            src={logo}
            alt="Logo SIGO"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-6 mx-auto border-2 border-white rounded-full object-cover"
          />

          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-wide">SIGO</h1>
          <h2 className="text-base md:text-lg font-semibold mb-4 uppercase text-blue-300">
            Sistema Integral de Gestión de Orientación
          </h2>

          <p className="text-sm md:text-base text-gray-300 px-4 mb-6 leading-relaxed">
            Plataforma digital para la administración eficiente de estudiantes,
            recursos y procesos de orientación escolar.
          </p>

          <div className="flex justify-center">
            <ButtonPrimary
              onClick={() => navigate('/login')}
              className="px-6 py-3 text-base"
            >
              Ingresar
            </ButtonPrimary>
          </div>
        </div>
      </div>

      {/* Footer fijo institucional */}
      <Footer />
    </div>
  )
}
