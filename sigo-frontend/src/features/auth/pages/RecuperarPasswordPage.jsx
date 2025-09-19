/**
 * Página de recuperación de contraseña.
 *
 * Permite a los usuarios solicitar un código de recuperación.
 * Integra formulario de email y envío de código.
 *
 * @component
 * @returns {JSX.Element} Página de recuperación de contraseña
 *
 * @example
 * <Route path="/recuperar" element={<RecuperarPasswordPage />} />
 */
import Footer from '../../../components/layout/Footer.jsx';
import logo from '../../../assets/logo.png';
import { useState } from 'react';
import InputField from '../components/InputField.jsx';
import SubmitButton from '../components/SubmitButton.jsx';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../services/axios';

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('/auth/recuperar', { email });
      setSuccess('¡Código enviado! Revisa tu correo.');
      setTimeout(() => navigate('/verificar-codigo', { state: { email } }), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el código');
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
            Recuperar Contraseña
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
            {error && <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{error}</p>}
            {success && <p className="text-green-600 text-xs sm:text-sm mt-1 sm:mt-2">{success}</p>}
            <div className="pt-2 sm:pt-3">
              <SubmitButton
                text={loading ? 'Enviando...' : 'Enviar código'}
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