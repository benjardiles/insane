import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

// Interfaz para el token decodificado
interface DecodedToken {
  sub: string;
}

// Función para obtener el ID del usuario actual
const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.sub;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  deliveryMethod: 'delivery' | 'pickup';
  storeId: string;
  storeName: string;
}

interface CartStore {
  items: CartItem[];
  storeId: string | null;
  storeName: string | null;
  
  // Acciones
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Obtener el ID del usuario para el nombre del storage
const userId = getUserId();
const storageKey = userId ? `cart-storage-${userId}` : 'cart-storage-guest';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      storeId: null,
      storeName: null,
      
      addItem: (item) => set((state) => {
        // Verificar si el producto es de una tienda diferente
        if (state.storeId && state.storeId !== item.storeId && state.items.length > 0) {
          // Si es de una tienda diferente, reemplazar todo el carrito
          return {
            items: [item],
            storeId: item.storeId,
            storeName: item.storeName
          };
        }
        
        // Buscar si el producto ya existe en el carrito
        const existingItemIndex = state.items.findIndex(i => i.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Si existe, actualizar la cantidad
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          
          return {
            items: updatedItems,
            storeId: state.storeId || item.storeId,
            storeName: state.storeName || item.storeName
          };
        } else {
          // Si no existe, añadir el nuevo item
          return {
            items: [...state.items, item],
            storeId: state.storeId || item.storeId,
            storeName: state.storeName || item.storeName
          };
        }
      }),
      
      removeItem: (itemId) => set((state) => {
        const updatedItems = state.items.filter(item => item.id !== itemId);
        
        // Si no quedan items, limpiar también la información de la tienda
        if (updatedItems.length === 0) {
          return {
            items: [],
            storeId: null,
            storeName: null
          };
        }
        
        return {
          items: updatedItems
        };
      }),
      
      updateQuantity: (itemId, quantity) => set((state) => {
        if (quantity < 1) return state; // No permitir cantidades menores a 1
        
        const updatedItems = state.items.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        );
        
        return {
          items: updatedItems
        };
      }),
      
      clearCart: () => set({
        items: [],
        storeId: null,
        storeName: null
      }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: storageKey, // Nombre único para localStorage basado en el ID del usuario
      skipHydration: true, // Evitar problemas de hidratación con SSR
    }
  )
);
