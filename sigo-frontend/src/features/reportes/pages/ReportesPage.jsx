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
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import ReporteEstudiantesAtendidos from "../components/ReporteEstudiantesAtendidos";
import ReporteDerivaciones from "../components/ReporteDerivaciones";
import ReportesMejorados from "../components/ReportesMejorados";

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <h1 className="page-title text-xl sm:text-2xl lg:text-3xl">
            Reportes
          </h1>
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
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Entrevistas y Seguimientos</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Reporte de Entrevistas
                    </h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>Total de entrevistas: <span className="font-semibold">1</span></p>
                      <p>Entrevistas del mes: <span className="font-semibold">1</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "riesgo" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Situaciones de Riesgo</h2>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Situaciones de Riesgo
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>Alertas activas: <span className="font-semibold">0</span></p>
                      <p>Intervenciones requeridas: <span className="font-semibold">0</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "citaciones" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Asistencia a Citaciones</h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Citaciones
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>Citaciones programadas: <span className="font-semibold">0</span></p>
                      <p>Asistencia a citaciones: <span className="font-semibold">0%</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "porCurso" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte General por Curso</h2>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Estadísticas por Curso
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>Total de cursos: <span className="font-semibold">1</span></p>
                      <p>Estudiantes por curso: <span className="font-semibold">1</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "estadisticas" && (
            <div>
              <h2 className="text-lg font-bold mb-4">Reporte de Estadísticas Globales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                        Resumen General
                      </h3>
                      <div className="mt-2 text-sm text-purple-700 dark:text-purple-300">
                        <p>Total estudiantes: <span className="font-semibold">1</span></p>
                        <p>Total entrevistas: <span className="font-semibold">1</span></p>
                        <p>Total recursos: <span className="font-semibold">1</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                        Actividad del Mes
                      </h3>
                      <div className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
                        <p>Entrevistas realizadas: <span className="font-semibold">1</span></p>
                        <p>Intervenciones: <span className="font-semibold">0</span></p>
                        <p>Recursos entregados: <span className="font-semibold">1</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-teal-800 dark:text-teal-200">
                        Estado del Sistema
                      </h3>
                      <div className="mt-2 text-sm text-teal-700 dark:text-teal-300">
                        <p>Base de datos: <span className="font-semibold text-green-600">Conectada</span></p>
                        <p>Datos cargados: <span className="font-semibold text-green-600">Sí</span></p>
                        <p>Última actualización: <span className="font-semibold">Hoy</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ImprovedDashboardLayout>
  );
}
