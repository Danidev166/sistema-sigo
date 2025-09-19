import api from "../../../services/axios";

const alertaService = {
  generarAlertas: () => api.post("/alertas/generar"),
  getAlertas: () => api.get("/alertas"),
  cambiarEstado: (id, estado) => api.patch(`/alertas/${id}/estado`, { estado }),
};

export default alertaService;
