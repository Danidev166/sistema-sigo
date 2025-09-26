/**
 * Página de gestión de alertas.
 *
 * Permite visualizar, crear, editar y eliminar alertas del sistema.
 * Integra tabla y modales para formularios y confirmaciones.
 *
 * @component
 * @returns {JSX.Element} Página de alertas
 *
 * @example
 * <Route path="/alertas" element={<AlertasPage />} />
 */
import { useEffect, useState } from "react";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import alertaService from "../services/alertaService";
import { toast } from "react-hot-toast";
import AlertaTable from "../components/AlertaTable";

export default function AlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarAlertas = async () => {
    try {
      const res = await alertaService.getAlertas();
      setAlertas(res.data);
    } catch (err) {
      console.error("❌ Error al cargar alertas:", err);
      toast.error("Error al cargar alertas.");
    }
  };

  const handleGenerar = async () => {
    try {
      setLoading(true);
      await alertaService.generarAlertas();
      toast.success("Alertas generadas.");
      await cargarAlertas();
    } catch (err) {
      console.error("❌ Error al generar alertas:", err);
      toast.error("Error al generar alertas.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarResuelta = async (alerta) => {
    try {
      await alertaService.cambiarEstado(alerta.id, "Resuelta");
      toast.success(`Alerta marcada como Resuelta (estudiante: ${alerta.nombre} ${alerta.apellido})`);
      await cargarAlertas();
    } catch (err) {
      console.error("❌ Error al cambiar estado:", err);
      toast.error("Error al cambiar estado.");
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, []);

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-6 px-4 sm:px-6 md:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            Gestión de Alertas
          </h1>

          <button
            onClick={handleGenerar}
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generando...
              </>
            ) : (
              "Regenerar Alertas"
            )}
          </button>
        </div>

        <AlertaTable
          alertas={alertas}
          onMarcarResuelta={handleMarcarResuelta}
        />
      </div>
    </ImprovedDashboardLayout>
  );
}
