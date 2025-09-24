/**
 * Página de gestión de usuarios del sistema.
 *
 * Permite visualizar, crear, editar y eliminar usuarios.
 * Integra tabla y modales para formularios y confirmaciones.
 *
 * @component
 * @returns {JSX.Element} Página de usuarios
 *
 * @example
 * <Route path="/usuarios" element={<UsuariosPage />} />
 */
import { useEffect, useState } from "react";
import usuarioService from "../services/usuarioService";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { PlusIcon } from "lucide-react";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // Función para traer usuarios, sin cache
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await usuarioService.getUsuarios({
        headers: { "Cache-Control": "no-cache" },
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Abrir modal para editar o crear usuario
  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUsuario(null);
    setIsModalOpen(false);
  };

  // Guardar usuario (crear o actualizar)
  const handleSubmit = async (formData) => {
    try {
      console.log("Datos recibidos en handleSubmit:", formData);
      
      if (selectedUsuario) {
        console.log("Actualizando usuario:", selectedUsuario.id);
        await usuarioService.actualizarUsuario(selectedUsuario.id, formData);
      } else {
        console.log("Creando nuevo usuario");
        await usuarioService.crearUsuario(formData);
      }
      
      console.log("Usuario guardado exitosamente");
      await fetchUsuarios();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      console.error("Detalles del error:", error.response?.data);
      
      // Re-lanzar el error para que el modal lo maneje
      throw error;
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleDelete = (usuario) => {
    setUsuarioAEliminar(usuario);
    setIsDeleteOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!usuarioAEliminar || !usuarioAEliminar.id) return;
    try {
      await usuarioService.eliminarUsuario(usuarioAEliminar.id);
      await fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    } finally {
      setIsDeleteOpen(false);
      setUsuarioAEliminar(null);
    }
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setUsuarioAEliminar(null);
  };

  // Cambiar estado (activo/inactivo) y actualizar localmente
  const handleToggleEstado = async (usuario) => {
    try {
      const nuevoEstado = !usuario.estado; // invierte booleano
      await usuarioService.actualizarEstado(usuario.id, nuevoEstado);

      // Actualizar estado local para cambio inmediato en UI
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((u) =>
          u.id === usuario.id ? { ...u, estado: nuevoEstado } : u
        )
      );
    } catch (error) {
      console.error(
        "Error al cambiar estado del usuario:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Gestión de Usuarios
          </h1>
          <button
            onClick={() => handleEdit(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full sm:w-auto transition"
          >
            <PlusIcon size={18} />
            Agregar Usuario
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Cargando usuarios...
          </p>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 sm:p-6">
            <UserTable
              usuarios={usuarios}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleEstado={handleToggleEstado}
            />
          </div>
        )}
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedUsuario}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        itemName={
          usuarioAEliminar
            ? usuarioAEliminar.nombre
              ? `${usuarioAEliminar.nombre} ${usuarioAEliminar.apellido || ''}`.trim()
              : usuarioAEliminar.email || usuarioAEliminar.id
            : ''
        }
      />
    </DashboardLayout>
  );
}
