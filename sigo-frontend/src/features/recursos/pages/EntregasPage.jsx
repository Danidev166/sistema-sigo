/**
 * Página de gestión de entregas de recursos.
 *
 * Permite visualizar, crear y gestionar entregas de recursos a estudiantes.
 * Integra tabla, filtros y modales para formularios.
 *
 * @component
 * @returns {JSX.Element} Página de entregas
 *
 * @example
 * <Route path="/entregas" element={<EntregasPage />} />
 */
import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import recursoService from "../services/recursoService";
import EntregaTable from "../components/EntregaTable";
import FiltroEntregas from "../components/FiltroEntregas";
import ExportarEntregasPDF from "../components/ExportarEntregasPDF";
import { toast } from "react-toastify";

export default function EntregasPage() {
  const [entregas, setEntregas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    estudiante: "",
    recurso: "",
    fecha: "",
    estado: "",
  });

  const fetchEntregas = async () => {
    try {
      setIsLoading(true);
      const res = await recursoService.getEntregas();
      setEntregas(res.data || []);
    } catch (err) {
      toast.error("Error al cargar entregas");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntregas();
  }, []);

  const filteredEntregas = entregas.filter((entrega) => {
    return (
      (!filtros.estudiante ||
        entrega.nombre_estudiante?.toLowerCase().includes(filtros.estudiante.toLowerCase())) &&
      (!filtros.recurso ||
        entrega.recurso?.toLowerCase().includes(filtros.recurso.toLowerCase())) &&
      (!filtros.fecha || entrega.fecha_entrega === filtros.fecha) &&
      (!filtros.estado || entrega.estado === filtros.estado)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            Historial de Entregas
          </h1>
          <ExportarEntregasPDF entregas={filteredEntregas} />
        </div>

        {/* Filtro */}
        <FiltroEntregas onFilter={setFiltros} />

        {/* Tabla */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <EntregaTable entregas={filteredEntregas} />
        )}
      </div>
    </DashboardLayout>
  );
}
