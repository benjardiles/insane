'use client';

import React, { useState, useEffect } from 'react';
import DeliveryLayout from '@/components/layouts/DeliveryLayout';
import MyOrdersList from '@/components/delivery/MyOrdersList';
import { Loader2 } from 'lucide-react';
import { deliveryAPI } from '@/services/api/delivery';

// Interfaces para los datos
interface OrderItem {
  name: string;
  quantity: number;
}

interface DeliveryOrder {
  id: string;
  _id: string;
  store: {
    name: string;
    address: string;
    phone: string;
  };
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  items: OrderItem[];
  status: 'accepted' | 'picked_up' | 'on_way' | 'delivered';
  acceptedAt: string;
  estimatedDelivery: string;
}

export default function MyOrdersPage() {
  const [myOrders, setMyOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para mapear estados del backend a estados de la UI
  const mapOrderStatus = (backendStatus: string): 'accepted' | 'picked_up' | 'on_way' | 'delivered' => {
    switch (backendStatus) {
      case 'READY_FOR_PICKUP':
        return 'accepted';
      case 'PICKED_UP':
        return 'picked_up';
      case 'IN_TRANSIT':
        return 'on_way';
      case 'DELIVERED':
        return 'delivered';
      default:
        return 'accepted';
    }
  };

  // Función para obtener las órdenes asignadas al repartidor
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      
      // Usar el método getMyAssignedOrders de deliveryAPI
      const response = await deliveryAPI.getMyAssignedOrders();
      
      console.log('My orders response:', response);
      
      // Transformar los datos al formato esperado por el componente
      const transformedOrders = response.data.map((order: any) => ({
        id: order.id || order._id,
        store: {
          name: order.storeName || order.items[0]?.storeName || 'Tienda',
          address: order.storeAddress || 'Dirección de la tienda',
          phone: order.storePhone || 'Teléfono de la tienda',
        },
        customer: {
          name: order.customer?.name || 'Cliente',
          address: order.customer?.address || 'Dirección del cliente',
          phone: order.customer?.phone || 'Teléfono del cliente',
        },
        items: order.items?.map((item: any) => ({
          name: item.name,
          quantity: item.quantity
        })) || [],
        status: mapOrderStatus(order.status),
        acceptedAt: new Date(order.createdAt).toLocaleString(),
        estimatedDelivery: new Date(new Date(order.createdAt).getTime() + 30*60000).toLocaleString(),
      }));
      
      setMyOrders(transformedOrders);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching my orders:', err);
      setError('No se pudieron cargar tus órdenes. Por favor, inténtalo de nuevo.');
      if (err.response) {
        console.error('Error response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: 'accepted' | 'picked_up' | 'on_way' | 'delivered') => {
    try {
      // Mapear el estado de la UI al estado del backend
      let backendStatus = '';
      switch (newStatus) {
        case 'picked_up':
          backendStatus = 'PICKED_UP';
          break;
        case 'on_way':
          backendStatus = 'IN_TRANSIT';
          break;
        case 'delivered':
          backendStatus = 'DELIVERED';
          break;
        default:
          backendStatus = 'READY_FOR_PICKUP';
      }
      
      // Si el nuevo estado es 'delivered', usar el método específico
      if (newStatus === 'delivered') {
        await deliveryAPI.markOrderAsDelivered(orderId);
      } else if (newStatus === 'on_way') {
        // Si el nuevo estado es 'on_way', usar el método específico para marcar como en tránsito
        await deliveryAPI.markOrderAsInTransit(orderId);
      } else {
        // Para otros estados, usar el método de actualización de estado de la API
        await deliveryAPI.updateOrderStatus(orderId, backendStatus);
      }
      
      // Actualizar el estado local
      setMyOrders(myOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
    } catch (err: any) {
      console.error('Error updating order status:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
      }
    }
  };

  if (loading && myOrders.length === 0) {
    return (
      <DeliveryLayout>
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="mt-4">Cargando tus órdenes...</span>
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mis Órdenes</h1>
        <p className="text-gray-600">Gestiona tus pedidos de entrega</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={fetchMyOrders} 
            className="ml-4 px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {myOrders.length === 0 && !loading ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No tienes órdenes asignadas</p>
          <p className="text-gray-500 mt-2">Revisa las órdenes disponibles para comenzar a entregar</p>
        </div>
      ) : (
        <MyOrdersList
          orders={myOrders}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </DeliveryLayout>
  );
}





