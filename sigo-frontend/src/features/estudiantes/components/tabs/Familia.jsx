// src/features/estudiantes/pages/tabs/Familia.jsx
import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Mail, Phone, Calendar, User, AlertCircle } from "lucide-react";
import estudianteService from "../../services/estudianteService";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";
import FamiliaModal from "./FamiliaModal";
import DeleteConfirmModal from "../intervenciones/DeleteConfirmModal";

export default function Familia({ idEstudiante }) {
  const [comunicaciones, setComunicaciones] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [comunicacionesRes, estudianteRes] = await Promise.all([
        estudianteService.getComunicacionFamilia(idEstudiante),
        estudianteService.getEstudianteById(idEstudiante)
      ]);
      
      const ordenadas = comunicacionesRes.data.sort((a, b) => new Date(b.fecha_comunicacion) - new Date(a.fecha_comunicacion));
      setComunicaciones(ordenadas);
      setEstudiante(estudianteRes.data);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      toast.error("Error al cargar comunicaciones familiares");
    } finally {
      setLoading(false);
    }
  }, [idEstudiante]);

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
    fetchDatos();
  }, [fetchDatos]);

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
            Gestiona las comunicaciones con el apoderado de {estudiante?.nombre} {estudiante?.apellido}
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

      {/* Información del Apoderado */}
      {estudiante?.email_apoderado && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            📧 Información del Apoderado
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Nombre:</span>
              <p className="text-blue-600 dark:text-blue-400">{estudiante.nombre_apoderado || 'No registrado'}</p>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Email:</span>
              <p className="text-blue-600 dark:text-blue-400">{estudiante.email_apoderado}</p>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Teléfono:</span>
              <p className="text-blue-600 dark:text-blue-400">{estudiante.telefono_apoderado || 'No registrado'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Comunicaciones */}
      <div className="space-y-4">
        {comunicaciones.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay comunicaciones registradas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Comienza enviando una comunicación al apoderado
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Comunicación
            </Button>
          </div>
        ) : (
          comunicaciones.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getTipoIcon(item.tipo_comunicacion)}
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.asunto}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.estado === 'Enviado' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {item.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.fecha_comunicacion).toLocaleDateString('es-CL')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      {getMedioIcon(item.medio)}
                      <span>{item.medio}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{item.responsable_id || 'No especificado'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Tipo:</span>
                      <span>{item.tipo_comunicacion}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {item.contenido}
                    </p>
                  </div>

                  {item.hora_reunion && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        📅 Detalles de la Reunión
                      </h5>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p><strong>Hora:</strong> {item.hora_reunion}</p>
                        {item.lugar_reunion && <p><strong>Lugar:</strong> {item.lugar_reunion}</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
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
        estudiante={estudiante}
        editingData={editingData}
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
