/**
 * Página de gestión de movimientos de inventario.
 *
 * Permite visualizar y gestionar movimientos de stock de recursos.
 * Integra tabla, filtros y modales para formularios.
 *
 * @component
 * @returns {JSX.Element} Página de movimientos
 *
 * @example
 * <Route path="/movimientos" element={<MovimientosPage />} />
 */
// src/features/recursos/pages/MovimientosPage.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Button from "../../../components/ui/Button";
import { Plus } from "lucide-react";
import movimientoService from "../services/movimientoService";
import MovimientoFormModal from "../components/MovimientoFormModal";
import MovimientoTable from "../components/MovimientoTable";
import FiltroMovimientos from "../components/FiltroMovimientos";
import ExportarMovimientosPDF from "../components/ExportarMovimientosPDF";
import { toast } from "react-toastify";

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtros, setFiltros] = useState({
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

  const fetchMovimientos = async () => {
    try {
      setIsLoading(true);
      const res = await movimientoService.getMovimientos();
      setMovimientos(res.data);
    } catch (err) {
      toast.error("Error al cargar movimientos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const handleSubmit = async (data) => {
    try {
      await movimientoService.registrarMovimiento(data);
      toast.success("Movimiento registrado correctamente");
      setIsModalOpen(false);
      fetchMovimientos();
    } catch (err) {
      toast.error("Error al registrar movimiento");
      console.error(err);
    }
  };

  const movimientosFiltrados = movimientos.filter((mov) => {
    const cumpleTipo = !filtros.tipo || mov.tipo_movimiento === filtros.tipo;
    const fecha = new Date(mov.fecha);
    const desde = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
    const hasta = filtros.fechaFin ? new Date(filtros.fechaFin) : null;
    const cumpleFecha =
      (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    return cumpleTipo && cumpleFecha;
  });

  const totalPaginas = Math.ceil(movimientosFiltrados.length / elementosPorPagina);
  const movimientosPaginados = movimientosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) {
      setPaginaActual(nueva);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            Movimientos de Recursos
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ExportarMovimientosPDF movimientos={movimientosFiltrados} />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Registrar Movimiento
            </Button>
          </div>
        </div>

        <FiltroMovimientos
          filtros={filtros}
          setFiltros={(nuevos) => {
            setFiltros(nuevos);
            setPaginaActual(1); // reset paginación al aplicar filtros
          }}
        />

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <MovimientoTable movimientos={movimientosPaginados} />

            {totalPaginas > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm text-gray-700 dark:text-gray-300">
                <span>
                  Página {paginaActual} de {totalPaginas}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="px-3 py-1 rounded border bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-sm hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-40"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="px-3 py-1 rounded border bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-sm hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-40"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <MovimientoFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}
