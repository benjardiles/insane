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
      name: 'Mercado Verde',
      address: 'Av. Providencia 1234, Santiago, Chile',
    },
    customer: {
      address: 'Calle Los Olmos 456, Ñuñoa, Santiago, Chile',
      distance: 2.3,
    },
    items: 3,
    total: 28990,
    estimatedTime: 25,
  },
  {
    id: 'ORD-002',
    store: {
      name: 'Panadería Local',
      address: 'Calle Las Rosas 789, La Florida, Santiago, Chile',
    },
    customer: {
      address: 'Av. Los Álamos 321, Puente Alto, Santiago, Chile',
      distance: 1.8,
    },
    items: 2,
    total: 14500,
    estimatedTime: 20,
  },
  {
    id: 'ORD-003',
    store: {
      name: 'Granja Fresca',
      address: 'Camino El Bosque 555, Maipú, Santiago, Chile',
    },
    customer: {
      address: 'Calle Los Pinos 777, Las Condes, Santiago, Chile',
      distance: 3.5,
    },
    items: 5,
    total: 35990,
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
