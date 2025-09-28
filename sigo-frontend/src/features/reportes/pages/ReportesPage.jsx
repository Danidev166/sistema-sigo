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
import { BarChart3 } from "lucide-react";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import { InstitutionalHeader } from "../../../components/headers/InstitutionalHeader";
import ReporteEstudiantesAtendidos from "../components/ReporteEstudiantesAtendidos";
import ReporteDerivaciones from "../components/ReporteDerivaciones";
import ReportesMejorados from "../components/ReportesMejorados";
import ReporteEntrevistas from "../components/ReporteEntrevistas";
import ReporteRiesgo from "../components/ReporteRiesgo";
import ReporteCitaciones from "../components/ReporteCitaciones";
import ReportePorCurso from "../components/ReportePorCurso";
import ReporteEstadisticas from "../components/ReporteEstadisticas";

const tabs = [
  { key: "mejorados", label: "Reportes Mejorados" },
  { key: "atendidos", label: "Estudiantes Atendidos" },
  { key: "derivaciones", label: "Derivaciones" },
  { key: "entrevistas", label: "Entrevistas y Seguimientos" },
  { key: "riesgo", label: "Situaciones de Riesgo" },
  { key: "citaciones", label: "Asistencia a Citaciones" },
  { key: "porCurso", label: "General por Curso" },
  { key: "estadisticas", label: "Estadísticas Globales" },
];

export default function ReportesPage() {
  const [activeTab, setActiveTab] = useState("mejorados");

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-2 sm:px-0 pb-6 sm:pb-8">
        <InstitutionalHeader
          title="Reportes"
          subtitle="Análisis y estadísticas de estudiantes y actividades"
          icon={BarChart3}
          variant="with-icon"
        />
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
          {activeTab === "mejorados" && (
            <ReportesMejorados />
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
            <ReporteEntrevistas />
          )}
          {activeTab === "riesgo" && (
            <ReporteRiesgo />
          )}
          {activeTab === "citaciones" && (
            <ReporteCitaciones />
          )}
          {activeTab === "porCurso" && (
            <ReportePorCurso />
          )}
          {activeTab === "estadisticas" && (
            <ReporteEstadisticas />
          )}
        </div>
      </div>
    </ImprovedDashboardLayout>
  );
}
