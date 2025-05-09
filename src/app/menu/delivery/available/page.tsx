'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeliveryLayout from '@/components/layouts/DeliveryLayout';
import AvailableOrdersList from '@/components/delivery/AvailableOrdersList';

// Mock data for demonstration
const MOCK_AVAILABLE_ORDERS = [
  {
    id: 'ORD-001',
    store: {
      name: 'Green Market',
      address: '123 Main St, Anytown, USA',
    },
    customer: {
      address: '456 Oak Ave, Anytown, USA',
      distance: 2.3,
    },
    items: 3,
    total: 35.99,
    estimatedTime: 25,
  },
  {
    id: 'ORD-002',
    store: {
      name: 'Local Bakery',
      address: '789 Pine St, Anytown, USA',
    },
    customer: {
      address: '321 Elm St, Anytown, USA',
      distance: 1.8,
    },
    items: 2,
    total: 18.50,
    estimatedTime: 20,
  },
  {
    id: 'ORD-003',
    store: {
      name: 'Farm Fresh',
      address: '555 Maple Ave, Anytown, USA',
    },
    customer: {
      address: '777 Cedar Rd, Anytown, USA',
      distance: 3.5,
    },
    items: 5,
    total: 42.75,
    estimatedTime: 30,
  },
];

export default function AvailableOrdersPage() {
  const router = useRouter();
  const [availableOrders, setAvailableOrders] = useState(MOCK_AVAILABLE_ORDERS);

  const handleAcceptOrder = (orderId: string) => {
    // In a real app, you would call an API to accept the order
    // For now, we'll just remove it from the available orders
    setAvailableOrders(availableOrders.filter(order => order.id !== orderId));
    
    // Redirect to my orders page
    router.push('/menu/delivery/my-orders');
  };

  return (
    <DeliveryLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Available Orders</h1>
        <p className="text-gray-600">Orders available for delivery in your area</p>
      </div>

      <AvailableOrdersList
        orders={availableOrders}
        onAcceptOrder={handleAcceptOrder}
      />
    </DeliveryLayout>
  );
}
