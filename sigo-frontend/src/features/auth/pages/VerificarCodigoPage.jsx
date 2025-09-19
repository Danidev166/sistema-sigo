/**
 * Página de verificación de código de recuperación.
 *
 * Permite a los usuarios verificar el código y establecer nueva contraseña.
 * Integra formulario de código y nueva contraseña.
 *
 * @component
 * @returns {JSX.Element} Página de verificación de código
 *
 * @example
 * <Route path="/verificar-codigo" element={<VerificarCodigoPage />} />
 */
import Footer from '../../../components/layout/Footer.jsx';
import logo from '../../../assets/logo.png';
import { useState } from 'react';
import InputField from '../components/InputField.jsx';
import SubmitButton from '../components/SubmitButton.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../services/axios';

export default function VerificarCodigoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('/auth/verificar-codigo', { email, codigo, password });
      setSuccess('¡Contraseña cambiada con éxito!');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0e1a33] px-4 sm:px-6 md:px-8 py-6 overflow-hidden">
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
            Verificar Código
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left w-full">
            <InputField
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="ejemplo@liceo.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm sm:text-base"
            />
            <InputField
              label="Código de verificación"
              name="codigo"
              type="text"
              placeholder="6 dígitos"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              className="text-sm sm:text-base"
              maxLength={6}
            />
            <InputField
              label="Nueva contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-sm sm:text-base"
            />
            {error && <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{error}</p>}
            {success && <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">{success}</p>}
            <div className="pt-2 sm:pt-3">
              <SubmitButton
                text={loading ? 'Cambiando...' : 'Cambiar contraseña'}
                disabled={loading}
                className="w-full text-sm sm:text-base py-2 sm:py-2.5"
              />
            </div>
          </form>
          <Link
            to="/login"
            className="mt-4 inline-block text-xs sm:text-sm text-gray-400 italic hover:text-blue-600 transition"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </main>
      <footer className="z-10 mt-8">
        <Footer />
      </footer>
    </div>
  );
} 