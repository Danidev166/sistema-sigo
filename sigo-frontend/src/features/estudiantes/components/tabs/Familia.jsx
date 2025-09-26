// src/features/estudiantes/pages/tabs/Familia.jsx
import { useEffect, useState, useCallback } from "react";
import estudianteService from "../../services/estudianteService";
import InputField from "../InputField";
import TextareaField from "../TextareaField";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

export default function Familia({ idEstudiante }) {
  const [datos, setDatos] = useState([]);
  const [form, setForm] = useState({
    fecha: "",
    tipo: "",
    detalle: "",
    responsable: "",
    proxima_accion: "",
  });

  const fetchDatos = useCallback(async () => {
    try {
      const res = await estudianteService.getComunicacionFamilia(idEstudiante);
      const ordenadas = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setDatos(ordenadas);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar registros familiares");
    }
  }, [idEstudiante]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await estudianteService.crearComunicacion({
        ...form,
        id_estudiante: idEstudiante,
      });
      toast.success("Registro guardado correctamente");
      setForm({
        fecha: "",
        tipo: "",
        detalle: "",
        responsable: "",
        proxima_accion: "",
      });
      fetchDatos();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el registro");
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-blue-700 dark:text-white">
        Registro de Comunicación con la Familia
      </h3>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4"
      >
        <InputField
          label="Fecha"
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChange}
          required
        />
        <InputField
          label="Tipo"
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          required
        />
        <InputField
          label="Responsable"
          name="responsable"
          value={form.responsable}
          onChange={handleChange}
          required
        />
        <InputField
          label="Próxima acción"
          name="proxima_accion"
          value={form.proxima_accion}
          onChange={handleChange}
        />
        <div className="md:col-span-2">
          <TextareaField
            label="Detalle"
            name="detalle"
            value={form.detalle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" className="bg-blue-600 text-white">
            Guardar
          </Button>
        </div>
      </form>

      {/* Lista de registros */}
      <div className="space-y-4">
        {datos.map((item) => (
          <div
            key={item.id}
            className="border rounded-md p-4 bg-white shadow-sm dark:bg-slate-800"
          >
            <p className="text-sm text-gray-800 dark:text-white">
              <strong>Fecha:</strong> {item.fecha?.split("T")[0]}
            </p>
            <p className="text-sm text-gray-800 dark:text-white">
              <strong>Tipo:</strong> {item.tipo}
            </p>
            <p className="text-sm text-gray-800 dark:text-white">
              <strong>Detalle:</strong> {item.detalle}
            </p>
            <p className="text-sm text-gray-800 dark:text-white">
              <strong>Responsable:</strong> {item.responsable}
            </p>
            <p className="text-sm text-gray-800 dark:text-white">
              <strong>Próxima acción:</strong> {item.proxima_accion || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
