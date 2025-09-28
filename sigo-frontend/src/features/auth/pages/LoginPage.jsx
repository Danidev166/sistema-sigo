/**
 * Página de inicio de sesión.
 *
 * Permite a los usuarios autenticarse en el sistema.
 * Integra formulario de login y redirección post-autenticación.
 *
 * @component
 * @returns {JSX.Element} Página de login
 *
 * @example
 * <Route path="/login" element={<LoginPage />} />
 */
import Footer from '../../../components/layout/Footer.jsx';
import logo from '../../../assets/logo.webp';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';

export default function LoginPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#0e1a33] px-4 sm:px-6 md:px-8 py-6 overflow-hidden">
      {/* Marca de agua */}
      <img
        src={logo}
        alt="Marca de agua"
        className="absolute inset-0 mx-auto my-auto max-w-[80%] max-h-[80%] opacity-5 object-contain pointer-events-none"
      />

      <main className="flex-grow flex flex-col items-center justify-start z-10">
        <div className="mt-10 sm:mt-12 mb-4 sm:mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-white object-contain shadow"
          />
        </div>

        <div className="bg-white/90 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-[320px] sm:max-w-[380px] md:max-w-md text-center backdrop-blur-md">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 uppercase tracking-wide">
            Iniciar Sesión
          </h1>

          <LoginForm />

          <Link
            to="/recuperar"
            className="mt-4 inline-block text-xs sm:text-sm text-gray-400 italic hover:text-blue-600 transition"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </main>

      <footer className="z-10 mt-8">
        <Footer />
      </footer>
    </div>
  );
}
