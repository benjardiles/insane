"use client";
import axios from 'axios';
import { useCartStore } from '@/store/cartStore';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Nota: cambiado de https a http para desarrollo local
});

// Interfaces para cada tipo de usuario
interface BaseUserData {
  email: string;
  name: string;
  phone: string;
  password: string;
}

interface StoreUserData extends BaseUserData {
  store_name: string;
  store_address: string;
  store_phone: string;
}

interface ClientUserData extends BaseUserData {
  address: string;
}

interface DeliveryUserData extends BaseUserData {
  //no tiene
}

interface AdminUserData extends BaseUserData {
  // ver que añadirle
}

type UserData = StoreUserData | ClientUserData | DeliveryUserData | AdminUserData;


export const register = async (userData: UserData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);

    // Procesar la respuesta
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);

    // Configurar el token para futuras solicitudes
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return user;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  
  // Guarda el token en localStorage o en un estado global
  const { access_token, user } = response.data;
  localStorage.setItem('token', access_token);
  
  // Configura el token para futuras solicitudes
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

    // Limpiar el carrito al cerrar sesión
    if (typeof window !== 'undefined') {
      // Acceder al store directamente para limpiar el carrito
      const clearCart = useCartStore.getState().clearCart;
      clearCart();
    }

    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const getProfile = async () => {
  const token = localStorage.getItem('token'); 
  if (!token) {
    throw new Error('No access token available');
  }
  
  try {
    const response = await apiClient.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', {
      email
    });
    return response.data;
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }
};
