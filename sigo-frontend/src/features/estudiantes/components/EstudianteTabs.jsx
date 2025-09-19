// src/features/estudiantes/components/EstudianteTabs.jsx
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import Academico from "./tabs/Academico";
import Evaluaciones from "./tabs/Evaluaciones";
import Conducta from "./tabs/Conducta";
import Intervenciones from "./tabs/Intervenciones";
import Entrevistas from "./tabs/Entrevistas";
import Asistencia from "./tabs/Asistencia";
import Familia from "./tabs/Familia";
import Consolidado from "./tabs/Consolidado";
import RecursosEntregados from "./tabs/RecursosEntregados";
import estudianteService from "../services/estudianteService";

const EstudianteTabs = memo(({ idEstudiante }) => {
  const [tabActivo, setTabActivo] = useState("Académico");
  const [estudiante, setEstudiante] = useState(null);

  // Memoizar la función de carga del estudiante
  const cargarEstudiante = useCallback(async () => {
    try {
      const response = await estudianteService.getEstudianteById(idEstudiante);
      setEstudiante(response.data);
    } catch (error) {
      console.error("Error al cargar datos del estudiante:", error);
    }
  }, [idEstudiante]);

  useEffect(() => {
    cargarEstudiante();
  }, [cargarEstudiante]);

  // Memoizar la configuración de tabs para evitar recreaciones
  const tabs = useMemo(() => [
    { nombre: "Académico", componente: Academico },
    { nombre: "Evaluaciones", componente: Evaluaciones },
    { nombre: "Conducta", componente: Conducta },
    { nombre: "Intervenciones", componente: Intervenciones },
    { nombre: "Entrevistas", componente: Entrevistas },
    { nombre: "Asistencia", componente: Asistencia },
    { nombre: "Familia", componente: Familia },
    {
      nombre: "Recursos Entregados",
      componente: (props) => (
        <RecursosEntregados
          {...props}
          nombreEstudiante={estudiante?.nombre}
          curso={estudiante?.curso}
        />
      ),
    },
    { nombre: "Vista Consolidada", componente: Consolidado },
  ], [estudiante?.nombre, estudiante?.curso]);

  const TabActivoComponent = useMemo(() => 
    tabs.find((t) => t.nombre === tabActivo)?.componente,
    [tabs, tabActivo]
  );

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-600 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.nombre}
            onClick={() => setTabActivo(tab.nombre)}
            className={`px-4 py-2 rounded-t-md text-sm font-medium whitespace-nowrap transition
              ${
                tabActivo === tab.nombre
                  ? "bg-white dark:bg-slate-800 text-blue-600 border border-gray-300 dark:border-slate-500 border-b-white dark:border-b-slate-800"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600"
              }`}
          >
            {tab.nombre}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 mt-2 rounded-md shadow">
        <TabActivoComponent idEstudiante={idEstudiante} />
      </div>
    </div>
  );
});

// Agregar displayName para debugging
EstudianteTabs.displayName = 'EstudianteTabs';

export default EstudianteTabs;
