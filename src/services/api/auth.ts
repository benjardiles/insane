"use client"
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Nota: cambiado de https a http para desarrollo local
});

interface RegisterData {
  email: string;
  name: string;
  phone: string;
  password: string;
  address?: string;
  account_type: 'admin' | 'usuario' | 'tienda' | 'delivery';
}

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  
  // Guarda el token en localStorage o en un estado global
  const { access_token, user } = response.data;
  localStorage.setItem('token', access_token);
  
  // Configura el token para futuras solicitudes
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
  return user;
};

export const register = async (userData: RegisterData) => {
  // Reordenamos los campos en el orden esperado
  const orderedData = {
    email: userData.email,
    name: userData.name,
    phone: userData.phone,
    password: userData.password,
    address: userData.address,
    account_type: userData.account_type
  };

  const response = await apiClient.post('/auth/register', orderedData);
  
  const { access_token, user } = response.data;
  localStorage.setItem('token', access_token);
  
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
  return user;
};

export const logout = async (refreshToken: string): Promise<boolean> => {
  try {
    const response = await apiClient.post('/auth/logout', {
      refresh_token: refreshToken,
    });

    if (response.status !== 200) {
      throw new Error('Logout failed');
    }

    // Limpiar el almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Eliminar el token de las cabeceras predeterminadas
    delete apiClient.defaults.headers.common['Authorization'];

    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};