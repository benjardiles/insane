import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Interfaces para los pedidos
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  storeId: string;
  storeName: string;
}

export interface CustomerInfo {
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

export interface CreateOrderDto {
  customer: CustomerInfo;
  items?: OrderItem[];
  total?: number;
  deliveryMethod: 'PICKUP' | 'DELIVERY';
  notes?: string;
  fromCart?: boolean;
}

// Modificar la enumeración de estados para que coincida con los existentes
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

// Actualizar la interfaz OrderResponse para usar la enumeración
export interface OrderResponse {
  id: string;
  userId: string;
  items: OrderItem[];
  customer: CustomerInfo;
  total: number;
  status: OrderStatus;
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: string;
  orderDate: string;
  estimatedDeliveryDate?: string;
  notes?: string;
}

export interface PaginatedOrdersResponse {
  data: OrderResponse[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface OrderStatsResponse {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

// Añadir interfaz para actualizar el estado
export interface UpdateOrderStatusDto {
  status: OrderStatus;
  notes?: string;
}

class OrdersAPI {
  private baseURL: string;
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_PURCHASING_API_URL || 'http://localhost:3003/api/v1';
  }
  
  // Obtener el ID del usuario del token JWT
  private getUserId(): string {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      const decoded: any = jwtDecode(token);
      return decoded.sub || decoded.id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      throw new Error('Failed to get user ID');
    }
  }
  
  // Configurar headers con el ID de usuario
  private getHeaders() {
    const userId = this.getUserId();
    return {
      'x-user-id': userId,
      'Content-Type': 'application/json'
    };
  }
  
  // Crear un nuevo pedido
  async createOrder(orderData: CreateOrderDto): Promise<OrderResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/orders`, orderData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  // Obtener lista de pedidos con paginación y filtros
  async getOrders(page = 1, limit = 10, status?: string): Promise<PaginatedOrdersResponse> {
    try {
      const params: any = { page, limit };
      if (status) params.status = status;
      
      const response = await axios.get(`${this.baseURL}/orders`, {
        headers: this.getHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
  
  // Obtener detalles de un pedido específico
  async getOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/${orderId}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }
  
  // Cancelar un pedido
  async cancelOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await axios.patch(`${this.baseURL}/orders/${orderId}/cancel`, {}, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }
  
  // Obtener estadísticas de pedidos
  async getOrderStats(): Promise<OrderStatsResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/stats`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
  
  // Obtener mis pedidos
  async getMyOrders(): Promise<{ data: any[] }> {
    try {
      // Cambiar de /orders/my-orders a /orders
      const response = await axios.get(`${this.baseURL}/orders`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  }
  
  // Obtener órdenes por ID de tienda
  async getOrdersByStoreId(storeId: string, page = 1, limit = 10, status?: string): Promise<{ data: any[], pagination: any }> {
    try {
      // Construir parámetros de consulta
      const params: any = { page, limit };
      if (status) {
        params.status = status;
      }
      
      const response = await axios.get(`${this.baseURL}/orders/store/${storeId}`, {
        headers: this.getHeaders(),
        params
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders for store ${storeId}:`, error);
      throw error;
    }
  }
  
  // Obtener estadísticas de órdenes por ID de tienda
  async getStoreOrderStats(storeId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/orders/store/${storeId}/stats`, {
        headers: this.getHeaders()
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching order stats for store ${storeId}:`, error);
      throw error;
    }
  }
  
  async updateOrderStatus(orderId: string, statusData: UpdateOrderStatusDto): Promise<OrderResponse> {
    try {
      const response = await axios.patch(`${this.baseURL}/orders/${orderId}/status`, statusData, {
        headers: this.getHeaders()
      });
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
      throw error;
    }
  }
}

export const ordersAPI = new OrdersAPI();


