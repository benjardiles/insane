import React from 'react';
import { Button } from '../ui/button';

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: 'accepted' | 'picked_up' | 'on_way' | 'delivered';
  onUpdateStatus: (orderId: string, newStatus: 'accepted' | 'picked_up' | 'on_way' | 'delivered') => void;
}

const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  orderId,
  currentStatus,
  onUpdateStatus
}) => {
  const getNextStatus = (): 'picked_up' | 'on_way' | 'delivered' | null => {
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

  const getStatusLabel = (status: 'accepted' | 'picked_up' | 'on_way' | 'delivered') => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'picked_up':
        return 'Picked Up';
      case 'on_way':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
    }
  };

  const getNextActionLabel = () => {
    const nextStatus = getNextStatus();
    if (!nextStatus) return null;
    
    switch (nextStatus) {
      case 'picked_up':
        return 'Mark as Picked Up';
      case 'on_way':
        return 'Start Delivery';
      case 'delivered':
        return 'Complete Delivery';
    }
  };

  const nextStatus = getNextStatus();
  
  if (!nextStatus) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">Current Status</h3>
          <p className="text-gray-600">{getStatusLabel(currentStatus)}</p>
        </div>
        <div>
          <h3 className="font-medium">Next Status</h3>
          <p className="text-gray-600">{getStatusLabel(nextStatus)}</p>
        </div>
      </div>
      
      <Button
        onClick={() => onUpdateStatus(orderId, nextStatus)}
        className="w-full"
      >
        {getNextActionLabel()}
      </Button>
    </div>
  );
};

export default OrderStatusUpdate;
