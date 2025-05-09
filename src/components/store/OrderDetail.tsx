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
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (status: Order['status']): Order['status'] | null => {
    switch (status) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return null;
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
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          
          {getNextStatus(order.status) && (
            <Button
              onClick={() => onUpdateStatus(getNextStatus(order.status)!)}
            >
              {getNextStatus(order.status) === 'processing' && 'Process Order'}
              {getNextStatus(order.status) === 'ready' && 'Mark as Ready'}
              {getNextStatus(order.status) === 'delivered' && 'Mark as Delivered'}
            </Button>
          )}
          
          {order.status === 'pending' && (
            <Button
              variant="outline"
              onClick={() => onUpdateStatus('cancelled')}
              className="text-red-600 hover:text-red-800"
            >
              Cancel Order
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
