import api from "../../../services/axios";

const seguimientoPsicosocialService = {
  getSeguimientos: () => api.get("/seguimiento-psicosocial"),
  getSeguimientoById: (id) => api.get(`/seguimiento-psicosocial/${id}`),
  crearSeguimiento: (data) => api.post("/seguimiento-psicosocial", data),
  actualizarSeguimiento: (id, data) => api.put(`/seguimiento-psicosocial/${id}`, data),
  eliminarSeguimiento: (id) => api.delete(`/seguimiento-psicosocial/${id}`)
};

export default seguimientoPsicosocialService;
