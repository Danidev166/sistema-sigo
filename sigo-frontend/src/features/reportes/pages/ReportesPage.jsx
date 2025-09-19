/**
 * Página de reportes y estadísticas del sistema.
 *
 * Permite visualizar reportes de estudiantes, recursos y estadísticas generales.
 * Integra gráficos y exportación de datos.
 *
 * @component
 * @returns {JSX.Element} Página de reportes
 *
 * @example
 * <Route path="/reportes" element={<ReportesPage />} />
 */
// src/features/reportes/pages/ReportesPage.jsx
import { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import ReporteEstudiantesAtendidos from "../components/ReporteEstudiantesAtendidos";
import ReporteDerivaciones from "../components/ReporteDerivaciones";
import GeneradorReportes from "../components/GeneradorReportes";

const tabs = [
  { key: "generador", label: "Generador de Reportes" },
  { key: "atendidos", label: "Estudiantes Atendidos" },
  { key: "derivaciones", label: "Derivaciones" },
  { key: "entrevistas", label: "Entrevistas y Seguimientos" },
  { key: "riesgo", label: "Situaciones de Riesgo" },
  { key: "citaciones", label: "Asistencia a Citaciones" },
  { key: "porCurso", label: "General por Curso" },
  { key: "estadisticas", label: "Estadísticas Globales" },
];

export default function ReportesPage() {
  const [activeTab, setActiveTab] = useState("generador");

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 px-2 sm:px-0 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-white pt-2 sm:pt-0">
            Reportes
          </h1>
          <button
            onClick={() => window.location.href = '/reportes/plantillas'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Gestionar Plantillas
          </button>
        </div>
        <div className="border-b border-gray-200 dark:border-slate-700 mb-4">
          <nav className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-t-md text-sm font-medium transition
                  ${activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 min-h-[300px]">
          {activeTab === "generador" && (
            <GeneradorReportes />
          )}
          {activeTab === "atendidos" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Estudiantes Atendidos</h2>
              <ReporteEstudiantesAtendidos />
            </div>
          )}
          {activeTab === "derivaciones" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Derivaciones</h2>
              <ReporteDerivaciones />
            </div>
          )}
          {activeTab === "entrevistas" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Entrevistas y Seguimientos</h2>
              <p className="text-gray-600 dark:text-gray-300">Aquí irá el reporte de entrevistas y seguimientos.</p>
            </div>
          )}
          {activeTab === "riesgo" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Situaciones de Riesgo</h2>
              <p className="text-gray-600 dark:text-gray-300">Aquí irá el reporte de situaciones de riesgo.</p>
            </div>
          )}
          {activeTab === "citaciones" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Asistencia a Citaciones</h2>
              <p className="text-gray-600 dark:text-gray-300">Aquí irá el reporte de asistencia a citaciones.</p>
            </div>
          )}
          {activeTab === "porCurso" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte General por Curso</h2>
              <p className="text-gray-600 dark:text-gray-300">Aquí irá el reporte general por curso.</p>
            </div>
          )}
          {activeTab === "estadisticas" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Estadísticas Globales</h2>
              <p className="text-gray-600 dark:text-gray-300">Aquí irá el reporte de estadísticas globales.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
