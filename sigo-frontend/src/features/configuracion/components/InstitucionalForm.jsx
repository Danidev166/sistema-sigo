import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import configuracionService from "../services/configuracionService";
import Button from "../../../components/ui/Button";

/**
 * Formulario de configuración institucional.
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Datos iniciales
 * @param {Function} props.onSubmit - Callback para guardar
 * @returns {JSX.Element}
 *
 * @example
 * <InstitucionalForm onSubmit={fn} />
 */

export default function InstitucionalForm() {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    director: "",
    lema: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const cargarDatos = useCallback(async () => {
    try {
      setIsLoading(true);
      const datos = await configuracionService.obtenerPorTipo("institucional");
      const mapeado = Object.fromEntries(datos.map((d) => [d.clave, d.valor]));
      setForm({
        nombre: mapeado.nombre_institucion || "",
        direccion: mapeado.direccion || "",
        telefono: mapeado.telefono || "",
        email: mapeado.email || "",
        director: mapeado.director || "",
        lema: mapeado.lema || "",
      });
    } catch (error) {
      toast.error("Error al cargar datos institucionales: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      const payload = [
        { clave: "nombre_institucion", valor: form.nombre },
        { clave: "direccion", valor: form.direccion },
        { clave: "telefono", valor: form.telefono },
        { clave: "email", valor: form.email },
        { clave: "director", valor: form.director },
        { clave: "lema", valor: form.lema },
      ];
      await configuracionService.actualizar("institucional", payload);
      toast.success("Datos institucionales actualizados correctamente");
    } catch (error) {
      toast.error("Error al guardar datos institucionales: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Datos Institucionales
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: "nombre", label: "Nombre de la institución *", type: "text" },
          { name: "direccion", label: "Dirección *", type: "text" },
          { name: "telefono", label: "Teléfono *", type: "tel" },
          { name: "email", label: "Correo electrónico *", type: "email" },
          { name: "director", label: "Nombre del Director(a)", type: "text" },
          { name: "lema", label: "Lema institucional", type: "text" },
        ].map(({ name, label, type }) => {
          const inputId = `input-${name}`;
          return (
            <div key={name} className="col-span-1">
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                {label}
              </label>
              <input
                id={inputId}
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={label.includes("*")}
                placeholder={`Ingrese ${label.toLowerCase().replace("*", "")}`}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  );
}
