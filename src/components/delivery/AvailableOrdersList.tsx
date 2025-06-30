import React from 'react';
import { AvailableOrder } from '@/services/api/delivery';

interface AvailableOrdersListProps {
  orders: AvailableOrder[];
  onAcceptOrder: (orderId: string) => void;
}

const AvailableOrdersList: React.FC<AvailableOrdersListProps> = ({ 
  orders, 
  onAcceptOrder 
}) => {
  // Función para mostrar el ID de la orden
  const getOrderId = (id: string): string => {
    if (!id) return 'N/A';
    return id; // Mostrar el ID completo
  };

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div 
          key={order.id || `order-${index}`} 
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                Pedido #{getOrderId(order.id)}
              </h3>
              <p className="text-gray-600 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {order.status}
            </span>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-sm text-gray-700 mb-1">Cliente:</h4>
            <p className="text-gray-800">{order.customer?.name || 'Cliente sin nombre'}</p>
            {order.customer?.address && (
              <p className="text-gray-600 text-sm">{order.customer.address}</p>
            )}
            <p className="text-gray-600 text-sm">{order.customer?.phone || 'Sin teléfono'}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-sm text-gray-700 mb-1">Productos:</h4>
            <ul className="text-sm space-y-1">
              {(order.items || []).map((item, idx) => (
                <li key={`${order.id}-item-${idx}`} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-lg font-bold">
              Total: ${order.total.toFixed(2)}
            </div>
            <button
              onClick={() => onAcceptOrder(order.id)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Aceptar Pedido
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableOrdersList;


