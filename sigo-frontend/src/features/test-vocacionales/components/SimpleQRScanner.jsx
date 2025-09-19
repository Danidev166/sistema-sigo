/**
 * Componente escáner de códigos QR simple
 * 
 * Versión simplificada que no depende de librerías externas
 * Usa entrada manual de URL o instrucciones para escanear
 * 
 * @component
 * @param {Function} props.onScan - Callback cuando se escanea un QR válido
 * @param {Function} props.onClose - Función para cerrar el escáner
 * @returns {JSX.Element}
 */
import { useState } from 'react';
import { X, QrCode, Smartphone, Camera, AlertCircle } from 'lucide-react';

const SimpleQRScanner = ({ onScan, onClose }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  const handleScan = () => {
    if (!url.trim()) {
      setError('Por favor ingresa una URL válida');
      return;
    }

    try {
      // Verificar si es una URL válida de test vocacional
      const urlObj = new URL(url);
      const isTestUrl = urlObj.pathname.includes('/test-mobile/');
      
      if (isTestUrl) {
        // Extraer parámetros de la URL
        const params = new URLSearchParams(urlObj.search);
        const testData = {
          testType: urlObj.pathname.split('/test-mobile/')[1],
          estudiante_id: params.get('estudiante_id'),
          nombre: params.get('nombre'),
          apellido: params.get('apellido'),
          rut: params.get('rut'),
          curso: params.get('curso'),
          url: url
        };

        onScan(testData);
      } else {
        setError('Esta URL no es válida para test vocacionales');
      }
    } catch (err) {
      console.error('Error procesando URL:', err);
      setError('URL inválida. Asegúrate de que sea una URL completa (ej: https://...)');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <QrCode className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Escanear Código QR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instrucciones */}
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <div className="text-center">
                <Camera className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Escanea con tu cámara
                </p>
              </div>
              <div className="text-center">
                <Smartphone className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  O ingresa manualmente
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                📱 Instrucciones:
              </h3>
              <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
                <li>1. Abre la cámara de tu celular</li>
                <li>2. Apunta al código QR del test</li>
                <li>3. Toca la notificación que aparece</li>
                <li>4. O copia la URL y pégala abajo</li>
              </ol>
            </div>
          </div>

          {/* Entrada manual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL del Test Vocacional:
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://tu-sitio.com/test-mobile/kuder?estudiante_id=1..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              onClick={handleScan}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Acceder al Test
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* Ejemplo de URL */}
          <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Ejemplo de URL válida:
            </p>
            <code className="text-xs text-blue-600 dark:text-blue-400 break-all">
              http://192.168.18.10:5173/test-mobile/kuder?estudiante_id=1&nombre=Juan&apellido=Pérez&rut=12345678-9&curso=4°%20Medio%20A&test_type=kuder
            </code>
            <button
              onClick={() => setUrl('http://192.168.18.10:5173/test-mobile/kuder?estudiante_id=1&nombre=Juan&apellido=Pérez&rut=12345678-9&curso=4°%20Medio%20A&test_type=kuder')}
              className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Usar esta URL de ejemplo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleQRScanner;
