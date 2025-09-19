import { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import InputField from './InputField.jsx';
import SubmitButton from './SubmitButton.jsx';

/**
 * Formulario de inicio de sesión.
 *
 * @param {Object} props
 * @param {Function} [props.onSubmit] - Callback para manejar el envío del formulario
 * @returns {JSX.Element}
 *
 * @example
 * <LoginForm onSubmit={handleLogin} />
 */

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5 text-left w-full"
    >
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
        label="Contraseña"
        name="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="text-sm sm:text-base"
      />

      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">
          {error}
        </p>
      )}

      <div className="pt-2 sm:pt-3">
        <SubmitButton
          text={loading ? 'Ingresando...' : 'Iniciar sesión'}
          disabled={loading}
          className="w-full text-sm sm:text-base py-2 sm:py-2.5"
        />
      </div>
    </form>
  );
}
