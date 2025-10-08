/**
 * Página de evaluaciones vocacionales.
 *
 * Permite acceder a diferentes tipos de tests vocacionales.
 * Integra navegación a tests específicos.
 *
 * @component
 * @returns {JSX.Element} Página de evaluaciones vocacionales
 *
 * @example
 * <Route path="/test-vocacionales" element={<EvaluacionesVocacionalesPage />} />
 */
// src/features/test-vocacionales/pages/EvaluacionesVocacionalesPage.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import { InstitutionalHeader } from "../../../components/headers/InstitutionalHeader";
import Button from "../../../components/ui/Button";
import QRGenerator from "../components/QRGenerator";
import SimpleQRScanner from "../components/SimpleQRScanner";
import EstudianteSelector from "../components/EstudianteSelector";
import { QrCode, Smartphone, Users, FileText, User } from "lucide-react";
import api from "../../../services/axios";

export default function EvaluacionesVocacionalesPage() {
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showEstudianteSelector, setShowEstudianteSelector] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  // Simplificar: siempre permitir generar QR
  const [hasEstudiantes, setHasEstudiantes] = useState(true);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);

  const handleGenerateQR = (testType) => {
    setSelectedTest(testType);
    setShowEstudianteSelector(true);
  };

  const handleEstudianteSelect = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setShowEstudianteSelector(false);
    setShowQRGenerator(true);
  };

  const handleScanQR = (data) => {
    console.log('QR escaneado:', data);
    // Redirigir al test móvil
    window.location.href = data.url;
  };

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-8 pb-10">
        <InstitutionalHeader
          title="Evaluaciones Vocacionales"
          subtitle="Tests vocacionales para orientación estudiantil"
          icon={FileText}
          variant="with-icon"
          actions={[
            {
              label: "Escanear QR",
              icon: QrCode,
              onClick: () => setShowQRScanner(true),
              variant: "secondary"
            }
          ]}
        />

        {/* Información sobre QR */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Smartphone className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                🚀 Nueva Funcionalidad: Test Vocacionales con QR
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Los estudiantes ahora pueden acceder a los test desde sus dispositivos móviles 
                escaneando un código QR. Esto hace el proceso más moderno y accesible.
              </p>
            </div>
          </div>
        </div>


        {/* Tarjetas de Test */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <CardLink 
            to="/evaluaciones/kuder" 
            emoji="🧩" 
            titulo="Test de Kuder"
            onGenerateQR={() => handleGenerateQR('kuder')}
            hasEstudiantes={hasEstudiantes}
            loadingEstudiantes={loadingEstudiantes}
          />
          <CardLink 
            to="/evaluaciones/holland" 
            emoji="🧠" 
            titulo="Test de Holland"
            onGenerateQR={() => handleGenerateQR('holland')}
            hasEstudiantes={hasEstudiantes}
            loadingEstudiantes={loadingEstudiantes}
          />
          <CardLink 
            to="/evaluaciones/aptitudes" 
            emoji="📊" 
            titulo="Test de Aptitudes"
            onGenerateQR={() => handleGenerateQR('aptitudes')}
            hasEstudiantes={hasEstudiantes}
            loadingEstudiantes={loadingEstudiantes}
          />
        </div>
      </div>

      {/* Modales */}
      {showQRGenerator && (
        <QRGenerator
          testType={selectedTest}
          estudiante={estudianteSeleccionado}
          onClose={() => {
            setShowQRGenerator(false);
            setSelectedTest(null);
            setEstudianteSeleccionado(null);
          }}
        />
      )}

      {showQRScanner && (
        <SimpleQRScanner
          onScan={handleScanQR}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {showEstudianteSelector && (
        <EstudianteSelector
          onSelect={handleEstudianteSelect}
          onClose={() => setShowEstudianteSelector(false)}
        />
      )}
    </ImprovedDashboardLayout>
  );
}

function CardLink({ to, emoji, titulo, onGenerateQR, hasEstudiantes, loadingEstudiantes }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow hover:shadow-lg border border-gray-200 dark:border-slate-700 transition transform hover:scale-[1.01]">
      <div className="text-center mb-4">
        <div className="text-5xl mb-3">{emoji}</div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{titulo}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Iniciar y registrar respuestas del test.
        </p>
      </div>
      
      <div className="space-y-3">
        <Link
          to={to}
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
        >
          Acceder al Test
        </Link>
        
        <button
          onClick={onGenerateQR}
          className="w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
        >
          <QrCode className="h-4 w-4" />
          <span>Generar QR</span>
        </button>
      </div>
    </div>
  );
}
