import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { CartItem } from '@/store/cartStore';

// Interfaz para el token decodificado
interface DecodedToken {
  sub: string;
}

// Interfaz para la respuesta del carrito desde el backend
export interface CartResponse {
  id: string;                 // ID del carrito
  userId: string;             // ID del usuario
  items: {                    // Array de items en el carrito
    productId: string;        // ID del producto
    name: string;             // Nombre del producto
    quantity: number;         // Cantidad
    price: number;            // Precio unitario
    storeId: string;          // ID de la tienda
    storeName: string;        // Nombre de la tienda
    imageUrl?: string;        // URL de la imagen (opcional)
  }[];
  primaryStoreId?: string;    // ID de la tienda principal (opcional)
  primaryStoreName?: string;  // Nombre de la tienda principal (opcional)
  total: number;              // Total del carrito
  itemCount: number;          // Número total de items
  lastActivity: string;       // Fecha de última actividad
}

export class CartAPI {
  private baseURL: string;
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_PURCHASING_API_URL || 'http://localhost:3003/api/v1';
  }
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // GET USER INFO
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
  
  // Versión simplificada
  async syncCartWithBackend(cartItems: CartItem[]): Promise<CartResponse> {
    try {
      console.log('=== INICIO SINCRONIZACIÓN DEL CARRITO ===');
      
      const userId = await this.decodeJWT();
      console.log('ID de usuario:', userId);
      
      // Obtener la información de la tienda del primer producto (si existe)
      const primaryStoreId = cartItems.length > 0 ? cartItems[0].storeId : null;
      const primaryStoreName = cartItems.length > 0 ? cartItems[0].storeName : null;
      
      console.log('ID de tienda principal:', primaryStoreId);
      console.log('Nombre de tienda principal:', primaryStoreName);
      
      // Transformar los datos del carrito
      const transformedItems = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        storeId: item.storeId,
        storeName: item.storeName,
        imageUrl: item.image
      }));
      
      console.log('Items originales del carrito:', JSON.stringify(cartItems, null, 2));
      console.log('Items transformados:', JSON.stringify(transformedItems, null, 2));
      
      const payload = {
        items: transformedItems,
        primaryStoreId,
        primaryStoreName
      };
      
      console.log('Payload completo a enviar:', JSON.stringify(payload, null, 2));
      console.log('URL de la petición:', `${this.baseURL}/cart/sync`);
      
      const headers = {
        'Content-Type': 'application/json',
        'x-user-id': userId
      };
      
      console.log('Headers:', JSON.stringify(headers, null, 2));
      
      const response = await axios.post(`${this.baseURL}/cart/sync`, payload, {
        headers: headers
      });
      
      console.log('Respuesta del servidor:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('=== ERROR AL SINCRONIZAR EL CARRITO ===');
      console.error('Error completo:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      }
      throw error;
    }
  }
}

export const cartAPI = new CartAPI();















