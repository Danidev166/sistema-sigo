import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

/**
 * Modal para registrar una entrevista desde la agenda.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onSubmit - Callback para registrar la entrevista
 * @returns {JSX.Element}
 *
 * @example
 * <RegistrarEntrevistaModal isOpen={true} onClose={fn} onSubmit={fn} />
 */

export default function RegistrarEntrevistaModal({ isOpen, onClose, onSubmit }) {
  const [observaciones, setObservaciones] = useState("");
  const [conclusiones, setConclusiones] = useState("");
  const [acciones, setAcciones] = useState("");
  const [asistio, setAsistio] = useState("Presente");

  const handleSubmit = () => {
    onSubmit({
      observaciones,
      conclusiones,
      acciones_acordadas: acciones,
      asistio
    });
    onClose();
    setObservaciones("");
    setConclusiones("");
    setAcciones("");
    setAsistio("Presente");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Entrevista Realizada">
      <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ¿Asistió a la entrevista?
          </label>
          <select
            className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={asistio}
            onChange={(e) => setAsistio(e.target.value)}
          >
            <option value="Presente">Presente</option>
            <option value="Ausente">Ausente</option>
            <option value="Justificada">Justificada</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Observaciones:
          </label>
          <textarea
            className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ingrese las observaciones de la entrevista..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Conclusiones:
          </label>
          <textarea
            className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            value={conclusiones}
            onChange={(e) => setConclusiones(e.target.value)}
            placeholder="Ingrese las conclusiones de la entrevista..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Acciones acordadas:
          </label>
          <textarea
            className="w-full border rounded p-2 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            value={acciones}
            onChange={(e) => setAcciones(e.target.value)}
            placeholder="Ingrese las acciones acordadas..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Button 
            onClick={onClose} 
            className="w-full sm:w-auto bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-500"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
          >
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
}