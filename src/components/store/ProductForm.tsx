import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    tags: string[];
    deliveryOptions: {
      delivery: boolean;
      pickup: boolean;
    };
    nutritionalInfo?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const defaultData = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    tags: [],
    deliveryOptions: {
      delivery: true,
      pickup: true,
    },
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  };

  const [formData, setFormData] = useState(initialData || defaultData);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleNutritionalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        [name]: parseFloat(value)
      }
    }));
  };

  const handleDeliveryOptionChange = (option: 'delivery' | 'pickup', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: {
        ...prev.deliveryOptions,
        [option]: checked
      }
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {initialData?.id ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="bakery">Bakery</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="prepared">Prepared Foods</option>
              <option value="other">Other</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="stock">Stock (units)</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        
        <div>
          <Label>Delivery Options</Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="delivery"
                checked={formData.deliveryOptions.delivery}
                onChange={(e) => handleDeliveryOptionChange('delivery', e.target.checked)}
                className="mr-2"
              />
              <Label htmlFor="delivery">Home Delivery</Label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pickup"
                checked={formData.deliveryOptions.pickup}
                onChange={(e) => handleDeliveryOptionChange('pickup', e.target.checked)}
                className="mr-2"
              />
              <Label htmlFor="pickup">Store Pickup</Label>
            </div>
          </div>
        </div>
        
        <div>
          <Label>Tags</Label>
          <div className="flex mt-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="mr-2"
            />
            <Button type="button" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Nutritional Information (optional)</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                min="0"
                value={formData.nutritionalInfo?.calories}
                onChange={handleNutritionalInfoChange}
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                name="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo?.protein}
                onChange={handleNutritionalInfoChange}
              />
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo?.carbs}
                onChange={handleNutritionalInfoChange}
              />
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                name="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo?.fat}
                onChange={handleNutritionalInfoChange}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductForm;
