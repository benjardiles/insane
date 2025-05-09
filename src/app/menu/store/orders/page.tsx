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
      name: 'John Doe',
      address: '123 Main St, Anytown, USA',
      phone: '(555) 123-4567',
      email: 'john.doe@example.com',
    },
    date: '2023-05-15 14:30',
    total: 35.99,
    status: 'pending' as const,
    deliveryMethod: 'delivery' as const,
    items: [
      { id: 'P1', name: 'Organic Vegetables', quantity: 1, price: 12.99 },
      { id: 'P2', name: 'Fresh Bread', quantity: 2, price: 11.50 },
    ],
    notes: 'Please leave at the front door.',
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Jane Smith',
      address: '456 Oak Ave, Somewhere, USA',
      phone: '(555) 987-6543',
      email: 'jane.smith@example.com',
    },
    date: '2023-05-15 12:15',
    total: 42.50,
    status: 'processing' as const,
    deliveryMethod: 'pickup' as const,
    items: [
      { id: 'P3', name: 'Free-Range Eggs', quantity: 1, price: 4.50 },
      { id: 'P4', name: 'Organic Milk', quantity: 1, price: 6.00 },
      { id: 'P5', name: 'Gluten-Free Pasta', quantity: 2, price: 16.00 },
    ],
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Robert Johnson',
      address: '789 Pine St, Elsewhere, USA',
      phone: '(555) 456-7890',
    },
    date: '2023-05-14 16:45',
    total: 28.75,
    status: 'ready' as const,
    deliveryMethod: 'delivery' as const,
    items: [
      { id: 'P6', name: 'Grass-Fed Beef', quantity: 1, price: 18.99 },
      { id: 'P7', name: 'Organic Potatoes', quantity: 1, price: 9.76 },
    ],
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Sarah Williams',
      phone: '(555) 789-0123',
    },
    date: '2023-05-14 10:20',
    total: 15.99,
    status: 'delivered' as const,
    deliveryMethod: 'pickup' as const,
    items: [
      { id: 'P8', name: 'Vegan Chocolate Cake', quantity: 1, price: 15.99 },
    ],
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'Michael Brown',
      address: '321 Elm St, Nowhere, USA',
      phone: '(555) 321-6547',
    },
    date: '2023-05-13 15:10',
    total: 22.50,
    status: 'cancelled' as const,
    deliveryMethod: 'delivery' as const,
    items: [
      { id: 'P9', name: 'Organic Apples', quantity: 2, price: 8.00 },
      { id: 'P10', name: 'Local Honey', quantity: 1, price: 14.50 },
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
