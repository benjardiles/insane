import React from 'react';
import OrderCard from './OrderCard';

interface DeliveryOrder {
  id: string;
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
  items: {
    name: string;
    quantity: number;
  }[];
  status: 'accepted' | 'picked_up' | 'on_way' | 'delivered';
  acceptedAt?: string;
  createdAt?: string;
  estimatedDelivery: string;
}

interface MyOrdersListProps {
  orders: DeliveryOrder[];
  onUpdateStatus: (orderId: string, newStatus: DeliveryOrder['status']) => void;
}

const MyOrdersList: React.FC<MyOrdersListProps> = ({ 
  orders, 
  onUpdateStatus 
}) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No active orders found.</p>
        <p className="text-sm text-gray-400 mt-1">Check the available orders section to accept new deliveries.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div key={order.id || `order-${index}`}>
          <OrderCard 
            order={order} 
            onUpdateStatus={onUpdateStatus} 
          />
        </div>
      ))}
    </div>
  );
};

export default MyOrdersList;








