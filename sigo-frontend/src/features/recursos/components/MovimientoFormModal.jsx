import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import EstudianteSelector from "../../../components/ui/EstudianteSelector";
import recursoService from "../services/recursoService";
import { toast } from "react-hot-toast";

/**
 * Modal de formulario para crear movimientos de inventario.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para guardar los datos
 * @param {Array} props.recursos - Lista de recursos disponibles
 * @returns {JSX.Element}
 *
 * @example
 * <MovimientoFormModal isOpen={true} onClose={fn} onSubmit={fn} recursos={[]} />
 */
export default function MovimientoFormModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    tipo_movimiento: "entrada",
    id_recurso: "",
    cantidad: "",
    observaciones: "",
    id_estudiante: null,
    responsable: "",
  });

  const [recursos, setRecursos] = useState([]);
  const [estudiante, setEstudiante] = useState(null);

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const res = await recursoService.getRecursos();
        setRecursos(res.data || []);
      } catch (err) {
        toast.error("Error al cargar los recursos");
        console.error(err);
      }
    };
    if (isOpen) fetchRecursos();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEstudianteChange = (selected) => {
    setEstudiante(selected);
    setForm((prev) => ({
      ...prev,
      id_estudiante: selected ? selected.value : null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id_recurso || !form.tipo_movimiento || !form.cantidad) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    onSubmit({ ...form, cantidad: parseInt(form.cantidad) });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-lg p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Registrar Movimiento
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Movimiento *
              </label>
              <select
                name="tipo_movimiento"
                value={form.tipo_movimiento}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>

            {/* Recurso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recurso *
              </label>
              <select
                name="id_recurso"
                value={form.id_recurso}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              >
                <option value="">Seleccione recurso</option>
                {recursos.length > 0 ? (
                  recursos.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} ({r.tipo_recurso})
                    </option>
                  ))
                ) : (
                  <option disabled value="">
                    No hay recursos disponibles
                  </option>
                )}
              </select>
            </div>

            {/* Estudiante (solo si salida) */}
            {form.tipo_movimiento === "salida" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estudiante *
                </label>
                <EstudianteSelector value={estudiante} onChange={handleEstudianteChange} />
              </div>
            )}

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cantidad *
              </label>
              <input
                name="cantidad"
                type="number"
                min="1"
                value={form.cantidad}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Responsable
              </label>
              <input
                name="responsable"
                type="text"
                value={form.responsable}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows={2}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white text-sm"
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
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
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
