'use client';

import React, { useState } from 'react';
import DeliveryLayout from '@/components/layouts/DeliveryLayout';
import MyOrdersList from '@/components/delivery/MyOrdersList';

// Mock data for demonstration
const MOCK_MY_ORDERS = [
  {
    id: 'ORD-004',
    store: {
      name: 'Green Market',
      address: '123 Main St, Anytown, USA',
      phone: '(555) 123-4567',
    },
    customer: {
      name: 'John Doe',
      address: '456 Oak Ave, Anytown, USA',
      phone: '(555) 987-6543',
    },
    items: [
      { name: 'Organic Vegetables', quantity: 1 },
      { name: 'Fresh Bread', quantity: 2 },
    ],
    status: 'accepted' as const,
    acceptedAt: '2023-05-15 14:45',
    estimatedDelivery: '2023-05-15 15:15',
  },
  {
    id: 'ORD-005',
    store: {
      name: 'Local Bakery',
      address: '789 Pine St, Anytown, USA',
      phone: '(555) 456-7890',
    },
    customer: {
      name: 'Jane Smith',
      address: '321 Elm St, Anytown, USA',
      phone: '(555) 789-0123',
    },
    items: [
      { name: 'Artisan Bread', quantity: 1 },
      { name: 'Chocolate Croissants', quantity: 3 },
    ],
    status: 'picked_up' as const,
    acceptedAt: '2023-05-15 13:30',
    estimatedDelivery: '2023-05-15 14:00',
  },
  {
    id: 'ORD-006',
    store: {
      name: 'Butcher Shop',
      address: '222 Birch Rd, Anytown, USA',
      phone: '(555) 234-5678',
    },
    customer: {
      name: 'Robert Johnson',
      address: '888 Walnut Dr, Anytown, USA',
      phone: '(555) 345-6789',
    },
    items: [
      { name: 'Grass-Fed Beef', quantity: 1 },
      { name: 'Free-Range Chicken', quantity: 1 },
    ],
    status: 'on_way' as const,
    acceptedAt: '2023-05-15 12:15',
    estimatedDelivery: '2023-05-15 12:45',
  },
  {
    id: 'ORD-007',
    store: {
      name: 'Farm Fresh',
      address: '555 Maple Ave, Anytown, USA',
      phone: '(555) 567-8901',
    },
    customer: {
      name: 'Sarah Williams',
      address: '777 Cedar Rd, Anytown, USA',
      phone: '(555) 678-9012',
    },
    items: [
      { name: 'Free-Range Eggs', quantity: 1 },
      { name: 'Organic Milk', quantity: 1 },
      { name: 'Local Honey', quantity: 1 },
    ],
    status: 'delivered' as const,
    acceptedAt: '2023-05-15 10:30',
    estimatedDelivery: '2023-05-15 11:00',
  },
];

export default function MyOrdersPage() {
  const [myOrders, setMyOrders] = useState(MOCK_MY_ORDERS);

  const handleUpdateStatus = (orderId: string, newStatus: 'accepted' | 'picked_up' | 'on_way' | 'delivered') => {
    // In a real app, you would call an API to update the order status
    // For now, we'll just update our mock data
    setMyOrders(myOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <DeliveryLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-600">Manage your delivery orders</p>
      </div>

      <MyOrdersList
        orders={myOrders}
        onUpdateStatus={handleUpdateStatus}
      />
    </DeliveryLayout>
  );
}
