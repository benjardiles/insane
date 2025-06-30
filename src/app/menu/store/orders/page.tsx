'use client';
import { useState, useEffect } from 'react';
import StoreLayout from '@/components/layouts/StoreLayout';
import OrdersList from '@/components/store/OrdersList';
import OrderDetails from '@/components/store/OrderDetail';
import { storeAPI } from '@/services/api/store';
import { ordersAPI } from '@/services/api/orders';
import { Loader2 } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: {
    name: string;
    address?: string;
    phone: string;
    email?: string;
  };
  date: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  deliveryMethod: 'delivery' | 'pickup';
  items: OrderItem[];
  notes?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);

  // Obtener el ID de la tienda al cargar la página
  useEffect(() => {
    const getStoreId = async () => {
      try {
        const id = await storeAPI.decodeJWT();
        setStoreId(id);
      } catch (err) {
        console.error('Error obteniendo ID de tienda:', err);
        setError('No se pudo identificar la tienda');
      }
    };
    
    getStoreId();
  }, []);

  const fetchOrders = async (status = '') => {
    if (!storeId) return;
    
    try {
      setLoading(true);
      const response = await ordersAPI.getOrdersByStoreId(storeId, 1, 50, status);
      const rawOrders = response.data || [];

      const transformedOrders: Order[] = rawOrders.map((order: any) => ({
        id: order.id || order._id || Math.random().toString(),
        customer: {
          name: order.customerName || order.customer?.name || 'Cliente Desconocido',
          phone: order.customerPhone || order.customer?.phone || 'N/A',
          email: order.customerEmail || order.customer?.email,
          address: order.customerAddress || order.customer?.address
        },
        date: order.createdAt || order.date || new Date().toISOString().split('T')[0],
        total: order.total || 0,
        status: order.status || 'PENDING',
        deliveryMethod: order.deliveryMethod || 'pickup',
        items: order.items?.map((item: any) => ({
          id: item.id || item._id || Math.random().toString(),
          name: item.name || item.productName || 'Producto',
          quantity: item.quantity || 1,
          price: item.price || 0
        })) || [],
        notes: order.notes
      }));

      setOrders(transformedOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchOrders(statusFilter);
    }
  }, [statusFilter, storeId]);

  const handleViewDetails = async (orderId: string | number) => {
    try {
      const rawOrder = await storeAPI.getOrder(String(orderId));

      const transformedOrder: Order = {
        id: rawOrder.id || rawOrder._id || String(orderId),
        customer: {
          name: rawOrder.customerName || rawOrder.customer?.name || 'Cliente Desconocido',
          phone: rawOrder.customerPhone || rawOrder.customer?.phone || 'N/A',
          email: rawOrder.customerEmail || rawOrder.customer?.email,
          address: rawOrder.customerAddress || rawOrder.customer?.address
        },
        date: rawOrder.createdAt || rawOrder.date || new Date().toISOString().split('T')[0],
        total: rawOrder.total || 0,
        status: rawOrder.status || 'PENDING',
        deliveryMethod: rawOrder.deliveryMethod || 'pickup',
        items: rawOrder.items?.map((item: any) => ({
          id: item.id || item._id || Math.random().toString(),
          name: item.name || item.productName || 'Producto',
          quantity: item.quantity || 1,
          price: item.price || 0
        })) || [],
        notes: rawOrder.notes
      };

      setSelectedOrder(transformedOrder);
    } catch (err) {
      console.error(`Error fetching order ${orderId}:`, err);
      alert('No se pudo cargar el detalle del pedido');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      console.log("no entra")
      const r=await storeAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders(statusFilter);
      // Si hay un pedido seleccionado, actualizar su estado
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
    } catch (err) {
      console.error(`Error updating order ${orderId} status:`, err);
      alert('No se pudo actualizar el estado del pedido');
    }
  };

  // Handler específico para OrderDetails que solo recibe el status
  const handleUpdateSelectedOrderStatus = async (newStatus: Order['status']) => {
    if (selectedOrder) {
      await handleUpdateStatus(selectedOrder.id, newStatus);
    }
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading && orders.length === 0) {
    return (
      <StoreLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Cargando pedidos...</span>
        </div>
      </StoreLayout>
    );
  }
  
  if (error) return <StoreLayout><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div></StoreLayout>;

  return (
    <StoreLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="text-gray-600">Gestiona los pedidos de tu tienda</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por estado:
        </label>
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendientes</option>
          <option value="CONFIRMED">Confirmados</option>
          <option value="PREPARING">En preparación</option>
          <option value="READY_FOR_PICKUP">Listos para entrega</option>
          <option value="PICKED_UP">Recogidos</option>
          <option value="IN_TRANSIT">En tránsito</option>
          <option value="DELIVERED">Entregados</option>
          <option value="CANCELLED">Cancelados</option>
        </select>
      </div>

      {selectedOrder ? (
        <OrderDetails
          order={selectedOrder}
          onUpdateStatus={handleUpdateSelectedOrderStatus}
          onBack={handleCloseDetails}
        />
      ) : (
        <OrdersList 
          orders={orders} 
          onViewDetails={handleViewDetails}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </StoreLayout>
  );
}
