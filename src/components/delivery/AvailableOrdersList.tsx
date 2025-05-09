import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface AvailableOrder {
  id: string;
  store: {
    name: string;
    address: string;
  };
  customer: {
    address: string;
    distance: number; // in km
  };
  items: number; // number of items
  total: number;
  estimatedTime: number; // in minutes
}

interface AvailableOrdersListProps {
  orders: AvailableOrder[];
  onAcceptOrder: (orderId: string) => void;
}

const AvailableOrdersList: React.FC<AvailableOrdersListProps> = ({
  orders,
  onAcceptOrder
}) => {
  return (
    <div className="space-y-4">
      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <div className="text-xl mr-2">🏪</div>
                  <h3 className="font-semibold">{order.store.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Pickup:</span> {order.store.address}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Delivery:</span> {order.customer.address}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Distance:</span> 
                  <span className="flex items-center">
                    <span className="text-blue-500 mr-1">📍</span>
                    {order.customer.distance.toFixed(1)} km
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  {order.items} {order.items === 1 ? 'item' : 'items'}
                </div>
                <p className="text-lg font-bold mb-2">${order.total.toFixed(2)}</p>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="text-gray-500 mr-1">⏱️</span>
                  Est. {order.estimatedTime} min
                </div>
                <Button 
                  onClick={() => onAcceptOrder(order.id)}
                  className="w-full md:w-auto"
                >
                  Accept Order
                </Button>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-medium mb-2">No Available Orders</h3>
          <p className="text-gray-500">
            There are no orders available for delivery at the moment.
            <br />
            Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableOrdersList;
