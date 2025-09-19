import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import {
  UsersRound,
  CalendarCheck2Icon,
  Bell,
  Search,
  CalendarPlus,
  PackagePlus,
  FileText,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dashboardService from "../../../services/dashboardService";
import DashboardHeader from '../components/DashboardHeader';

/**
 * Dashboard específico para usuarios administradores.
 *
 * @param {Object} props
 * @param {Object} props.stats - Estadísticas del dashboard
 * @param {Function} props.onGenerarPDF - Callback para generar PDF
 * @returns {JSX.Element}
 *
 * @example
 * <DashboardAdmin stats={stats} onGenerarPDF={fn} />
 */
export default function DashboardAdmin() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    estudiantes: 0,
    entrevistas: 0,
    alertas: 0,
    entrevistasPorMes: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const data = await dashboardService.getResumen();
        setStats(data);
      } catch (error) {
        console.error("Error al cargar resumen del admin:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500 px-6 py-4">Cargando dashboard...</p>;
  }

  return (
    <>
      <DashboardHeader />
      <div className="space-y-8 px-4 sm:px-6 md:px-8 pb-8">
        {/* Header superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Bienvenido/a {user?.nombre}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-300">
            Rol: {user?.rol}
          </span>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            title="ESTUDIANTES"
            value={stats.estudiantes}
            color="blue"
            icon={<UsersRound className="w-6 h-6 text-white" />}
          />
          <SummaryCard
            title="ENTREVISTAS"
            value={stats.entrevistas}
            color="green"
            icon={<CalendarCheck2Icon className="w-6 h-6 text-white" />}
          />
          <SummaryCard
            title="ALERTAS"
            value={stats.alertas}
            color="red"
            icon={<Bell className="w-6 h-6 text-white" />}
          />
        </div>

        {/* Gráfico */}
        <Card title="Entrevistas por mes">
          {Array.isArray(stats.entrevistasPorMes) &&
          stats.entrevistasPorMes.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={stats.entrevistasPorMes}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No hay datos para mostrar.</p>
          )}
        </Card>

        {/* Accesos rápidos */}
        <Card title="Acciones rápidas">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AccessButton
              to="/estudiantes"
              icon={<Search size={18} />}
              text="Buscar estudiante"
            />
            <AccessButton
              to="/agenda"
              icon={<CalendarPlus size={18} />}
              text="Agendar entrevista"
            />
            <AccessButton
              to="/recursos"
              icon={<PackagePlus size={18} />}
              text="Registrar recurso"
            />
            <AccessButton
              to="/reportes"
              icon={<FileText size={18} />}
              text="Generar reporte PDF"
            />
          </div>
        </Card>
      </div>
    </>
  );
}

function SummaryCard({ title, value, color, icon }) {
  const bgColor = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
  }[color];

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow text-white ${bgColor}`}
    >
      <div>
        <p className="text-sm uppercase">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/20">
        {icon}
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 transition hover:shadow-md hover:scale-[1.01]">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function AccessButton({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-white transition font-medium"
    >
      {icon}
      {text}
    </Link>
  );
}
