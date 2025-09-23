/**
 * Página de gestión de recursos del sistema.
 *
 * Permite visualizar, crear, editar y eliminar recursos.
 * Integra tabla, filtros y modales para formularios.
 *
 * @component
 * @returns {JSX.Element} Página de recursos
 *
 * @example
 * <Route path="/recursos" element={<RecursosPage />} />
 */
import { useEffect, useState } from "react";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import Button from "../../../components/ui/Button";
import { Plus } from "lucide-react";
import recursoService from "../services/recursoService";
import movimientoService from "../services/movimientoService";
import RecursoTable from "../components/RecursoTable";
import RecursoFormModal from "../components/RecursoFormModal";
import DeleteConfirmModal from "../../estudiantes/components/intervenciones/DeleteConfirmModal";
import FiltroInventario from "../components/FiltroInventario";
import { toast } from "react-toastify";
import ExportarInventarioPDF from "../components/ExportarInventarioPDF";

export default function RecursosPage() {
  const [recursos, setRecursos] = useState([]);
 
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resRecursos = await recursoService.getRecursos();

      const recursosBase = resRecursos.data || [];

      // Usar el campo 'disponible' que ya viene del backend
      const recursosConStock = recursosBase.map((r) => ({
        ...r,
        cantidad_disponible: r.disponible || 0
      }));

      setRecursos(recursosConStock);
      
    } catch (err) {
      console.error("Error al cargar recursos:", err);
      setError("No se pudieron cargar los recursos. Intente nuevamente.");
      toast.error("Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGuardar = async (formData) => {
    try {
      if (editing) {
        await recursoService.actualizarRecurso(editing.id, formData);
        toast.success("Recurso actualizado correctamente");
      } else {
        await recursoService.crearRecurso(formData);
        toast.success("Recurso creado correctamente");
      }
      setModalOpen(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error("Error al guardar recurso:", err);
      toast.error(err.response?.data?.error || "Error al guardar recurso");
    }
  };

  const handleEliminar = async () => {
    try {
      await recursoService.eliminarRecurso(deleteTarget.id);
      toast.success("Recurso eliminado correctamente");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error("Error al eliminar recurso:", err);
      toast.error(err.response?.data?.error || "Error al eliminar recurso");
    }
  };

  const recursosFiltrados = filtro
    ? recursos.filter((r) => r.tipo_recurso === filtro)
    : recursos;

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            Inventario de Recursos
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ExportarInventarioPDF recursos={recursosFiltrados} />
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Recurso
            </Button>
          </div>
        </div>

        <FiltroInventario filtro={filtro} setFiltro={setFiltro} />

        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-3 text-gray-600 dark:text-gray-400">Cargando recursos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button className="mt-3" onClick={fetchData}>
              Reintentar
            </Button>
          </div>
        ) : (
          <RecursoTable
            recursos={recursosFiltrados}
            onEdit={(r) => {
              setEditing(r);
              setModalOpen(true);
            }}
            onDelete={(r) => setDeleteTarget(r)}
          />
        )}

        <RecursoFormModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={handleGuardar}
          initialData={editing}
        />

        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleEliminar}
          title="¿Eliminar recurso del inventario?"
        />
      </div>
    </ImprovedDashboardLayout>
  );
}
