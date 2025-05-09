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
    name: 'Frutas del Valle',
    contactPerson: 'Juan Campos',
    email: 'juan@frutasdelvalle.cl',
    phone: '(56) 9 1234 5678',
    address: 'Av. Principal 123, Santiago, Chile',
    products: ['Manzanas', 'Peras', 'Uvas'],
  },
  {
    id: '2',
    name: 'Panadería Artesanal',
    contactPerson: 'María Panadera',
    email: 'maria@panaderiaartesanal.cl',
    phone: '(56) 9 8765 4321',
    address: 'Calle Harina 456, Valparaíso, Chile',
    products: ['Harina', 'Levadura', 'Utensilios de panadería'],
  },
  {
    id: '3',
    name: 'Lácteos Orgánicos',
    contactPerson: 'Roberto Lechero',
    email: 'roberto@lacteosorganicos.cl',
    phone: '(56) 9 4567 8901',
    address: 'Camino Lechero 789, Osorno, Chile',
    products: ['Leche', 'Queso', 'Yogur', 'Mantequilla'],
  },
  {
    id: '4',
    name: 'Carnes Sustentables',
    contactPerson: 'Sara Carnicera',
    email: 'sara@carnessustentables.cl',
    phone: '(56) 9 7890 1234',
    address: 'Ruta Ganadera 321, Chillán, Chile',
    products: ['Vacuno', 'Cerdo', 'Pollo', 'Cordero'],
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
