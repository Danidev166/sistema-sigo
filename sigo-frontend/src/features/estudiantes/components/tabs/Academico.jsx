// src/features/estudiantes/components/tabs/Academico.jsx
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import estudianteService from "../../services/estudianteService";
import { toast } from "react-toastify";
import { Button } from "../ui/Button";
import AcademicoFormModal from "../../components/academico/AcademicoFormModal";
import SeguimientoFormModal from "../../components/academico/SeguimientoFormModal";
import SeguimientoTable from "../../components/academico/SeguimientoTable";
import DeleteConfirmModal from "../../components/academico/DeleteConfirmModal";

export default function Academico({ idEstudiante }) {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [historial, setHistorial] = useState([]);
  const [seguimiento, setSeguimiento] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalHistorialOpen, setModalHistorialOpen] = useState(false);
  const [modalSeguimientoOpen, setModalSeguimientoOpen] = useState(false);
  const [editingSeguimiento, setEditingSeguimiento] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [h, s, a] = await Promise.all([
        estudianteService.getHistorialAcademico(idEstudiante, anio).catch(() => ({ data: [] })),
        estudianteService.getSeguimientoAcademico(idEstudiante, anio).catch(() => ({ data: [] })),
        estudianteService.getAsistencia(idEstudiante).catch(() => ({ data: [] }))
      ]);

      setHistorial(h.data || []);
      setSeguimiento(s.data || []);
      setAsistencias(a.data || []);
    } catch (error) {
      console.error("Error al cargar datos académicos:", error);
      toast.error("Error al cargar datos académicos");
      setHistorial([]);
      setSeguimiento([]);
      setAsistencias([]);
    } finally {
      setLoading(false);
    }
  }, [idEstudiante, anio]);

  useEffect(() => {
    if (idEstudiante) {
      fetchData();
    }
  }, [fetchData, idEstudiante]);

  const handleGuardarSeguimiento = async (formData) => {
    try {
      if (editingSeguimiento) {
        await estudianteService.actualizarSeguimiento(editingSeguimiento.id, formData);
        toast.success("Seguimiento actualizado");
      } else {
        await estudianteService.crearSeguimiento(formData);
        toast.success("Seguimiento creado");
      }
      setModalSeguimientoOpen(false);
      setEditingSeguimiento(null);
      fetchData();
    } catch (error) {
      console.error("Error al guardar seguimiento:", error);
      toast.error("Error al guardar seguimiento");
    }
  };

  const handleEliminarSeguimiento = async () => {
    try {
      await estudianteService.eliminarSeguimiento(deleteTarget.id);
      toast.success("Seguimiento eliminado");
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar seguimiento:", error);
      toast.error("Error al eliminar seguimiento");
    }
  };

  const handleRegistrarHistorial = async (formData) => {
    if (seguimiento.length === 0 || asistencias.length === 0) {
      toast.error("Debe haber al menos una nota y una asistencia registrada para generar el historial.");
      return;
    }

    try {
      await estudianteService.crearHistorialAcademico({
        id_estudiante: idEstudiante,
        fecha_actualizacion: new Date(),
        observaciones_academicas: formData.observaciones_academicas,
        promedio_general: parseFloat(formData.promedio_general),
        asistencia: parseFloat(formData.asistencia),
      });

      toast.success("✅ Historial guardado correctamente");
      setModalHistorialOpen(false);
      fetchData();
    } catch (error) {
      console.error("❌ Error al registrar historial:", error);
      toast.error("No se pudo guardar el historial");
    }
  };

  return (
    <div className="space-y-10">
      {/* === HISTORIAL ACADÉMICO === */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            Historial Académico
          </h2>
          <Button onClick={() => setModalHistorialOpen(true)} className="bg-blue-600 text-white">
            + Nuevo Registro
          </Button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium mr-2 text-gray-700 dark:text-gray-300">Año:</label>
          <select
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="border px-2 py-1 rounded text-sm dark:bg-slate-700 dark:text-white"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-300">Cargando datos...</p>
        ) : historial.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No hay registros académicos para este año.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border rounded shadow">
              <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white">
                <tr>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Promedio</th>
                  <th className="px-4 py-2">Asistencia</th>
                  <th className="px-4 py-2">Observaciones</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white">
                {historial.map((item) => (
                  <tr key={item.id} className="border-t dark:border-slate-700">
                    <td className="px-4 py-2">
                      {format(new Date(item.fecha_actualizacion), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-2">{item.promedio_general}</td>
                    <td className="px-4 py-2">{item.asistencia}%</td>
                    <td className="px-4 py-2">{item.observaciones_academicas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* === SEGUIMIENTO ACADÉMICO === */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            Seguimiento Académico
          </h2>
          <Button
            onClick={() => {
              setEditingSeguimiento(null);
              setModalSeguimientoOpen(true);
            }}
            className="bg-blue-600 text-white"
          >
            + Nuevo Seguimiento
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-300">Cargando datos...</p>
        ) : seguimiento.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No hay datos de seguimiento para este año.</p>
        ) : (
          <SeguimientoTable
            registros={seguimiento}
            onEdit={(item) => {
              setEditingSeguimiento(item);
              setModalSeguimientoOpen(true);
            }}
            onDelete={(item) => setDeleteTarget(item)}
          />
        )}
      </div>

      {/* Modals */}
      <AcademicoFormModal
        isOpen={modalHistorialOpen}
        onClose={() => setModalHistorialOpen(false)}
        onSubmit={handleRegistrarHistorial}
        idEstudiante={idEstudiante}
        seguimiento={seguimiento}
        asistencias={asistencias}
      />

      <SeguimientoFormModal
        isOpen={modalSeguimientoOpen}
        onClose={() => {
          setModalSeguimientoOpen(false);
          setEditingSeguimiento(null);
        }}
        onSubmit={handleGuardarSeguimiento}
        initialData={editingSeguimiento}
        idEstudiante={idEstudiante}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleEliminarSeguimiento}
        title="¿Deseas eliminar este seguimiento?"
      />
    </div>
  );
}
