import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

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

interface OrderCardProps {
  order: DeliveryOrder;
  onUpdateStatus: (orderId: string, newStatus: DeliveryOrder['status']) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus
}) => {
  const getStatusLabel = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'picked_up':
        return 'Picked Up';
      case 'on_way':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'on_way':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (status: DeliveryOrder['status']): DeliveryOrder['status'] | null => {
    switch (status) {
      case 'accepted':
        return 'picked_up';
      case 'picked_up':
        return 'on_way';
      case 'on_way':
        return 'delivered';
      default:
        return null;
    }
  };

  const getNextStatusLabel = (status: DeliveryOrder['status']) => {
    const nextStatus = getNextStatus(status);
    if (!nextStatus) return null;
    
    switch (nextStatus) {
      case 'picked_up':
        return 'Mark as Picked Up';
      case 'on_way':
        return 'Start Delivery';
      case 'delivered':
        return 'Complete Delivery';
      default:
        return `Mark as ${getStatusLabel(nextStatus)}`;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Order #{order.id}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Pickup</h4>
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-medium">{order.store.name}</p>
              <p className="text-sm">{order.store.address}</p>
              <p className="text-sm">{order.store.phone}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Delivery</h4>
            <div className="bg-green-50 p-3 rounded">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-sm">{order.customer.address}</p>
              <p className="text-sm">{order.customer.phone}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Items</h4>
          <ul className="bg-gray-50 p-3 rounded">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between py-1">
                <span>{item.quantity}x {item.name}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between items-center text-sm mb-4">
          <div>
            <span className="text-gray-500">Accepted at:</span> {order.acceptedAt}
          </div>
          <div>
            <span className="text-gray-500">Est. delivery:</span> {order.estimatedDelivery}
          </div>
        </div>
        
        {getNextStatus(order.status) && (
          <Button
            onClick={() => onUpdateStatus(order.id, getNextStatus(order.status)!)}
            className="w-full"
          >
            {getNextStatusLabel(order.status)}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;
