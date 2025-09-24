/**
 * Modal de formulario para crear o editar seguimientos psicosociales.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @param {Array} props.estudiantes - Lista de estudiantes disponibles
 * @returns {JSX.Element}
 *
 * @example
 * <SeguimientoPsicosocialFormModal isOpen={true} onClose={fn} onSubmit={fn} estudiantes={[]} />
 */
// src/features/seguimiento/components/SeguimientoPsicosocialFormModal.jsx
import { useEffect, useState } from "react";
import Modal from "../../../features/estudiantes/components/Modal";

export default function SeguimientoPsicosocialFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  estudiantes = [],
}) {
  const [form, setForm] = useState({
    id_estudiante: "",
    fecha_seguimiento: "",
    motivo: "",
    objetivos: "",
    plan_intervencion: "",
    profesional_asignado: "",
    estado: "Activo",
    observaciones: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      const hoy = new Date().toISOString().split("T")[0];
      setForm({
        id_estudiante: "",
        fecha_seguimiento: hoy,
        motivo: "",
        objetivos: "",
        plan_intervencion: "",
        profesional_asignado: "",
        estado: "Activo",
        observaciones: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id_estudiante || !form.fecha_seguimiento || !form.motivo) {
      alert("⚠️ Todos los campos obligatorios deben completarse.");
      return;
    }
    onSubmit(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        initialData
          ? "Editar Seguimiento Psicosocial"
          : "Nuevo Seguimiento Psicosocial"
      }
      size="max-w-3xl"
      className="overflow-y-auto max-h-[90vh] p-4 sm:p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Estudiante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estudiante *
            </label>
            <select
              name="id_estudiante"
              value={form.id_estudiante}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione estudiante</option>
              {estudiantes.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.nombre} {est.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              name="fecha_seguimiento"
              value={form.fecha_seguimiento}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Motivo *
            </label>
            <input
              type="text"
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              placeholder="Ej: Problemas emocionales"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Objetivos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Objetivos
            </label>
            <input
              type="text"
              name="objetivos"
              value={form.objetivos}
              onChange={handleChange}
              placeholder="Ej: Mejorar habilidades sociales"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Plan de intervención */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Plan de intervención
            </label>
            <textarea
              name="plan_intervencion"
              value={form.plan_intervencion}
              onChange={handleChange}
              rows={2}
              placeholder="Ej: Derivar a psicólogo del establecimiento"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Profesional asignado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Profesional asignado
            </label>
            <input
              type="text"
              name="profesional_asignado"
              value={form.profesional_asignado}
              onChange={handleChange}
              placeholder="Ej: Pamela Fernández"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estado *
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione estado</option>
              <option value="Activo">Activo</option>
              <option value="Cerrado">Cerrado</option>
              <option value="Derivado">Derivado</option>
            </select>
          </div>

          {/* Observaciones */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={2}
              placeholder="Comentarios adicionales"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {initialData ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
