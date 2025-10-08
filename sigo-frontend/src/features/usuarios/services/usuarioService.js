import api from "../../../services/axios";

const usuarioService = {
  // Ahora acepta un parámetro opcional 'config' para enviar headers o cualquier otra config axios
  getUsuarios: (config = {}) => api.get("/usuarios", config),
  
  // Método paginado
  getUsuariosPaginados: (page = 1, limit = 10, search = "") =>
    api.get(`/usuarios?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  getUsuarioById: (id) => api.get(`/usuarios/${id}`),
  crearUsuario: (data) => api.post("/usuarios", data),
  actualizarUsuario: (id, data) => api.put(`/usuarios/${id}`, data),

  actualizarEstado: (id, nuevoEstado) =>
    api.patch(`/usuarios/${id}/estado`, { estado: nuevoEstado }),

  eliminarUsuario: (id) => api.delete(`/usuarios/${id}`),
};

export default usuarioService;
