import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Select } from '../ui/select';

interface PurchaseOptionsProps {
  availableOptions: {
    delivery: boolean;
    pickup: boolean;
  };
  onPurchase: (quantity: number, method: 'delivery' | 'pickup') => void;
}

const PurchaseOptions: React.FC<PurchaseOptionsProps> = ({
  availableOptions,
  onPurchase
}) => {
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState<'delivery' | 'pickup'>(
    availableOptions.delivery ? 'delivery' : 'pickup'
  );

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value as 'delivery' | 'pickup');
  };

  const handlePurchase = () => {
    onPurchase(quantity, method);
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Purchase Options</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <Select value={quantity.toString()} onValueChange={handleQuantityChange}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num.toString()}>
                {num}
              </option>
            ))}
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Method</label>
          <Select 
            value={method} 
            onValueChange={handleMethodChange}
            disabled={!availableOptions.delivery && !availableOptions.pickup}
          >
            {availableOptions.delivery && (
              <option value="delivery">Home Delivery</option>
            )}
            {availableOptions.pickup && (
              <option value="pickup">Pickup at Store</option>
            )}
          </Select>
        </div>
        
        <Button 
          onClick={handlePurchase}
          className="w-full"
        >
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default PurchaseOptions;
