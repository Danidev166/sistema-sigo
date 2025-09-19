/**
 * Componente escáner de códigos QR
 * 
 * Permite escanear códigos QR para acceder directamente a test vocacionales
 * desde dispositivos móviles usando la API nativa del navegador
 * 
 * @component
 * @param {Function} props.onScan - Callback cuando se escanea un QR válido
 * @param {Function} props.onClose - Función para cerrar el escáner
 * @returns {JSX.Element}
 * 
 * @example
 * <QRScanner 
 *   onScan={(data) => console.log('QR escaneado:', data)}
 *   onClose={() => setShowScanner(false)}
 * />
 */
import { useState, useRef, useEffect } from 'react';
import { X, Camera, AlertCircle, Smartphone } from 'lucide-react';

const QRScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Cámara trasera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const handleManualInput = () => {
    const url = prompt('Ingresa la URL del código QR:');
    if (url) {
      handleScan(url);
    }
  };

  const handleScan = (result) => {
    try {
      // Verificar si es una URL válida de test vocacional
      const url = new URL(result);
      const isTestUrl = url.pathname.includes('/test-mobile/');
      
      if (isTestUrl) {
        // Extraer parámetros de la URL
        const params = new URLSearchParams(url.search);
        const testData = {
          testType: url.pathname.split('/test-mobile/')[1],
          estudiante_id: params.get('estudiante_id'),
          nombre: params.get('nombre'),
          apellido: params.get('apellido'),
          rut: params.get('rut'),
          curso: params.get('curso'),
          url: result
        };

        stopCamera();
        onScan(testData);
      } else {
        setError('Este código QR no es válido para test vocacionales');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error procesando QR:', err);
      setError('Código QR inválido');
      setTimeout(() => setError(null), 3000);
    }
  };

  const retryCamera = () => {
    stopCamera();
    setTimeout(startCamera, 500);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Camera className="h-6 w-6 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Escanear Código QR
          </h2>
        </div>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative">
        {scanning ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Cámara no disponible</p>
              <p className="text-sm opacity-75">Usa el botón de entrada manual</p>
            </div>
          </div>
        )}
        
        {/* Overlay con marco de escaneo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-4 border-blue-500 rounded-lg relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded-lg text-center">
            <p className="text-sm mb-2">
              Apunta la cámara al código QR del test vocacional
            </p>
            <p className="text-xs opacity-75">
              O usa el botón de entrada manual si no tienes cámara
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="bg-white dark:bg-slate-800 p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex space-x-3">
          <button
            onClick={handleManualInput}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <Smartphone className="h-4 w-4" />
            <span>Entrada Manual</span>
          </button>
          {error && (
            <button
              onClick={retryCamera}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-sm mx-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-800 dark:text-white mb-4">{error}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setError(null)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Continuar
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;