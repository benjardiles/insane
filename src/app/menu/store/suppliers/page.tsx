'use client';

import React, { useState } from 'react';
import StoreLayout from '@/components/layouts/StoreLayout';
import SuppliersList from '@/components/store/SuppliersList';
import SupplierForm from '@/components/store/SupplierForm';
import { Button } from '@/components/ui/button';

// Mock data for demonstration
const MOCK_SUPPLIERS = [
  {
    id: '1',
    name: 'Farm Fresh Produce',
    contactPerson: 'John Farmer',
    email: 'john@farmfresh.com',
    phone: '(555) 123-4567',
    address: '123 Rural Road, Farmville, USA',
    products: ['Vegetables', 'Fruits', 'Herbs'],
  },
  {
    id: '2',
    name: 'Artisan Bakery Supplies',
    contactPerson: 'Maria Baker',
    email: 'maria@artisanbakery.com',
    phone: '(555) 987-6543',
    address: '456 Flour Street, Breadtown, USA',
    products: ['Flour', 'Yeast', 'Baking Supplies'],
  },
  {
    id: '3',
    name: 'Organic Dairy Co-op',
    contactPerson: 'Robert Milkman',
    email: 'robert@organicdairy.com',
    phone: '(555) 456-7890',
    address: '789 Pasture Lane, Dairyville, USA',
    products: ['Milk', 'Cheese', 'Yogurt', 'Butter'],
  },
  {
    id: '4',
    name: 'Sustainable Meats',
    contactPerson: 'Sarah Butcher',
    email: 'sarah@sustainablemeats.com',
    phone: '(555) 789-0123',
    address: '321 Grazing Road, Ranchtown, USA',
    products: ['Beef', 'Pork', 'Chicken', 'Lamb'],
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEditSupplier = (supplierId: string) => {
    // In a real app, you would fetch the supplier details from the API
    // For now, we'll just find it in our mock data
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setEditingSupplier(supplier);
      setShowForm(true);
    }
  };

  const handleDeleteSupplier = (supplierId: string) => {
    // In a real app, you would call an API to delete the supplier
    // For now, we'll just filter it out of our mock data
    if (confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
    }
  };

  const handleSubmitSupplier = (formData: any) => {
    // In a real app, you would call an API to save the supplier
    // For now, we'll just update our mock data
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id ? { ...s, ...formData } : s
      ));
    } else {
      // Add new supplier
      const newSupplier = {
        ...formData,
        id: `${suppliers.length + 1}`,
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <StoreLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-gray-600">Manage your store's suppliers</p>
        </div>
        <Button onClick={handleAddSupplier}>Add New Supplier</Button>
      </div>

      {showForm ? (
        <SupplierForm
          initialData={editingSupplier}
          onSubmit={handleSubmitSupplier}
          onCancel={handleCancelForm}
        />
      ) : (
        <SuppliersList
          suppliers={suppliers}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
        />
      )}
    </StoreLayout>
  );
}
