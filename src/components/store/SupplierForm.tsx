import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SupplierFormProps {
  initialData?: {
    id?: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    products: string[];
  };
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  type SupplierFormData = {
    id?: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    products: string[];
  };

  const defaultData: SupplierFormData = {
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    products: [],
  };

  const [formData, setFormData] = useState<SupplierFormData>(initialData || defaultData);
  const [productInput, setProductInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = () => {
    if (productInput.trim() && !formData.products.includes(productInput.trim())) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, productInput.trim()]
      }));
      setProductInput('');
    }
  };

  const handleRemoveProduct = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p !== product)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        {initialData?.id ? 'Edit Supplier' : 'Add New Supplier'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Supplier Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address">Address</Label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        
        <div>
          <Label>Products Supplied</Label>
          <div className="flex mt-2">
            <Input
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              placeholder="Add a product"
              className="mr-2"
            />
            <Button type="button" onClick={handleAddProduct}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.products.map((product, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {product}
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(product)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? 'Update Supplier' : 'Add Supplier'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SupplierForm;
