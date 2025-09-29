// src/features/estudiantes/pages/tabs/Familia.jsx
import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Mail, Phone, Calendar, User, AlertCircle, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import estudianteService from "../../services/estudianteService";
import apoderadosService from "../../services/apoderadosService";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";
import FamiliaModal from "./FamiliaModal";
import DeleteConfirmModal from "../intervenciones/DeleteConfirmModal";

export default function Familia({ idEstudiante }) {
  const [apoderados, setApoderados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Filtros y paginación
  const [filtros, setFiltros] = useState({
    curso: '',
    nombre: '',
    email: ''
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    paginas: 0
  });
  const [paginaActual, setPaginaActual] = useState(1);

  const fetchApoderados = useCallback(async () => {
    try {
      setLoading(true);
      const offset = (paginaActual - 1) * paginacion.limit;
      
      const response = await apoderadosService.obtenerApoderados({
        ...filtros,
        limit: paginacion.limit,
        offset
      });
      
      setApoderados(response.apoderados);
      setPaginacion(response.paginacion);
    } catch (error) {
      console.error("❌ Error al cargar apoderados:", error);
      toast.error("Error al cargar lista de apoderados");
    } finally {
      setLoading(false);
    }
  }, [filtros, paginaActual, paginacion.limit]);

  // Manejar cambios en filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaActual(1); // Reset a primera página
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({ curso: '', nombre: '', email: '' });
    setPaginaActual(1);
  };

  // Cambiar página
  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleSubmit = async (formData) => {
    try {
      const data = {
        ...formData,
        id_estudiante: idEstudiante,
      };

      if (editingData) {
        await estudianteService.actualizarComunicacion(editingData.id, data);
        toast.success("Comunicación actualizada correctamente");
      } else {
        await estudianteService.crearComunicacion(data);
        toast.success("Comunicación enviada correctamente");
      }

      setModalOpen(false);
      setEditingData(null);
      fetchDatos();
    } catch (error) {
      console.error("❌ Error al guardar comunicación:", error);
      toast.error("Error al guardar la comunicación");
    }
  };

  const handleEdit = (item) => {
    setEditingData(item);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    try {
      await estudianteService.eliminarComunicacion(item.id);
      toast.success("Comunicación eliminada correctamente");
      setDeleteTarget(null);
      fetchDatos();
    } catch (error) {
      console.error("❌ Error al eliminar comunicación:", error);
      toast.error("Error al eliminar la comunicación");
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'Citación a Reunión':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'Informe Académico':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'Alerta/Urgente':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'Seguimiento':
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMedioIcon = (medio) => {
    switch (medio) {
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'Teléfono':
        return <Phone className="w-4 h-4 text-green-500" />;
      case 'Presencial':
        return <User className="w-4 h-4 text-purple-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    fetchApoderados();
  }, [fetchApoderados]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Comunicación con la Familia
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestiona las comunicaciones con todos los apoderados
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingData(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Comunicación
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros de búsqueda</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Curso
            </label>
            <input
              type="text"
              placeholder="Ej: 4A, 3B..."
              value={filtros.curso}
              onChange={(e) => handleFiltroChange('curso', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Nombre del apoderado o estudiante"
              value={filtros.nombre}
              onChange={(e) => handleFiltroChange('nombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="text"
              placeholder="Email del apoderado"
              value={filtros.email}
              onChange={(e) => handleFiltroChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button
            onClick={limpiarFiltros}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            variant="ghost"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      {/* Lista de Apoderados */}
      <div className="space-y-4">
        {apoderados.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No se encontraron apoderados
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {Object.values(filtros).some(f => f) 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay apoderados con email registrado'
              }
            </p>
          </div>
        ) : (
          <>
            {apoderados.map((apoderado) => (
              <div
                key={apoderado.estudiante_id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {apoderado.nombre_apoderado || 'Sin nombre'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Apoderado de {apoderado.estudiante_nombre} {apoderado.estudiante_apellido}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{apoderado.email_apoderado}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{apoderado.telefono_apoderado || 'No registrado'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{apoderado.curso}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Comunicaciones: {apoderado.total_comunicaciones}</span>
                      {apoderado.ultima_comunicacion && (
                        <span>Última: {new Date(apoderado.ultima_comunicacion).toLocaleDateString('es-CL')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingData({ 
                          id_estudiante: apoderado.estudiante_id,
                          nombre_apoderado: apoderado.nombre_apoderado,
                          email_apoderado: apoderado.email_apoderado
                        });
                        setModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Enviar comunicación"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Paginación */}
            {paginacion.paginas > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando {apoderados.length} de {paginacion.total} apoderados
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="p-2"
                    variant="ghost"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Página {paginaActual} de {paginacion.paginas}
                  </span>
                  
                  <Button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === paginacion.paginas}
                    className="p-2"
                    variant="ghost"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <FamiliaModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleSubmit}
        estudiante={editingData}
        editingData={null}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        title="Eliminar Comunicación"
        message={`¿Estás seguro de que quieres eliminar esta comunicación? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
