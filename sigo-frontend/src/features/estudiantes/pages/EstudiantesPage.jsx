// src/features/estudiantes/pages/EstudiantesPage.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Search, FileDown, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import EstudianteTable from "../components/EstudianteTable";
import EstudianteFormModal from "../components/EstudianteFormModal";
import CargaMasivaModal from "../components/CargaMasivaModal";
import EnvioMasivoTestsModal from "../components/EnvioMasivoTestsModal";
import SmartCourseFilter from "../../../components/ui/SmartCourseFilter";
import DeleteConfirmModal from "../../usuarios/components/DeleteConfirmModal";
import estudianteService from "../services/estudianteService";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import { TableHeader, HeaderIcons } from "../../../components/headers/InstitutionalHeader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/logo-pages.webp";
import { OPCIONES_CURSOS_FILTRO } from "../constants/cursos";

export default function EstudiantesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ curso: "", estado: "" });

  const [isCargaMasivaModalOpen, setIsCargaMasivaModalOpen] = useState(false);
  const [isEnvioMasivoModalOpen, setIsEnvioMasivoModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [estudianteToDelete, setEstudianteToDelete] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Estados para el filtro inteligente
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [estudiantesPorCurso, setEstudiantesPorCurso] = useState([]);

  const fetchEstudiantes = useCallback(async (page = 1, search = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await estudianteService.getEstudiantesPaginados(page, 10, search);
      
      // Si la respuesta tiene paginación, usarla
      if (response.data.pagination) {
        setEstudiantes(response.data.data);
        setPagination(response.data.pagination);
      } else {
        // Fallback para respuesta sin paginación
        setEstudiantes(response.data);
        setPagination({
          page: 1,
          limit: 10,
          total: response.data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (err) {
      setError("Error al cargar estudiantes.");
      console.error("Error fetching students:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstudiantes();
  }, [fetchEstudiantes]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchEstudiantes(1, value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Manejar cambio de cursos seleccionados en el filtro inteligente
  const handleCursosChange = (nuevosCursos) => {
    setCursosSeleccionados(nuevosCursos);
    setCurrentPage(1);
    
    // Actualizar información de estudiantes por curso
    const infoEstudiantes = nuevosCursos.map(curso => ({
      curso,
      count: estudiantes.filter(est => est.curso === curso).length
    }));
    setEstudiantesPorCurso(infoEstudiantes);
  };

  // Manejar envío masivo de tests
  const handleEnvioMasivo = async (data) => {
    try {
      const { cursos, tipoTest, estudiantesPorCurso } = data;
      
      // Aquí implementarías la lógica de envío masivo
      // Por ahora solo mostramos un mensaje de confirmación
      toast.success(
        `Tests ${tipoTest} enviados a ${estudiantesPorCurso.reduce((sum, item) => sum + item.count, 0)} estudiantes de ${cursos.length} curso${cursos.length !== 1 ? 's' : ''}`,
        { duration: 5000 }
      );
      
      console.log('Datos para envío masivo:', data);
      
      // TODO: Implementar llamada a API para envío masivo
      // await testService.enviarMasivo(data);
      
    } catch (error) {
      console.error('Error en envío masivo:', error);
      throw error;
    }
  };

  // Aplicar filtros locales (cursos y estado) ya que la búsqueda se hace en el backend
  const filteredEstudiantes = (estudiantes || []).filter((est) => {
    // Filtro por cursos seleccionados (nuevo filtro inteligente)
    const matchesCursos = cursosSeleccionados.length === 0 || cursosSeleccionados.includes(est.curso);
    
    // Filtro por estado (filtro tradicional)
    const matchesEstado = !filters.estado || est.estado === filters.estado;
    
    return matchesCursos && matchesEstado;
  });

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchEstudiantes(newPage, searchTerm);
  };

  const handleEdit = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setIsModalOpen(true);
  };

  const handleDelete = (estudiante) => {
    setEstudianteToDelete(estudiante);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (estudianteToDelete) {
      try {
        await estudianteService.deleteEstudiante(estudianteToDelete.id);
        await fetchEstudiantes();
        toast.success("Estudiante eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el estudiante");
        console.error(error);
      } finally {
        setIsDeleteConfirmModalOpen(false);
        setEstudianteToDelete(null);
      }
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      doc.addImage(img, "PNG", 10, 10, 25, 25);
      doc.setFontSize(14);
      doc.text("Liceo Bicentenario Politécnico Caupolicán", 40, 20);
      doc.setFontSize(11);
      doc.text("Listado de Estudiantes", 40, 28);
      doc.text(`Fecha: ${fecha}`, 14, 45);
      autoTable(doc, {
        startY: 50,
        head: [["Nombre", "Apellido", "RUT", "Curso", "Especialidad"]],
        body: estudiantes.map((e) => [
          e.nombre,
          e.apellido,
          e.rut,
          e.curso || "-",
          e.especialidad || "-",
        ]),
        styles: { fontSize: 10 },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });
      doc.save(`estudiantes_${fecha.replaceAll("/", "-")}.pdf`);
    };
    img.onerror = () => {
      alert("⚠️ No se pudo cargar el logo institucional.");
    };
  };

  const renderPagination = () => {
    const { page, totalPages, hasNext, hasPrev } = pagination;
    
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            page === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrev}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </>
    );
  };

  const handleSubmit = async (formData) => {
    if (selectedEstudiante) {
      await estudianteService.updateEstudiante(selectedEstudiante.id, formData);
    } else {
      await estudianteService.createEstudiante(formData);
    }
    await fetchEstudiantes();
    setIsModalOpen(false);
    setSelectedEstudiante(null);
  };

  const handleCargaMasiva = async (data) => {
    try {
      await estudianteService.createBulk(data);
      await fetchEstudiantes();
      toast.success("Carga masiva exitosa");
    } catch (error) {
      toast.error("Error en la carga masiva: " + (error?.message || error));
      console.error(error);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchEstudiantes}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <ImprovedDashboardLayout>
      <TableHeader
        title="Gestión de Estudiantes"
        subtitle="Administra la información de los estudiantes del sistema"
        totalItems={estudiantes.length}
        actions={[
          {
            label: "Exportar PDF",
            icon: FileDown,
            onClick: handleExportPDF,
            variant: "secondary"
          },
          {
            label: "Agregar Estudiante",
            icon: Plus,
            onClick: () => setIsModalOpen(true),
            variant: "primary"
          },
          {
            label: "Carga Masiva",
            icon: Plus,
            onClick: () => setIsCargaMasivaModalOpen(true),
            variant: "primary"
          }
        ]}
        filters={[
          {
            label: "Filtros",
            icon: Filter,
            onClick: () => setIsFilterOpen(true)
          }
        ]}
      />

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 p-4">
        <div className="space-y-4 mb-6">
          {/* Búsqueda por nombre/RUT */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o RUT..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Filtro inteligente de cursos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filtro por Cursos (Inteligente)
              </label>
              <SmartCourseFilter
                estudiantes={estudiantes}
                cursosSeleccionados={cursosSeleccionados}
                onCursosChange={handleCursosChange}
                onEnvioMasivo={() => setIsEnvioMasivoModalOpen(true)}
                showEnvioMasivo={cursosSeleccionados.length > 0}
              />
            </div>
            
            {/* Filtro tradicional de estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado del Estudiante
              </label>
              <select
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Información de filtros activos */}
          {(cursosSeleccionados.length > 0 || filters.estado) && (
            <div className="flex flex-wrap gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Filtros activos:
              </span>
              {cursosSeleccionados.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                  {cursosSeleccionados.length} curso{cursosSeleccionados.length !== 1 ? 's' : ''} seleccionado{cursosSeleccionados.length !== 1 ? 's' : ''}
                </span>
              )}
              {filters.estado && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                  Estado: {filters.estado}
                </span>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" role="status"></div>
          </div>
        ) : (
          <>
            <EstudianteTable
              estudiantes={filteredEstudiantes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} estudiantes
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {renderPagination()}
              </div>
            </div>
          </>
        )}
      </div>

      <EstudianteFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEstudiante(null);
        }}
        onSubmit={handleSubmit}
        estudiante={selectedEstudiante}
      />

      <CargaMasivaModal
        isOpen={isCargaMasivaModalOpen}
        onClose={() => setIsCargaMasivaModalOpen(false)}
        onUpload={handleCargaMasiva}
      />

      <EnvioMasivoTestsModal
        isOpen={isEnvioMasivoModalOpen}
        onClose={() => setIsEnvioMasivoModalOpen(false)}
        cursosSeleccionados={cursosSeleccionados}
        estudiantesPorCurso={estudiantesPorCurso}
        onConfirm={handleEnvioMasivo}
      />

      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Está seguro que desea eliminar a ${estudianteToDelete?.nombre} ${estudianteToDelete?.apellido}? Esta acción no se puede deshacer.`}
      />
    </ImprovedDashboardLayout>
  );
}
