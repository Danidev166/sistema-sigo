import axios from '../../../services/axios';

const BASE_URL = '/notificaciones';

const getAll = (params) => axios.get(BASE_URL, { params });
const getById = (id) => axios.get(`${BASE_URL}/${id}`);
const create = (data) => axios.post(BASE_URL, data);
const update = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
const remove = (id) => axios.delete(`${BASE_URL}/${id}`);
const marcarLeida = (id) => axios.put(`${BASE_URL}/${id}/leida`, { leida: true });

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  marcarLeida,
}; 