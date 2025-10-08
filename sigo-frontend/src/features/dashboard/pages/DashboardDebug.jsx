// Dashboard de debug para identificar problemas
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/useAuth";
import dashboardService from "../services/dashboardService";

export default function DashboardDebug() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("🔍 DEBUG: Iniciando carga de datos...");
        console.log("🔍 DEBUG: Usuario autenticado:", isAuthenticated);
        console.log("🔍 DEBUG: Usuario:", user);
        
        setLoading(true);
        const data = await dashboardService.getResumen();
        
        console.log("🔍 DEBUG: Datos obtenidos:", data);
        setDebugData(data);
        setError(null);
      } catch (err) {
        console.error("🔍 DEBUG: Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div className="p-8">🔄 Cargando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-8 text-red-500">❌ No autenticado</div>;
  }

  if (loading) {
    return <div className="p-8">🔄 Cargando datos del dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500">❌ Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Recargar
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🔍 Dashboard Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Estudiantes</h3>
          <p className="text-3xl font-bold text-blue-600">
            {debugData?.estudiantes || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Entrevistas</h3>
          <p className="text-3xl font-bold text-green-600">
            {debugData?.entrevistas || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Alertas</h3>
          <p className="text-3xl font-bold text-red-600">
            {debugData?.alertas || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Entrevistas por Mes</h3>
          <p className="text-3xl font-bold text-purple-600">
            {debugData?.entrevistasPorMes?.length || 0}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Datos Raw (JSON)</h3>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(debugData, null, 2)}
        </pre>
      </div>

      <div className="mt-6">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Recargar Datos
        </button>
      </div>
    </div>
  );
}
