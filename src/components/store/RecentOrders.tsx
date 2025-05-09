import React from 'react';
import { Card } from '../ui/card';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  items: {
    name: string;
    quantity: number;
  }[];
}

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
      </div>
      <div className="divide-y">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-sm mt-1">{order.date}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {order.items.map((item, index) => (
                  <span key={index}>
                    {item.quantity}x {item.name}
                    {index < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
              <div className="flex justify-between">
                <button className="text-blue-500 text-sm hover:underline">
                  View Details
                </button>
                <p className="font-medium">${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No recent orders.
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentOrders;
