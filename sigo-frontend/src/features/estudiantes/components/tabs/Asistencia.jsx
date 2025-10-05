// src/features/estudiantes/tabs/Asistencia.jsx
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import estudianteService from "../../services/estudianteService";
import { toast } from "react-hot-toast";
import AsistenciaFormModal from "../../components/asistencia/AsistenciaFormModal";
import DeleteConfirmModal from "../../components/asistencia/DeleteConfirmModal";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import { Button } from "../ui/Button";

export default function Asistencia({ idEstudiante }) {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAsistencias = useCallback(async () => {
    try {
      const res = await estudianteService.getAsistencia(idEstudiante);
      const ordenadas = res.data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setAsistencias(ordenadas);
    } catch (error) {
      console.error("Error al cargar asistencias:", error);
      toast.error("Error al cargar asistencias.");
    } finally {
      setLoading(false);
    }
  }, [idEstudiante]);

  useEffect(() => {
    fetchAsistencias();
  }, [fetchAsistencias]);

  const handleSubmit = async (formData) => {
    try {
      // Debug de autenticación detallado
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('🔍 Debug asistencia - Token:', !!token);
      console.log('🔍 Debug asistencia - User:', !!user);
      console.log('🔍 Debug asistencia - Token valor:', token ? token.substring(0, 20) + '...' : 'No hay token');
      console.log('🔍 Debug asistencia - User valor:', user ? JSON.parse(user) : 'No hay user');
      
      if (!token) {
        console.error('❌ No hay token de autenticación');
        toast.error("No estás autenticado. Por favor, inicia sesión nuevamente.");
        return;
      }
      
      if (!user) {
        console.error('❌ No hay datos de usuario');
        toast.error("No hay datos de usuario. Por favor, inicia sesión nuevamente.");
        return;
      }
      
      const payload = {
        id_estudiante: idEstudiante,
        fecha: formData.fecha, // Ya viene como string del modal
        tipo: formData.tipo,
        justificacion: formData.justificacion || ""
      };

      console.log('📤 Enviando payload:', payload);

      if (editingData) {
        await estudianteService.actualizarAsistencia(editingData.id, payload);
        toast.success("Asistencia actualizada.");
      } else {
        await estudianteService.crearAsistencia(payload);
        toast.success("Asistencia registrada.");
      }

      setModalOpen(false);
      setEditingData(null);
      fetchAsistencias();
    } catch (error) {
      console.error("❌ Error al guardar asistencia:", error);
      console.error("❌ Error completo:", error.response?.data || error.message);
      
      // Mostrar error específico
      if (error.response?.status === 401) {
        toast.error("Error de autenticación. Por favor, inicia sesión nuevamente.");
      } else if (error.response?.status === 400) {
        toast.error("Datos inválidos. Verifica la información ingresada.");
      } else if (error.response?.status === 409) {
        toast.error("Ya existe un registro de asistencia para esta fecha. Por favor, edita el registro existente.");
      } else if (error.response?.status === 500) {
        toast.error("Error del servidor. Por favor, intenta nuevamente.");
      } else {
        toast.error("Error al guardar asistencia.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await estudianteService.eliminarAsistencia(deleteTarget.id);
      toast.success("Asistencia eliminada.");
      setDeleteTarget(null);
      fetchAsistencias();
    } catch (error) {
      console.error("Error al eliminar asistencia:", error);
      toast.error("Error al eliminar asistencia.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Registro de Asistencia
        </h2>
        <Button
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            setEditingData(null);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Asistencia
        </Button>
      </div>

      {/* Tabla o loading */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md shadow bg-white dark:bg-slate-800">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Justificación</TableCell>
                <TableCell className="text-right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asistencias.length > 0 ? (
                asistencias.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      {format(new Date(a.fecha), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      {a.tipo === "Presente" ? (
                        <span className="text-green-600 font-medium">Presente</span>
                      ) : a.tipo === "justificada" ? (
                        <span className="text-green-600 font-medium">Justificada</span>
                      ) : a.tipo === "Pendiente" ? (
                        <span className="text-yellow-600 font-medium">Pendiente</span>
                      ) : (
                        <span className="text-red-600 font-medium capitalize">{a.tipo}</span>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">
                      {a.justificacion || (
                        <span className="italic text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingData(a);
                            setModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-blue-500"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(a)}
                          className="text-gray-400 hover:text-red-500"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No hay registros de asistencia.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modales */}
      <AsistenciaFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingData}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="¿Deseas eliminar este registro de asistencia?"
      />
    </div>
  );
}
