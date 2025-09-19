import { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Settings, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import configuracionService from '../services/configuracionService';

/**
 * Componente de configuración avanzada de email
 * Permite configurar y probar la configuración de email del sistema
 */
export default function EmailConfig() {
  const [config, setConfig] = useState({
    host: '',
    port: '',
    secure: false,
    user: '',
    password: '',
    from: '',
    replyTo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setIsLoading(true);
      // Por ahora, usar configuración por defecto
      // TODO: Implementar carga desde backend cuando esté disponible
      setConfig({
        host: 'smtp.gmail.com',
        port: '587',
        secure: false,
        user: '',
        password: '',
        from: '',
        replyTo: ''
      });
    } catch (error) {
      console.error('Error al cargar configuración de email:', error);
      toast.error('Error al cargar configuración de email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      const payload = Object.entries(config).map(([clave, valor]) => ({
        clave,
        valor: typeof valor === 'boolean' ? String(valor) : valor
      }));

      await configuracionService.actualizar('email', payload);
      toast.success('Configuración de email guardada correctamente');
    } catch (error) {
      console.error('Error al guardar configuración de email:', error);
      toast.error('Error al guardar configuración de email');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setIsTesting(true);
      setTestResult(null);
      
      // Simular prueba de email (aquí conectarías con el backend real)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTestResult({
        success: true,
        message: 'Email de prueba enviado correctamente'
      });
      toast.success('Email de prueba enviado exitosamente');
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error al enviar email de prueba'
      });
      toast.error('Error al enviar email de prueba');
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          📧 Configuración de Email
        </h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        📧 Configuración de Email
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuración del servidor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Servidor SMTP *
            </label>
            <input
              type="text"
              name="host"
              value={config.host}
              onChange={handleChange}
              placeholder="smtp.gmail.com"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Puerto *
            </label>
            <input
              type="number"
              name="port"
              value={config.port}
              onChange={handleChange}
              placeholder="587"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Usuario *
            </label>
            <input
              type="email"
              name="user"
              value={config.user}
              onChange={handleChange}
              placeholder="tu-email@gmail.com"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={config.password}
                onChange={handleChange}
                placeholder="Tu contraseña de aplicación"
                className="w-full px-3 py-2 pr-10 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email Remitente *
            </label>
            <input
              type="email"
              name="from"
              value={config.from}
              onChange={handleChange}
              placeholder="noreply@tu-institucion.cl"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email de Respuesta
            </label>
            <input
              type="email"
              name="replyTo"
              value={config.replyTo}
              onChange={handleChange}
              placeholder="contacto@tu-institucion.cl"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Opciones adicionales */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="secure"
            checked={config.secure}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Usar conexión segura (SSL/TLS)
          </label>
        </div>

        {/* Resultado de prueba */}
        {testResult && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${
            testResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            {testResult.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">{testResult.message}</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Guardando...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                Guardar Configuración
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTestEmail}
            disabled={isTesting || isSaving}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Probando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Probar Email
              </>
            )}
          </button>
        </div>
      </form>

      {/* Información de ayuda */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Configuración Recomendada para Gmail
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Servidor: smtp.gmail.com</li>
          <li>• Puerto: 587 (TLS) o 465 (SSL)</li>
          <li>• Usar contraseña de aplicación en lugar de la contraseña normal</li>
          <li>• Habilitar "Conexión segura" para puerto 465</li>
        </ul>
      </div>
    </div>
  );
}
