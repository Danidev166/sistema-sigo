// src/features/estudiantes/pages/Consolidado.jsx
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import estudianteService from "../../services/estudianteService";
import { toast } from "react-hot-toast";

export default function Consolidado({ idEstudiante }) {
  const [datos, setDatos] = useState({
    historial: {},
    conducta: [],
    asistencia: [],
    entrevistas: [],
    intervenciones: [],
    evaluaciones: [],
    familia: []
  });
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    if (!idEstudiante) return;

    setLoading(true);
    const anioActual = new Date().getFullYear();

    try {
      const [
        historialRes,
        conductaRes,
        asistenciaRes,
        entrevistasRes,
        intervencionesRes,
        evaluacionesRes,
        familiaRes
      ] = await Promise.all([
        estudianteService.getHistorialAcademico(idEstudiante, anioActual),
        estudianteService.getConducta(idEstudiante),
        estudianteService.getAsistencia(idEstudiante),
        estudianteService.getEntrevistas(idEstudiante),
        estudianteService.getIntervenciones(idEstudiante),
        estudianteService.getEvaluaciones(idEstudiante),
        estudianteService.getComunicacionFamilia(idEstudiante)
      ]);

      setDatos({
        historial: historialRes.data[0] || {},
        conducta: conductaRes.data || [],
        asistencia: asistenciaRes.data || [],
        entrevistas: entrevistasRes.data || [],
        intervenciones: intervencionesRes.data || [],
        evaluaciones: evaluacionesRes.data || [],
        familia: familiaRes.data || []
      });
    } catch (error) {
      console.error("❌ Error al cargar vista consolidada:", error);
      toast.error("Error al cargar los datos consolidados");
      setDatos({
        historial: {},
        conducta: [],
        asistencia: [],
        entrevistas: [],
        intervenciones: [],
        evaluaciones: [],
        familia: []
      });
    } finally {
      setLoading(false);
    }
  }, [idEstudiante]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-sm text-gray-500">Cargando datos consolidados...</p>
      </div>
    );
  }

  const {
    historial,
    conducta,
    entrevistas,
    intervenciones,
    evaluaciones,
    familia
  } = datos;

  return (
    <div className="space-y-8">
      {/* Secciones con bloques visuales adaptables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Resumen Académico</h3>
          <p><strong>Promedio:</strong> {historial.promedio ?? '—'}</p>
          <p><strong>Asistencia registrada:</strong> {historial.asistencia ?? '—'}%</p>
          <p><strong>Observaciones:</strong> {historial.observaciones || '—'}</p>
        </section>

        <section className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Últimos registros de conducta</h3>
          {conducta.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {conducta.slice(0, 3).map((item, i) => (
                <li key={i}>
                  {item.tipo_conducta || 'Sin categoría'}: {item.descripcion?.slice(0, 60) || '—'} ({format(new Date(item.fecha_registro), "dd/MM/yyyy")})
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">Sin registros recientes</p>}
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-blue-700 mb-2 break-words">Resultados de Evaluaciones</h3>
          {evaluaciones.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {evaluaciones.slice(0, 2).map((evalua, i) => (
                <li key={i} className="break-words">
                  <strong>{evalua.tipo_evaluacion}</strong>: {evalua.resultados || '—'} (Puntaje: {evalua.resultados})
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No hay evaluaciones registradas</p>}
        </section>

        <section className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-blue-700 mb-2">Entrevistas</h3>
          {entrevistas.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {entrevistas.slice(0, 2).map((e, i) => (
                <li key={i}>
                  {format(new Date(e.fecha_entrevista), "dd/MM/yyyy")}: {e.motivo}
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">Sin entrevistas recientes</p>}
        </section>

        <section className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow md:col-span-2 lg:col-span-1">
          <h3 className="text-base font-semibold text-blue-700 mb-2">Intervenciones</h3>
          {intervenciones.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {intervenciones.slice(0, 2).map((intv, i) => (
                <li key={i}>
                  {intv.tipo_intervencion} - {intv.descripcion?.slice(0, 40) || '—'}...
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500">No hay intervenciones registradas</p>}
        </section>
      </div>

      <section className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Comunicación con la Familia</h3>
        {familia.length > 0 ? (
          <ul className="list-disc pl-5 text-sm space-y-1">
            {familia.slice(0, 2).map((com, i) => (
              <li key={i}>
                {format(new Date(com.fecha_comunicacion), "dd/MM/yyyy")} - {com.tipo_comunicacion}: {com.detalle?.slice(0, 50) || '—'}...
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-gray-500">Sin registros de contacto familiar</p>}
      </section>
    </div>
  );
}
