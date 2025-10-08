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
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import { TableHeader } from "../../../components/headers/InstitutionalHeader";
import { PlusIcon, Users } from "lucide-react";
import UserTable from "../components/UserTable";
import UserFormModal from "../components/UserFormModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // Función para traer usuarios con paginación
  const fetchUsuarios = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await usuarioService.getUsuariosPaginados(page, 10, search);
      
      // Si la respuesta tiene paginación, usarla
      if (res.data.pagination) {
        setUsuarios(res.data.data);
        setPagination(res.data.pagination);
      } else {
        // Fallback para respuesta sin paginación
        setUsuarios(res.data);
        setPagination({
          page: 1,
          limit: 10,
          total: res.data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        });
      }
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

  // Manejar búsqueda con debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchUsuarios(1, value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUsuarios(newPage, searchTerm);
  };

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
      alert("✅ Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      
      // Manejar error específico de usuario protegido
      if (error.response?.status === 403 && error.response?.data?.error === "USUARIO_PROTEGIDO") {
        alert("❌ Este usuario no se puede eliminar por motivos de seguridad");
      } else {
        alert("❌ Error al eliminar el usuario. Inténtalo de nuevo.");
      }
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
    <ImprovedDashboardLayout>
      <div className="space-y-6">
        <TableHeader
          title="Gestión de Usuarios"
          subtitle="Administra los usuarios del sistema"
          totalItems={pagination.total}
          actions={[
            {
              label: "Agregar Usuario",
              icon: PlusIcon,
              onClick: () => handleEdit(null),
              variant: "primary"
            }
          ]}
        />

        {/* Búsqueda */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, email o rol..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Cargando usuarios...
          </p>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 sm:p-6">
              <UserTable
                usuarios={usuarios}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleEstado={handleToggleEstado}
              />
            </div>
            
            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} usuarios
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          pagination.page === page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
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
    </ImprovedDashboardLayout>
  );
}
