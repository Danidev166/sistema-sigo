/**
 * Componente generador de códigos QR para test vocacionales
 * 
 * Permite generar códigos QR que los estudiantes pueden escanear
 * para acceder directamente a los test desde sus dispositivos móviles
 * 
 * @component
 * @param {Object} props
 * @param {string} props.testType - Tipo de test (kuder, holland, aptitudes)
 * @param {Object} props.estudiante - Datos del estudiante
 * @param {Function} props.onClose - Función para cerrar el modal
 * @returns {JSX.Element}
 * 
 * @example
 * <QRGenerator 
 *   testType="kuder" 
 *   estudiante={{id: 1, nombre: "Juan", apellido: "Pérez"}}
 *   onClose={() => setShowQR(false)}
 * />
 */
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Download, Share, Smartphone, Mail, MessageCircle } from 'lucide-react';
import evaluacionesService from '../../../services/evaluacionesService';

const QRGenerator = ({ testType, estudiante, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos en segundos
  const [isExpired, setIsExpired] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // URLs base para cada tipo de test
  const testUrls = {
    kuder: '/test-mobile/kuder',
    holland: '/test-mobile/holland', 
    aptitudes: '/test-mobile/aptitudes'
  };

  useEffect(() => {
    generateQRCode();
  }, [testType, estudiante]);

  // Temporizador para cerrar automáticamente el modal
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Cerrar automáticamente cuando expire
  useEffect(() => {
    if (isExpired) {
      const closeTimer = setTimeout(() => {
        onClose();
      }, 2000); // 2 segundos después de expirar
      
      return () => clearTimeout(closeTimer);
    }
  }, [isExpired, onClose]);


  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError(null);

      // Crear URL con parámetros del estudiante
      const baseUrl = window.location.origin;
      let mobileUrl = baseUrl;
      
      // Si estamos en localhost (desarrollo), usar la IP de la red local
      if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        const port = window.location.port;
        // Usar la IP real de tu red local para desarrollo
        mobileUrl = `http://192.168.18.10:${port}`;
        
        console.log('📱 Modo desarrollo: usando IP local para acceso móvil');
        console.log('🔍 Encuentra tu IP con: ipconfig (Windows) o ifconfig (Mac/Linux)');
            } else {
              // En producción, usar la URL del servicio Docker
              mobileUrl = 'https://sigo-caupolican.onrender.com';
              console.log('🌐 Modo producción: usando URL del servicio Docker');
            }
      
      const testUrl = `${mobileUrl}${testUrls[testType]}`;
      
      // Parámetros para identificar al estudiante
      const params = new URLSearchParams({
        estudiante_id: estudiante.id,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        rut: estudiante.rut || '',
        curso: estudiante.curso || '',
        test_type: testType
      });

      const fullUrl = `${testUrl}?${params.toString()}`;
      
      console.log('🔗 URL generada:', fullUrl);
      console.log('📱 URL para móvil:', fullUrl);
      
      // Generar código QR
      const qrCodeDataURL = await QRCode.toDataURL(fullUrl, {
        width: 400,
        margin: 4,
        color: {
          dark: '#000000', // Negro puro para mejor compatibilidad
          light: '#ffffff'  // Blanco puro
        },
        errorCorrectionLevel: 'H', // Mayor corrección de errores
        type: 'image/png',
        quality: 1.0
      });

      setQrCodeUrl(qrCodeDataURL);
    } catch (err) {
      console.error('Error generando QR:', err);
      setError('Error al generar el código QR');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `QR_${testType}_${estudiante.nombre}_${estudiante.apellido}.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQR = () => {
    console.log('🔍 shareQR clicked:', { qrCodeUrl });
    if (!qrCodeUrl) {
      console.log('❌ No QR code URL available');
      return;
    }
    console.log('✅ Opening share modal');
    setShowShareModal(true);
  };

  const shareToWhatsApp = () => {
    console.log('📱 shareToWhatsApp clicked');
    const shareText = getShareText();
    const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    console.log('🔗 WhatsApp URL:', whatsappUrl);
    window.open(whatsappUrl, '_blank');
    setShowShareModal(false);
  };

  const shareToGmail = () => {
    console.log('📧 shareToGmail clicked');
    setShowEmailModal(true);
    setShowShareModal(false);
  };

  const enviarEmailReal = async () => {
    if (!email.trim()) {
      alert('Por favor ingresa un email válido');
      return;
    }

    setSendingEmail(true);
    try {
      const testUrl = getShareUrl();
      
      await evaluacionesService.enviarTestPorEmail({
        email: email.trim(),
        estudiante,
        testType,
        qrCodeUrl,
        testUrl
      });

      alert('✅ Test enviado por email correctamente');
      setShowEmailModal(false);
      setEmail('');
    } catch (error) {
      console.error('Error enviando email:', error);
      alert('❌ Error al enviar el email. Intenta de nuevo.');
    } finally {
      setSendingEmail(false);
    }
  };

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    let mobileUrl = baseUrl;
    
    // Si estamos en localhost (desarrollo), usar la IP de la red local
    if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
      const port = window.location.port;
      mobileUrl = `http://192.168.18.10:${port}`;
          } else {
            // En producción, usar la URL del servicio Docker
            mobileUrl = 'https://sigo-caupolican.onrender.com';
          }
    
    const testUrl = `${mobileUrl}/test-mobile/${testType}`;
    const params = new URLSearchParams({
      estudiante_id: estudiante.id,
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      rut: estudiante.rut || '',
      curso: estudiante.curso || '',
      test_type: testType
    });
    
    return `${testUrl}?${params.toString()}`;
  };

  const getShareText = () => {
    const shareUrl = getShareUrl();
    
    return `📱 Test Vocacional - ${getTestInfo()}

👤 Estudiante: ${estudiante.nombre} ${estudiante.apellido}
${estudiante.curso ? `📚 Curso: ${estudiante.curso}` : ''}

🔗 Accede al test desde tu móvil:
${shareUrl}

⏰ Este enlace es temporal y expira en ${formatTime(timeLeft)}.

📋 Instrucciones:
1. Abre el enlace en tu celular
2. Completa el test
3. Los resultados se guardarán automáticamente

#SIGO #TestVocacional #${testType.toUpperCase()}`;
  };

  const getTestInfo = () => {
    const testNames = {
      kuder: 'Test de Kuder',
      holland: 'Test de Holland (RIASEC)',
      aptitudes: 'Test de Aptitudes'
    };
    return testNames[testType] || 'Test Vocacional';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    onClose();
  };


  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Generando código QR
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Preparando el acceso móvil para {estudiante.nombre} {estudiante.apellido}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {getTestInfo()}
                </h2>
                <p className="text-blue-100 text-sm">Código QR Temporal</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                Error al generar QR
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={generateQRCode}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Reintentar
              </button>
            </div>
          ) : isExpired ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <X className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                QR Expirado
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Este código QR ha expirado. El modal se cerrará automáticamente.
              </p>
            </div>
          ) : (
            <>
              {/* Temporizador */}
              <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                  timeLeft <= 60 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 animate-pulse'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    timeLeft <= 60 ? 'bg-red-500 animate-ping' : 'bg-blue-500'
                  }`}></div>
                  Expira en: {formatTime(timeLeft)}
                </div>
              </div>

              {/* Información del estudiante */}
              <div className="text-center bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                    {estudiante.nombre?.charAt(0)}{estudiante.apellido?.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {estudiante.nombre} {estudiante.apellido}
                </h3>
                {estudiante.curso && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {estudiante.curso}
                  </p>
                )}
              </div>

              {/* Código QR */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="p-6 bg-white dark:bg-white rounded-2xl shadow-lg border border-gray-200 dark:border-gray-300">
                    <img 
                      src={qrCodeUrl} 
                      alt="Código QR" 
                      className="w-56 h-56"
                    />
                  </div>
                  {/* Decoración */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                    <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                    Instrucciones para el estudiante
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                    <span>Abre la cámara de tu celular</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                    <span>Apunta al código QR</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                    <span>Toca la notificación que aparece</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                    <span>Completa el test en tu dispositivo</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start">
                    <div className="text-amber-600 dark:text-amber-400 mr-2 mt-0.5">⚠️</div>
                    <div className="text-xs text-amber-800 dark:text-amber-200">
                      <strong>Importante:</strong> Este QR es temporal y expira en {formatTime(timeLeft)}. 
                      Una vez usado, no podrá ser reutilizado.
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3 pt-2">
                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <button
                      onClick={shareQR}
                      disabled={isExpired}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isExpired 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:scale-105 active:scale-95'
                      }`}
                    >
                      <Share className="h-4 w-4" />
                      <span>Compartir</span>
                    </button>
                    
                  </div>
                  
                  <button
                    onClick={downloadQR}
                    disabled={isExpired}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isExpired 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 hover:shadow-lg transform hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    <span>Descargar QR</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de compartir - Pantalla completa */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Compartir Test</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-blue-100 mt-2">
                Comparte el test con {estudiante.nombre} {estudiante.apellido}
              </p>
            </div>

            {/* Contenido */}
            <div className="p-6 pb-8">
              {/* URL a compartir */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enlace del test:
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 text-gray-600 dark:text-gray-400 text-sm truncate">
                    {getShareUrl()}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getShareUrl());
                      alert('URL copiada al portapapeles');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Opciones de compartir */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Elige cómo compartir:
                </h4>
                
                <div className="flex justify-center space-x-8">
                  {/* WhatsApp */}
                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center space-y-4 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group min-w-[140px]"
                  >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors shadow-lg">
                      <MessageCircle className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white text-lg">WhatsApp</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Mensaje directo</div>
                    </div>
                  </button>
                  
                  {/* Gmail */}
                  <button
                    onClick={shareToGmail}
                    className="flex flex-col items-center space-y-4 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group min-w-[140px]"
                  >
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors shadow-lg">
                      <Mail className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900 dark:text-white text-lg">Gmail</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Correo electrónico</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para enviar email */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📧 Enviar Test por Email
              </h3>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmail('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email del estudiante:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={sendingEmail}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>👤 Estudiante:</strong> {estudiante.nombre} {estudiante.apellido}<br/>
                  <strong>🧪 Test:</strong> {getTestInfo()}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={enviarEmailReal}
                  disabled={sendingEmail || !email.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    '📧 Enviar Email'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmail('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
