import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

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

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrdersListProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  onViewDetails,
  onUpdateStatus
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
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(order.id)}
                    className="mr-2"
                  >
                    Details
                  </Button>
                  
                  {getNextStatus(order.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(order.id, getNextStatus(order.status)!)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      {getNextStatus(order.status) === 'CONFIRMED' && 'Confirmar'}
                      {getNextStatus(order.status) === 'PREPARING' && 'Iniciar preparación'}
                      {getNextStatus(order.status) === 'READY_FOR_PICKUP' && 'Marcar como listo'}
                    </Button>
                  )}
                  
                  {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Cancelar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OrdersList;

