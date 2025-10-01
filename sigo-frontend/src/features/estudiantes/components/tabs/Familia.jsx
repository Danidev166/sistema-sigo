// src/features/estudiantes/pages/tabs/FamiliaSimple.jsx
import { useEffect, useState, useCallback } from "react";
import { Plus, Mail, Phone, Calendar, User } from "lucide-react";
import estudianteService from "../../services/estudianteService";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";
import FamiliaModal from "./FamiliaModal";

export default function FamiliaSimple({ idEstudiante }) {
  const [apoderado, setApoderado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchApoderado = useCallback(async () => {
    try {
      setLoading(true);
      
      // Cargar solo el apoderado del estudiante específico
      const response = await estudianteService.getEstudianteById(idEstudiante);
      
      if (response.data && response.data.nombre_apoderado) {
        setApoderado({
          id: response.data.id,
          estudiante_id: response.data.id,
          nombre_apoderado: response.data.nombre_apoderado,
          email_apoderado: response.data.email_apoderado,
          telefono_apoderado: response.data.telefono_apoderado,
          parentesco: response.data.parentesco_apoderado || 'Apoderado',
          curso: response.data.curso || 'N/A'
        });
      } else {
        setApoderado(null);
      }
    } catch (error) {
      console.error("❌ Error al cargar apoderado del estudiante:", error);
      toast.error("Error al cargar datos del apoderado");
      setApoderado(null);
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

      if (editingData && editingData.id) {
        await estudianteService.actualizarComunicacion(editingData.id, data);
        toast.success("Comunicación actualizada correctamente");
      } else {
        await estudianteService.crearComunicacion(data);
        toast.success("Comunicación enviada correctamente");
      }

      setModalOpen(false);
      setEditingData(null);
      fetchApoderado();
    } catch (error) {
      console.error("❌ Error al guardar comunicación:", error);
      toast.error("Error al guardar la comunicación");
    }
  };

  useEffect(() => {
    if (idEstudiante) {
      fetchApoderado();
    }
  }, [idEstudiante, fetchApoderado]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
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
            Gestiona las comunicaciones con el apoderado del estudiante
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
      {apoderado ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {apoderado.nombre_apoderado}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apoderado del estudiante
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {apoderado.email_apoderado || 'No registrado'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Teléfono:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {apoderado.telefono_apoderado || 'No registrado'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Parentesco:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {apoderado.parentesco}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Curso:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {apoderado.curso}
              </p>
            </div>
          </div>

          {/* Botón de Comunicación */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <div className="text-center">
              <Button
                onClick={() => {
                  setEditingData(null);
                  setModalOpen(true);
                }}
                className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <Mail className="w-4 h-4" />
                Enviar Comunicación
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay apoderado registrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Este estudiante no tiene un apoderado registrado en el sistema
          </p>
        </div>
      )}

      {/* Modal de Comunicación */}
      {modalOpen && (
        <FamiliaModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingData(null);
          }}
          onSubmit={handleSubmit}
          editingData={editingData}
          apoderado={apoderado}
        />
      )}
    </div>
  );
}
