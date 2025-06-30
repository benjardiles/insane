import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface DeliveryOrder {
  id: string;  // Ahora id es requerido, no opcional
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

interface OrderCardProps {
  order: DeliveryOrder;
  onUpdateStatus: (orderId: string, newStatus: DeliveryOrder['status']) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus }) => {
  // Función para obtener el ID de la orden para mostrar
  const getOrderId = (id: string): string => {
    if (!id) return 'N/A';
    return id; // Mostrar el ID completo
  };

  // Función para obtener el siguiente estado
  const getNextStatus = (currentStatus: DeliveryOrder['status']): DeliveryOrder['status'] | null => {
    switch (currentStatus) {
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

  // Función para obtener la etiqueta del siguiente estado
  const getNextStatusLabel = (currentStatus: DeliveryOrder['status']): string => {
    switch (currentStatus) {
      case 'accepted':
        return 'Mark as Picked Up';
      case 'picked_up':
        return 'Start Delivery';
      case 'on_way':
        return 'Mark as Delivered';
      default:
        return '';
    }
  };

  // Función para obtener la etiqueta del estado actual
  const getStatusLabel = (status: DeliveryOrder['status']): string => {
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

  // Función para obtener el color del estado
  const getStatusColor = (status: DeliveryOrder['status']): string => {
    switch (status) {
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_way':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">
            Order #{getOrderId(order.id)}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Pickup from:</h4>
          <p className="font-medium">{order.store.name}</p>
          <p className="text-sm text-gray-600">{order.store.address}</p>
          <p className="text-sm text-gray-600">{order.store.phone}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Deliver to:</h4>
          <p className="font-medium">{order.customer.name}</p>
          <p className="text-sm text-gray-600">{order.customer.address}</p>
          <p className="text-sm text-gray-600">{order.customer.phone}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Items:</h4>
          <ul className="list-disc list-inside text-sm">
            {order.items.map((item, index) => (
              <li key={index}>{item.quantity}x {item.name}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Estimated delivery:</h4>
          <p>{new Date(order.estimatedDelivery).toLocaleString()}</p>
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














