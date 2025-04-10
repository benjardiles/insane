import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Nota: cambiado de https a http para desarrollo local
});

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  
  // Guarda el token en localStorage o en un estado global
  const { access_token, user } = response.data;
  localStorage.setItem('token', access_token);
  
  // Configura el token para futuras solicitudes
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
  return user;
};