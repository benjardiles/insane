import axios from 'axios';
import { apiClient } from './auth';

export const adminAPI = {
  // Obtener estadísticas generales del dashboard
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw error;
    }
  },
  
  // Obtener las tiendas con más ventas
  getTopStores: async (limit = 5) => {
    try {
      const response = await apiClient.get(`/admin/stores/top?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top stores:', error);
      throw error;
    }
  },
  
  // Obtener datos de ventas para gráficos
  getSalesData: async (period = 'monthly') => {
    try {
      const response = await apiClient.get(`/admin/sales/data?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  },
  
  // Obtener lista de usuarios
  getUsers: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Obtener lista de tiendas
  getStores: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/admin/stores?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  },
  
  // Obtener lista de repartidores
  getDeliveryDrivers: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/admin/delivery-drivers?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery drivers:', error);
      throw error;
    }
  }
};

