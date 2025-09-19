import { useState } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Settings, 
  Mail,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Componente de herramientas de administración
 * Proporciona herramientas útiles para administradores del sistema
 */
export default function AdminTools() {
  const [loading, setLoading] = useState({});

  const handleAction = async (action, actionName) => {
    setLoading(prev => ({ ...prev, [action]: true }));
    
    try {
      // Simular acción (aquí conectarías con el backend real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${actionName} completado exitosamente`);
    } catch (error) {
      toast.error(`Error al ${actionName.toLowerCase()}`);
    } finally {
      setLoading(prev => ({ ...prev, [action]: false }));
    }
  };

  const tools = [
    {
      id: 'backup',
      title: 'Respaldo de Datos',
      description: 'Crear respaldo completo de la base de datos',
      icon: Download,
      color: 'text-blue-600 bg-blue-100',
      action: () => handleAction('backup', 'Respaldo creado')
    },
    {
      id: 'restore',
      title: 'Restaurar Datos',
      description: 'Restaurar desde un respaldo anterior',
      icon: Upload,
      color: 'text-green-600 bg-green-100',
      action: () => handleAction('restore', 'Datos restaurados')
    },
    {
      id: 'cleanup',
      title: 'Limpieza de Datos',
      description: 'Eliminar datos temporales y optimizar sistema',
      icon: Trash2,
      color: 'text-orange-600 bg-orange-100',
      action: () => handleAction('cleanup', 'Limpieza completada')
    },
    {
      id: 'refresh',
      title: 'Actualizar Cache',
      description: 'Limpiar y actualizar caché del sistema',
      icon: RefreshCw,
      color: 'text-purple-600 bg-purple-100',
      action: () => handleAction('refresh', 'Cache actualizado')
    },
    {
      id: 'email-test',
      title: 'Probar Email',
      description: 'Enviar email de prueba para verificar configuración',
      icon: Mail,
      color: 'text-indigo-600 bg-indigo-100',
      action: () => handleAction('email-test', 'Email de prueba enviado')
    },
    {
      id: 'db-optimize',
      title: 'Optimizar BD',
      description: 'Optimizar índices y rendimiento de base de datos',
      icon: Database,
      color: 'text-pink-600 bg-pink-100',
      action: () => handleAction('db-optimize', 'Base de datos optimizada')
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        🔧 Herramientas de Administración
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${tool.color}`}>
                <tool.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {tool.description}
                </p>
                <button
                  onClick={tool.action}
                  disabled={loading[tool.id]}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading[tool.id] ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Procesando...
                    </>
                  ) : (
                    'Ejecutar'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advertencias importantes */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              ⚠️ Advertencias Importantes
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Las operaciones de respaldo y restauración pueden tomar varios minutos</li>
              <li>• La limpieza de datos eliminará archivos temporales de forma permanente</li>
              <li>• Se recomienda crear un respaldo antes de realizar operaciones críticas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

