import { useEffect, useState } from "react";
import {
  Bell,
  ClipboardList,
  UsersRound,
  CalendarCheck2Icon,
  BrainCircuitIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import dashboardService from "../services/dashboardService";
import DashboardHeader from '../components/DashboardHeader';

/**
 * Dashboard específico para usuarios orientadores.
 *
 * @param {Object} props
 * @param {Object} props.stats - Estadísticas del dashboard
 * @returns {JSX.Element}
 *
 * @example
 * <DashboardOrientador stats={stats} />
 */
export default function DashboardOrientador() {
  const { user } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const [agendaHoy, setAgendaHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [alertasData, agendaData] = await Promise.all([
          dashboardService.getAlertasRecientes(),
          dashboardService.getAgendaHoy(),
        ]);
        setAlertas(alertasData);
        setAgendaHoy(agendaData);
      } catch (error) {
        console.error("Error al cargar datos del dashboard orientador:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-300 px-6 py-4">Cargando datos...</p>;
  }

  return (
    <>
      <DashboardHeader />
      <div className="space-y-8">
        {/* Alertas recientes */}
        <Card title="Alertas recientes" icon={<Bell className="text-red-500 w-5 h-5" />}>
          {alertas.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200 list-disc list-inside pl-2">
              {alertas.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Sin alertas recientes.</p>
          )}
        </Card>

        {/* Agenda del día */}
        <Card title="Agenda del día" icon={<ClipboardList className="text-blue-500 w-5 h-5" />}>
          {agendaHoy.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200 list-disc list-inside pl-2">
              {agendaHoy.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay entrevistas agendadas hoy.</p>
          )}
        </Card>

        {/* Accesos rápidos */}
        <Card
          title="Accesos rápidos"
          icon={<UsersRound className="text-indigo-500 w-5 h-5" />}
          extraClass="!mb-0"
        >
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <AccessButton to="/estudiantes" icon={<UsersRound size={18} />} color="indigo">
              Ver Estudiantes
            </AccessButton>
            <AccessButton to="/entrevistas" icon={<CalendarCheck2Icon size={18} />} color="blue">
              Ver Entrevistas
            </AccessButton>
            <AccessButton to="/test-vocacionales" icon={<BrainCircuitIcon size={18} />} color="purple">
              Test Vocacionales
            </AccessButton>
          </div>
        </Card>
      </div>
    </>
  );
}

function Card({ title, icon, children, extraClass = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow p-6 transition hover:shadow-md hover:scale-[1.01] ${extraClass}`}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function AccessButton({ to, icon, color, children }) {
  const colorMap = {
    indigo: "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:hover:bg-indigo-800 dark:text-indigo-200",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200",
    purple: "bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-200",
  };

  return (
    <Link
      to={to}
      className={`px-4 py-3 rounded-lg flex items-center gap-2 font-medium text-sm sm:text-base transition ${colorMap[color]}`}
    >
      {icon}
      {children}
    </Link>
  );
}
