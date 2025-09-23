// src/features/estudiantes/pages/EstudiantesPage.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Search, FileDown, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import EstudianteTable from "../components/EstudianteTable";
import EstudianteFormModal from "../components/EstudianteFormModal";
import CargaMasivaModal from "../components/CargaMasivaModal";
import DeleteConfirmModal from "../../usuarios/components/DeleteConfirmModal";
import estudianteService from "../services/estudianteService";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/logo-pages.png";
import { OPCIONES_CURSOS_FILTRO } from "../constants/cursos";

export default function EstudiantesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ curso: "", estado: "" });

  const [isCargaMasivaModalOpen, setIsCargaMasivaModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [estudianteToDelete, setEstudianteToDelete] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEstudiantes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await estudianteService.getEstudiantes();
      setEstudiantes(response.data);
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
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const filteredEstudiantes = (estudiantes || []).filter((est) => {
    const matchesSearch =
      est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.rut.includes(searchTerm);
    const matchesFilters =
      (!filters.curso || est.curso === filters.curso) &&
      (!filters.estado || est.estado === filters.estado);
    return matchesSearch && matchesFilters;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);
  const paginatedEstudiantes = filteredEstudiantes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const renderPagination = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 rounded-md ${
          currentPage === page
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        {page}
      </button>
    ));

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 className="page-title text-xl sm:text-2xl lg:text-3xl">
          Gestión de Estudiantes
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-4 py-2 rounded text-sm font-medium"
          >
            <FileDown size={16} />
            Exportar PDF
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Agregar Estudiante
          </button>
          <button
            onClick={() => setIsCargaMasivaModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Carga Masiva
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o RUT..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <Filter size={20} className="mr-2" />
            Filtros
          </button>
        </div>

        {isFilterOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Curso
              </label>
              <select
                name="curso"
                value={filters.curso}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              >
                {OPCIONES_CURSOS_FILTRO.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" role="status"></div>
          </div>
        ) : (
          <>
            <EstudianteTable
              estudiantes={paginatedEstudiantes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6 flex-wrap">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                {renderPagination()}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
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

      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`¿Está seguro que desea eliminar a ${estudianteToDelete?.nombre} ${estudianteToDelete?.apellido}? Esta acción no se puede deshacer.`}
      />
    </ImprovedDashboardLayout>
  );
}
