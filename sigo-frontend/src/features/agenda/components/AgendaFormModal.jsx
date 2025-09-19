import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useAuth } from "../../../context/useAuth";
import EstudianteSelector from "../components/EstudianteSelector";

/**
 * Modal de formulario para crear o editar entrevistas en la agenda.
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
 * <AgendaFormModal isOpen={true} onClose={fn} onSubmit={fn} estudiantes={[]} />
 */
export default function AgendaFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    id_estudiante: "",
    fecha: "",
    hora: "",
    motivo: "",
    profesional: "",
    email_orientador: "",
  });

  useEffect(() => {
    if (initialData) {
      const horaFormateada = initialData.hora?.slice(0, 5) || "";
      setForm({
        id_estudiante: initialData.id_estudiante || "",
        fecha: initialData.fecha?.split("T")[0] || "",
        hora: horaFormateada,
        motivo: initialData.motivo || "",
        profesional: initialData.profesional || user?.nombre || "",
        email_orientador: initialData.email_orientador || "",
      });
    } else {
      setForm({
        id_estudiante: "",
        fecha: "",
        hora: "",
        motivo: "",
        profesional: user?.nombre || "",
        email_orientador: "",
      });
    }
  }, [initialData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.id_estudiante ||
      !form.fecha ||
      !form.hora ||
      !form.motivo.trim()
    ) {
      alert("Todos los campos obligatorios deben estar completos.");
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(form.hora)) {
      alert("La hora debe estar en formato HH:MM");
      return;
    }

    onSubmit({
      ...form,
      id_estudiante: parseInt(form.id_estudiante),
      email_orientador: form.email_orientador.trim() || undefined,
      creado_en: new Date(),
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg p-4 sm:p-6 shadow-xl mx-4">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {initialData ? "Editar Entrevista Agendada" : "Nueva Entrevista"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Estudiante
                </label>
                <EstudianteSelector
                  value={form.id_estudiante}
                  onChange={(selected) =>
                    setForm((prev) => ({
                      ...prev,
                      id_estudiante: selected?.value || "",
                    }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="fecha"
                  className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                >
                  Fecha
                </label>
                <input
                  id="fecha"
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700 text-sm dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="hora"
                  className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                >
                  Hora
                </label>
                <input
                  id="hora"
                  type="time"
                  name="hora"
                  value={form.hora}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Profesional asignado
                </label>
                <input
                  type="text"
                  name="profesional"
                  value={form.profesional}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="motivo"
                className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
              >
                Motivo
              </label>
              <select
                id="motivo"
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
                required
              >
                <option value="">Seleccione un motivo</option>
                <option value="Psicológico">Psicológico</option>
                <option value="Vocacional">Vocacional</option>
                <option value="Académico">Académico</option>
                <option value="Familiar">Familiar</option>
                <option value="Social">Social</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="email_orientador"
                className="block text-sm text-gray-700 dark:text-gray-300 mb-1"
              >
                Correo orientador adicional (opcional)
              </label>
              <input
                id="email_orientador"
                type="email"
                name="email_orientador"
                value={form.email_orientador}
                onChange={handleChange}
                placeholder="Ej: orientador@liceo.cl"
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {initialData ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
