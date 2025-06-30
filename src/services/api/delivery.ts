import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Enums que coinciden exactamente con el backend
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryMethod {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
}

// Interfaces actualizadas según la respuesta real de la API
export interface AvailableOrderCustomer {
  name: string;
  email?: string;
  address?: string;
  phone?: string;
}

export interface AvailableOrderItem {
  name: string;
  quantity: number;
  price: number;
  productId?: string;
  storeId?: string;
  storeName?: string;
  imageUrl?: string;
}

export interface AvailableOrder {
  id?: string;
  _id?: string;
  userId?: string;
  items: AvailableOrderItem[];
  customer: AvailableOrderCustomer;
  total: number;
  status: string;
  deliveryMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AvailableOrdersResponse {
  data: AvailableOrder[];
  pagination: PaginationResponse;
}

// Interfaz para la información del repartidor
interface DeliveryPerson {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

// Interfaz para el token decodificado
interface DecodedToken {
  sub: string;
}

class DeliveryAPI {
  private baseURL: string;
  
  constructor() {
    this.baseURL = 'http://localhost:3003/api/v1';
  }
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (userId) {
      headers['x-user-id'] = userId;
    }
    
    return headers;
  }
  
  // Obtener el ID del usuario del token JWT
  async decodeJWT() {
    const token = localStorage.getItem('token');
    let userIdFromToken = null;

    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      userIdFromToken = decoded.sub; // depende de cómo venga en tu token
      console.log('User ID from token:', userIdFromToken);
    }

    return userIdFromToken;
  }
  
  async getAvailableOrders(page = 1, limit = 10): Promise<AvailableOrdersResponse> {
    try {
      const userId = localStorage.getItem('userId') || await this.decodeJWT();
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario del token');
      }
      
      // Guardar el ID en localStorage para futuros usos
      localStorage.setItem('userId', userId);
      
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${this.baseURL}/orders/delivery/available`,
        {
          headers: {
            'x-user-id': userId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: { 
            page, 
            limit
          }
        }
      );
      
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching available orders:', error);
      throw error;
    }
  }
  
  // Método para asignar una orden usando la ruta específica de asignación
  async assignOrder(orderId: string): Promise<any> {
    try {
      // Obtener el ID del usuario del token JWT
      const userId = await this.decodeJWT();
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario del token');
      }
      
      // Guardar el ID en localStorage para futuros usos
      localStorage.setItem('userId', userId);
      
      const token = localStorage.getItem('token');
      
      console.log('Enviando solicitud con userId:', userId);
      
      const response = await axios.patch(
        `${this.baseURL}/orders/${orderId}/assign`, 
        {}, 
        {
          headers: {
            'x-user-id': userId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning order:', error);
      throw error;
    }
  }
    
  // Método para obtener las órdenes asignadas al repartidor
  async getMyAssignedOrders(queryParams: any = {}): Promise<any> {
    try {
      const userId = localStorage.getItem('userId') || await this.decodeJWT();
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario del token');
      }
      
      // Guardar el ID en localStorage para futuros usos
      localStorage.setItem('userId', userId);
      
      const token = localStorage.getItem('token');
      
      // Construir parámetros de consulta (página, límite, estado, etc.)
      const params = new URLSearchParams();
      if (queryParams.page) params.append('page', queryParams.page);
      if (queryParams.limit) params.append('limit', queryParams.limit);
      if (queryParams.status) params.append('status', queryParams.status);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await axios.get(
        `${this.baseURL}/orders/delivery/assigned${queryString}`,
        {
          headers: {
            'x-user-id': userId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned orders:', error);
      throw error;
    }
  }
  
  // Método para marcar una orden como entregada
  async markOrderAsDelivered(orderId: string): Promise<any> {
    try {
      const userId = localStorage.getItem('userId') || await this.decodeJWT();
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario del token');
      }
      
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${this.baseURL}/orders/${orderId}/delivery-status`,
        { 
          status: OrderStatus.DELIVERED
        },
        { 
          headers: {
            'x-user-id': userId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      throw error;
    }
  }
  
  // Método para marcar una orden como en tránsito
  async markOrderAsInTransit(orderId: string): Promise<any> {
    try {
      const userId = localStorage.getItem('userId') || await this.decodeJWT();
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario del token');
      }
      
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${this.baseURL}/orders/${orderId}/delivery-status`,
        { 
          status: OrderStatus.IN_TRANSIT
        },
        { 
          headers: {
            'x-user-id': userId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking order as in transit:', error);
      throw error;
    }
  }
  
  // Método para obtener detalles de una orden específica
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const userId = localStorage.getItem('userId') || await this.decodeJWT();
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario del token');
      }
      
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${this.baseURL}/orders/${orderId}`,
        {
          headers: {
            'x-user-id': userId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }
  
  // Método auxiliar para obtener información del usuario (puedes implementarlo según tus necesidades)
  getUserInfo(): DeliveryPerson {
    // Implementa la lógica para obtener la información del repartidor
    // Esto podría venir de localStorage, de un estado global, etc.
    return {
      id: localStorage.getItem('userId') || '',
      name: localStorage.getItem('userName') || 'Repartidor'
    };
  }

  // Método para actualizar el estado de una orden
  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      const userId = localStorage.getItem('userId') || await this.decodeJWT();
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario del token');
      }
      
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${this.baseURL}/orders/${orderId}/status`,
        { status },
        { 
          headers: {
            'x-user-id': userId,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order status to ${status}:`, error);
      throw error;
    }
  }
}

export const deliveryAPI = new DeliveryAPI();
