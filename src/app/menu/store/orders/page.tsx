'use client';

import React, { useState } from 'react';
import StoreLayout from '@/components/layouts/StoreLayout';
import OrdersList from '@/components/store/OrdersList';
import OrderDetail from '@/components/store/OrderDetail';

// Mock data for demonstration
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    customer: {
      name: 'Juan Pérez',
      address: 'Av. Providencia 1234, Santiago, Chile',
      phone: '+56 9 1234 5678',
      email: 'juan.perez@example.com',
    },
    date: '2023-05-15 14:30',
    total: 35000,
    status: 'pending' as const,
    deliveryMethod: 'delivery' as const,
    items: [
      { id: 'P1', name: 'Palta Hass', quantity: 1, price: 12000 },
      { id: 'P2', name: 'Pan Amasado', quantity: 2, price: 11500 },
    ],
    notes: 'Por favor dejar en la portería.',
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'María González',
      address: 'Calle Los Aromos 456, Viña del Mar, Chile',
      phone: '+56 9 8765 4321',
      email: 'maria.gonzalez@example.com',
    },
    date: '2023-05-15 12:15',
    total: 42500,
    status: 'processing' as const,
    deliveryMethod: 'pickup' as const,
    items: [
      { id: 'P3', name: 'Huevos de Campo', quantity: 1, price: 4500 },
      { id: 'P4', name: 'Leche Orgánica', quantity: 1, price: 6000 },
      { id: 'P5', name: 'Pasta Sin Gluten', quantity: 2, price: 16000 },
    ],
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Roberto López',
      address: 'Av. Las Condes 789, Santiago, Chile',
      phone: '+56 9 4567 8901',
    },
    date: '2023-05-14 16:45',
    total: 28750,
    status: 'ready' as const,
    deliveryMethod: 'delivery' as const,
    items: [
      { id: 'P6', name: 'Carne de Vacuno', quantity: 1, price: 18990 },
      { id: 'P7', name: 'Papas Orgánicas', quantity: 1, price: 9750 },
    ],
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Sara Fernández',
      phone: '+56 9 7890 1234',
    },
    date: '2023-05-14 10:20',
    total: 15990,
    status: 'delivered' as const,
    deliveryMethod: 'pickup' as const,
    items: [
      { id: 'P8', name: 'Torta Vegana de Chocolate', quantity: 1, price: 15990 },
    ],
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'Miguel Rojas',
      address: 'Calle Principal 321, Valparaíso, Chile',
      phone: '+56 9 3216 5478',
    },
    date: '2023-05-13 15:10',
    total: 22500,
    status: 'cancelled' as const,
    deliveryMethod: 'delivery' as const,
    items: [
      { id: 'P9', name: 'Manzanas Orgánicas', quantity: 2, price: 8000 },
      { id: 'P10', name: 'Miel Artesanal', quantity: 1, price: 14500 },
    ],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleViewDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In a real app, you would call an API to update the order status
    // For now, we'll just update our mock data
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
  };

  const handleUpdateSelectedOrderStatus = (newStatus: string) => {
    if (selectedOrder) {
      handleUpdateStatus(selectedOrder.id, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  return (
    <StoreLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-600">Manage your store's orders</p>
      </div>

      {selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          onUpdateStatus={handleUpdateSelectedOrderStatus}
          onBack={handleBackToList}
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
