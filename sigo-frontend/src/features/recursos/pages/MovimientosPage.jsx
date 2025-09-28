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
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import Button from "../../../components/ui/Button";
import { Plus } from "lucide-react";
import movimientoService from "../services/movimientoService";
import MovimientoFormModal from "../components/MovimientoFormModal";
import EditarMovimientoModal from "../components/EditarMovimientoModal";
import MovimientoTable from "../components/MovimientoTable";
import FiltroMovimientos from "../components/FiltroMovimientos";
import ExportarMovimientosPDF from "../components/ExportarMovimientosPDF";
import { toast } from "react-hot-toast";

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [movimientoAEditar, setMovimientoAEditar] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: "",
    fechaInicio: "",
    fechaFin: "",
    recurso: "",
    estudiante: "",
    curso: "",
    responsable: "",
    busqueda: ""
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

  const handleEdit = (movimiento) => {
    setMovimientoAEditar(movimiento);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data) => {
    try {
      await movimientoService.actualizarMovimiento(movimientoAEditar.id, data);
      toast.success("Movimiento actualizado correctamente");
      setIsEditModalOpen(false);
      setMovimientoAEditar(null);
      fetchMovimientos();
    } catch (err) {
      toast.error("Error al actualizar movimiento");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await movimientoService.eliminarMovimiento(id);
      toast.success("Movimiento eliminado correctamente");
      fetchMovimientos();
    } catch (err) {
      toast.error("Error al eliminar movimiento");
      console.error(err);
    }
  };


  const movimientosFiltrados = movimientos.filter((mov) => {
    // Filtro por tipo de movimiento
    const cumpleTipo = !filtros.tipo || mov.tipo_movimiento === filtros.tipo;
    
    // Filtro por fechas
    const fecha = new Date(mov.fecha);
    const desde = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
    const hasta = filtros.fechaFin ? new Date(filtros.fechaFin) : null;
    const cumpleFecha = (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    
    // Filtro por recurso
    const cumpleRecurso = !filtros.recurso || mov.recurso?.toLowerCase().includes(filtros.recurso.toLowerCase());
    
    // Filtro por estudiante
    const cumpleEstudiante = !filtros.estudiante || mov.estudiante?.toLowerCase().includes(filtros.estudiante.toLowerCase());
    
    // Filtro por responsable
    const cumpleResponsable = !filtros.responsable || mov.responsable?.toLowerCase().includes(filtros.responsable.toLowerCase());
    
    // Filtro por búsqueda general (observaciones y responsable)
    const cumpleBusqueda = !filtros.busqueda || 
      (mov.observaciones?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
       mov.responsable?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
       mov.recurso?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
       mov.estudiante?.toLowerCase().includes(filtros.busqueda.toLowerCase()));
    
    return cumpleTipo && cumpleFecha && cumpleRecurso && cumpleEstudiante && cumpleResponsable && cumpleBusqueda;
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
    <ImprovedDashboardLayout>
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

        {/* Contador de resultados */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            Mostrando {movimientosPaginados.length} de {movimientosFiltrados.length} movimientos
            {movimientosFiltrados.length !== movimientos.length && (
              <span className="text-blue-600 dark:text-blue-400">
                {" "}(filtrados de {movimientos.length} total)
              </span>
            )}
          </span>
          {movimientosFiltrados.length > 0 && (
            <span className="text-gray-500">
              Página {paginaActual} de {totalPaginas}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <MovimientoTable 
              movimientos={movimientosPaginados} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

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

        <EditarMovimientoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setMovimientoAEditar(null);
          }}
          onSubmit={handleEditSubmit}
          movimiento={movimientoAEditar}
        />
      </div>
    </ImprovedDashboardLayout>
  );
}
