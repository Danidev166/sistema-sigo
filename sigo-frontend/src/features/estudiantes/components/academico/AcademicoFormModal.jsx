import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";

/**
 * Modal de formulario para crear o editar datos académicos del estudiante.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Object} [props.initialData] - Datos iniciales para edición
 * @returns {JSX.Element}
 *
 * @example
 * <AcademicoFormModal isOpen={true} onClose={fn} onSubmit={fn} />
 */
export default function AcademicoFormModal({
  isOpen,
  onClose,
  onSubmit,
  idEstudiante,
  seguimiento = [],
  asistencias = [],
}) {
  const [observaciones, setObservaciones] = useState("");
  const [promedio, setPromedio] = useState(0);
  const [asistencia, setAsistencia] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setObservaciones("");

      // Calcular promedio de notas
      const notas = seguimiento.map((s) => parseFloat(s.nota)).filter(Boolean);
      if (notas.length > 0) {
        const avg = notas.reduce((sum, n) => sum + n, 0) / notas.length;
        setPromedio(avg.toFixed(1));
      } else {
        setPromedio(0);
      }

      // Calcular porcentaje de asistencia
      const actuales = asistencias.filter(
        (a) => new Date(a.fecha).getFullYear() === new Date().getFullYear()
      );

      if (actuales.length > 0) {
        // ✅ Consideramos como asistencia válida: "Presente" o "Justificada"
        const presentes = actuales.filter(
          (a) => a.estado === "Presente" || a.estado === "Justificada"
        ).length;

        const porcentaje = (presentes / actuales.length) * 100;
        setAsistencia(porcentaje.toFixed(1));
      } else {
        setAsistencia(0);
      }
    }
  }, [isOpen, seguimiento, asistencias]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!observaciones.trim()) {
      alert("La observación no puede estar vacía.");
      return;
    }

    onSubmit({
      id_estudiante: idEstudiante,
      fecha_actualizacion: new Date(),
      observaciones_academicas: observaciones.trim(),
      promedio_general: parseFloat(promedio),
      asistencia: parseFloat(asistencia),
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 max-w-md w-full rounded-lg p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Nuevo Registro Académico
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Promedio General Calculado
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded dark:bg-slate-700 dark:text-white">
                {promedio}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Asistencia Calculada (%)
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded dark:bg-slate-700 dark:text-white">
                {asistencia}%
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Observaciones Generales
              </label>
              <textarea
                name="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
                placeholder="Ej: Buen desempeño general, mejora en matemática..."
                required
                className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 text-sm dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
