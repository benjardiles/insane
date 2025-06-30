import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: {
    name: string;
    address?: string;
    phone: string;
    email?: string;
  };
  date: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  deliveryMethod: 'delivery' | 'pickup';
  items: OrderItem[];
  notes?: string;
}

interface OrderDetailProps {
  order: Order;
  onUpdateStatus: (status: Order['status']) => void;
  onBack: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  onUpdateStatus,
  onBack
}) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
        return 'bg-indigo-100 text-indigo-800';
      case 'READY_FOR_PICKUP':
        return 'bg-purple-100 text-purple-800';
      case 'PICKED_UP':
        return 'bg-teal-100 text-teal-800';
      case 'IN_TRANSIT':
        return 'bg-orange-100 text-orange-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (status: Order['status']): Order['status'] | null => {
    switch (status) {
      case 'PENDING':
        return 'CONFIRMED';
      case 'CONFIRMED':
        return 'PREPARING';
      case 'PREPARING':
        return 'READY_FOR_PICKUP';
      // La tienda no puede cambiar a estados posteriores a READY_FOR_PICKUP
      // ya que esos son manejados por el repartidor
      default:
        return null;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'PREPARING':
        return 'En preparación';
      case 'READY_FOR_PICKUP':
        return 'Listo para entrega';
      case 'PICKED_UP':
        return 'Recogido';
      case 'IN_TRANSIT':
        return 'En tránsito';
      case 'DELIVERED':
        return 'Entregado';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="text-blue-500 hover:underline flex items-center"
        >
          ← Back to Orders
        </button>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
          
          {getNextStatus(order.status) && (
            <Button 
              onClick={() => onUpdateStatus(getNextStatus(order.status)!)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {getNextStatus(order.status) === 'CONFIRMED' && 'Confirmar pedido'}
              {getNextStatus(order.status) === 'PREPARING' && 'Iniciar preparación'}
              {getNextStatus(order.status) === 'READY_FOR_PICKUP' && 'Marcar como listo para entrega'}
            </Button>
          )}
          
          {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
            <Button 
              onClick={() => onUpdateStatus('CANCELLED')}
              variant="outline"
              className="text-red-600 hover:bg-red-50"
            >
              Cancelar pedido
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Method:</span>
              <span>{order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Store Pickup'}</span>
            </div>
            {order.notes && (
              <div>
                <span className="text-gray-600 block mb-1">Notes:</span>
                <p className="text-sm bg-gray-50 p-2 rounded">{order.notes}</p>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span>{order.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span>{order.customer.phone}</span>
            </div>
            {order.customer.email && (
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{order.customer.email}</span>
              </div>
            )}
            {order.customer.address && (
              <div>
                <span className="text-gray-600 block mb-1">Address:</span>
                <p className="text-sm">{order.customer.address}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{item.name}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm">{item.quantity}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-medium">
                  Total
                </td>
                <td className="px-4 py-3 text-right font-bold">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetail;

