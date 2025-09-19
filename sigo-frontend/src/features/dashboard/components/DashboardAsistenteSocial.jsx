import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import {
  UsersRound,
  HeartHandshake,
  HandCoins,
  AlertTriangle,
  FileText,
  MessageCircle,
  UserCheck,
} from "lucide-react";
import estudianteService from "../../estudiantes/services/estudianteService";
import dashboardService from "../services/dashboardService";

/**
 * Dashboard específico para Asistente Social.
 * Muestra métricas y accesos relevantes al bienestar socioemocional, familiar y económico.
 */
export default function DashboardAsistenteSocial() {
  const { user } = useAuth();
  const [recursos, setRecursos] = useState(0);
  const [casosVulnerables, setCasosVulnerables] = useState(0);
  const [seguimientos, setSeguimientos] = useState(0);
  const [comunicaciones, setComunicaciones] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Ejemplo: puedes adaptar estos endpoints según tu backend
        const est = await estudianteService.getEstudiantes();
        const estudiantes = est.data || [];
        setCasosVulnerables(estudiantes.filter(e => e.situacion_economica && e.situacion_economica.toLowerCase() === "vulnerable").length);

        // Recursos entregados (puedes sumarizar desde entregas o recursos)
        const recursosRes = await dashboardService.getResumen();
        setRecursos(recursosRes?.recursosEntregados || 0);

        // Seguimientos psicosociales activos
        const segRes = await fetch("/api/seguimiento-psicosocial").then(r => r.json());
        setSeguimientos(segRes.filter(s => s.estado === "Activo").length);

        // Comunicaciones con familia
        const comRes = await fetch("/api/comunicacion-familia").then(r => r.json());
        setComunicaciones(comRes.length);
      } catch (error) {
        console.error("Error al cargar datos del dashboard asistente social:", error);
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
    <div className="space-y-8 px-4 sm:px-6 md:px-8 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Bienvenido/a {user?.nombre}
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Rol: {user?.rol}
        </span>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <SummaryCard
          title="CASOS VULNERABLES"
          value={casosVulnerables}
          color="red"
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
        />
        <SummaryCard
          title="RECURSOS ENTREGADOS"
          value={recursos}
          color="blue"
          icon={<HandCoins className="w-6 h-6 text-white" />}
        />
        <SummaryCard
          title="SEGUIMIENTOS ACTIVOS"
          value={seguimientos}
          color="green"
          icon={<HeartHandshake className="w-6 h-6 text-white" />}
        />
        <SummaryCard
          title="COMUNICACIONES FAMILIA"
          value={comunicaciones}
          color="purple"
          icon={<MessageCircle className="w-6 h-6 text-white" />}
        />
      </div>

      {/* Accesos rápidos */}
      <Card title="Accesos rápidos">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AccessButton
            to="/estudiantes"
            icon={<UsersRound size={18} />}
            text="Ver estudiantes"
          />
          <AccessButton
            to="/recursos"
            icon={<HandCoins size={18} />}
            text="Registrar entrega de recurso"
          />
          <AccessButton
            to="/seguimiento-psicosocial"
            icon={<HeartHandshake size={18} />}
            text="Seguimiento psicosocial"
          />
          <AccessButton
            to="/comunicacion-familia"
            icon={<MessageCircle size={18} />}
            text="Comunicación con familia"
          />
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value, color, icon }) {
  const bgColor = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
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