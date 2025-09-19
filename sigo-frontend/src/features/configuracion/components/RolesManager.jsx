import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const RolesManager = () => {
  const [roles, setRoles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roles');
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Datos de ejemplo para desarrollo
  const rolesData = [
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso total al sistema, incluyendo configuración y gestión de usuarios',
      color: 'bg-red-100 text-red-800',
      usuarios: 2,
      permisos: ['gestión_usuarios', 'configuración', 'reportes', 'backup', 'auditoría']
    },
    {
      id: 2,
      nombre: 'Orientador',
      descripcion: 'Gestión de estudiantes, entrevistas y evaluaciones psicológicas',
      color: 'bg-blue-100 text-blue-800',
      usuarios: 5,
      permisos: ['gestión_estudiantes', 'entrevistas', 'evaluaciones', 'seguimiento']
    },
    {
      id: 3,
      nombre: 'Asistente Social',
      descripcion: 'Acceso a recursos, intervenciones y seguimiento social',
      color: 'bg-green-100 text-green-800',
      usuarios: 3,
      permisos: ['recursos', 'intervenciones', 'seguimiento_social', 'comunicación']
    }
  ];

  const permisosData = [
    { id: 'gestión_usuarios', nombre: 'Gestión de Usuarios', descripcion: 'Crear, editar y eliminar usuarios' },
    { id: 'configuración', nombre: 'Configuración del Sistema', descripcion: 'Modificar configuraciones generales' },
    { id: 'reportes', nombre: 'Generar Reportes', descripcion: 'Crear y exportar reportes del sistema' },
    { id: 'backup', nombre: 'Respaldo de Datos', descripcion: 'Realizar respaldos y restauraciones' },
    { id: 'auditoría', nombre: 'Auditoría', descripcion: 'Ver logs y actividad del sistema' },
    { id: 'gestión_estudiantes', nombre: 'Gestión de Estudiantes', descripcion: 'Administrar información de estudiantes' },
    { id: 'entrevistas', nombre: 'Entrevistas', descripcion: 'Realizar y gestionar entrevistas' },
    { id: 'evaluaciones', nombre: 'Evaluaciones', descripcion: 'Gestionar evaluaciones vocacionales' },
    { id: 'seguimiento', nombre: 'Seguimiento', descripcion: 'Realizar seguimiento académico y psicosocial' },
    { id: 'recursos', nombre: 'Recursos', descripcion: 'Gestionar recursos educativos' },
    { id: 'intervenciones', nombre: 'Intervenciones', descripcion: 'Crear y gestionar intervenciones' },
    { id: 'seguimiento_social', nombre: 'Seguimiento Social', descripcion: 'Seguimiento de casos sociales' },
    { id: 'comunicación', nombre: 'Comunicación', descripcion: 'Enviar comunicaciones a familias' }
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRoles(rolesData);
      setPermisos(permisosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos de roles');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleSaveRole = (roleData) => {
    // Simular guardado
    toast.success('Rol actualizado correctamente');
    setShowModal(false);
    setSelectedRole(null);
  };

  const getPermisoIcon = (permisoId) => {
    const iconMap = {
      'gestión_usuarios': Users,
      'configuración': Settings,
      'reportes': Eye,
      'backup': Shield,
      'auditoría': AlertCircle,
      'gestión_estudiantes': Users,
      'entrevistas': Edit,
      'evaluaciones': CheckCircle,
      'seguimiento': Eye,
      'recursos': Shield,
      'intervenciones': Edit,
      'seguimiento_social': Eye,
      'comunicación': Edit
    };
    return iconMap[permisoId] || Settings;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Roles y Permisos</h3>
            <p className="text-sm text-gray-600 mt-1">
              Administra roles de usuario y sus permisos en el sistema
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Rol
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'roles', label: 'Roles', count: roles.length },
            { id: 'permisos', label: 'Permisos', count: permisos.length },
            { id: 'usuarios', label: 'Asignaciones', count: roles.reduce((acc, role) => acc + role.usuarios, 0) }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'roles' && (
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
                        {role.nombre}
                      </span>
                      <span className="text-sm text-gray-500">
                        {role.usuarios} usuario{role.usuarios !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{role.descripcion}</p>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {role.permisos.map((permisoId) => {
                          const permiso = permisosData.find(p => p.id === permisoId);
                          const Icon = getPermisoIcon(permisoId);
                          return (
                            <span
                              key={permisoId}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              <Icon className="w-3 h-3 mr-1" />
                              {permiso?.nombre}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'permisos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permisosData.map((permiso) => {
              const Icon = getPermisoIcon(permiso.id);
              return (
                <div key={permiso.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{permiso.nombre}</h4>
                      <p className="text-sm text-gray-500 mt-1">{permiso.descripcion}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Asignaciones de Usuarios</h3>
            <p className="text-gray-500 mb-4">
              Aquí podrás ver y gestionar qué usuarios tienen asignado cada rol
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Gestionar Asignaciones
            </button>
          </div>
        )}
      </div>

      {/* Modal para editar rol */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedRole ? 'Editar Rol' : 'Nuevo Rol'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del Rol</label>
                  <input
                    type="text"
                    defaultValue={selectedRole?.nombre || ''}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedRole?.descripcion || ''}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSaveRole({})}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManager;

