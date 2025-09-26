/**
 * Página de resultados de evaluaciones vocacionales.
 *
 * Muestra los resultados de los tests vocacionales realizados.
 * Integra visualización de resultados y recomendaciones.
 *
 * @component
 * @returns {JSX.Element} Página de resultados
 *
 * @example
 * <Route path="/test-vocacionales/resultados" element={<ResultadoEvaluacion />} />
 */
// src/features/evaluaciones/pages/ResultadoEvaluacionPage.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import FiltroEvaluacion from "../components/FiltroEvaluacion";
import TablaResultadosEvaluacion from "../components/TablaResultadosEvaluacion";
import BotonExportarPDF from "../../seguimiento/components/BotonExportarPDF";
import evaluacionService from "../services/evaluacionService";
import { toast } from "react-hot-toast";

export default function ResultadoEvaluacionPage() {
  const [resultados, setResultados] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    tipo: "",
    curso: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const res = await evaluacionService.getTodos();
        setResultados(res.data);
      } catch (err) {
        console.error("❌ Error al cargar resultados:", err);
        toast.error("Error al cargar los resultados de evaluaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, []);

  const resultadosFiltrados = resultados.filter((r) => {
    const nombreCompleto = `${r.nombre_completo || ""}`.toLowerCase();
    const coincideNombre = nombreCompleto.includes(filtros.nombre.toLowerCase());
    const coincideTipo = filtros.tipo ? r.tipo_evaluacion === filtros.tipo : true;
    const coincideCurso = filtros.curso ? r.curso === filtros.curso : true;
    return coincideNombre && coincideTipo && coincideCurso;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-8">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Resultados de Evaluaciones Vocacionales
          </h1>
          <BotonExportarPDF data={resultadosFiltrados} />
        </div>

        {/* Filtros */}
        <FiltroEvaluacion filtros={filtros} setFiltros={setFiltros} />

        {/* Tabla de resultados */}
        <TablaResultadosEvaluacion resultados={resultadosFiltrados} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
