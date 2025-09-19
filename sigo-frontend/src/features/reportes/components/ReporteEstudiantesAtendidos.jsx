import { useEffect, useState } from "react";
import reporteService from "../services/ReporteService";
import { toast } from "react-hot-toast";
import ExportarAtendidosPDF from "./ExportarAtendidosPDF";

const motivos = ["Académico", "Conductual", "Familiar", "Emocional", "Otro"];

export default function ReporteEstudiantesAtendidos() {
  const [filtros, setFiltros] = useState({ curso: "", fecha_inicio: "", fecha_fin: "", motivo: "", profesional: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await reporteService.getEstudiantesAtendidos(filtros);
      setData(res.data);
    } catch {
      toast.error("Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleFiltrar} className="flex flex-wrap gap-4 items-end mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Curso</label>
          <input name="curso" value={filtros.curso} onChange={handleChange} className="px-2 py-1 border rounded w-32" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Fecha inicio</label>
          <input type="date" name="fecha_inicio" value={filtros.fecha_inicio} onChange={handleChange} className="px-2 py-1 border rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Fecha fin</label>
          <input type="date" name="fecha_fin" value={filtros.fecha_fin} onChange={handleChange} className="px-2 py-1 border rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Motivo</label>
          <select name="motivo" value={filtros.motivo} onChange={handleChange} className="px-2 py-1 border rounded">
            <option value="">Todos</option>
            {motivos.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Profesional</label>
          <input name="profesional" value={filtros.profesional} onChange={handleChange} className="px-2 py-1 border rounded w-32" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">Filtrar</button>
      </form>
      <div className="flex justify-end mb-2">
        <ExportarAtendidosPDF data={data} />
      </div>
      <div className="overflow-x-auto rounded shadow bg-white dark:bg-slate-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold">Nombre</th>
              <th className="px-3 py-2 text-xs font-semibold">Apellido</th>
              <th className="px-3 py-2 text-xs font-semibold">Curso</th>
              <th className="px-3 py-2 text-xs font-semibold">Motivo</th>
              <th className="px-3 py-2 text-xs font-semibold">Fecha</th>
              <th className="px-3 py-2 text-xs font-semibold">Profesional</th>
              <th className="px-3 py-2 text-xs font-semibold">Sesiones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Cargando...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">Sin resultados</td></tr>
            ) : (
              data.map((row) => (
                <tr key={row.id + row.fecha} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-3 py-2">{row.nombre}</td>
                  <td className="px-3 py-2">{row.apellido}</td>
                  <td className="px-3 py-2">{row.curso}</td>
                  <td className="px-3 py-2">{row.motivo}</td>
                  <td className="px-3 py-2">{row.fecha ? new Date(row.fecha).toLocaleDateString() : ''}</td>
                  <td className="px-3 py-2">{row.profesional}</td>
                  <td className="px-3 py-2 text-center">{row.cantidad_sesiones}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 