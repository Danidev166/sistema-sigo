import axios from '../services/axios';
import toast from 'react-hot-toast';

export const loginUser = async ({ email, password }) => {
  const res = await axios.post('/auth/login', { email, password });
  const { token, usuario } = res.data;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(usuario));

  toast.success(`¡Bienvenido/a, ${usuario.nombre}!`);

  return { token, usuario };
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
