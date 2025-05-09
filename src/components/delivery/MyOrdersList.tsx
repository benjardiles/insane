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
  acceptedAt: string;
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
  // Group orders by status
  const activeOrders = orders.filter(order => 
    order.status !== 'delivered'
  );
  
  const completedOrders = orders.filter(order => 
    order.status === 'delivered'
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
        <div className="space-y-4">
          {activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No active orders.</p>
            </div>
          )}
        </div>
      </div>
      
      {completedOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Orders</h2>
          <div className="space-y-4">
            {completedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        </div>
      )}
      
      {orders.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
          <p className="text-gray-500">
            You haven't accepted any delivery orders yet.
            <br />
            Check the available orders to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrdersList;
