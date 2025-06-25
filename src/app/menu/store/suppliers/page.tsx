'use client';
import { useState, useEffect } from 'react';
import { storeAPI } from '@/services/api/store';
import StoreLayout from '@/components/layouts/StoreLayout';
import { Button } from '@/components/ui/button';
import SuppliersList from '@/components/store/SuppliersList';
import SupplierForm from '@/components/store/SupplierForm';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
}

type SupplierFormData = Omit<Supplier, 'id'>;

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchSuppliers = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Obtener el ID del usuario actual
    const userId = await storeAPI.decodeJWT();
    
    // Si tenemos un userId, obtener los proveedores de ese usuario específico
    let response;
    if (userId) {
      response = await storeAPI.getSuppliersByUser(userId);
    } else {
      // Fallback: usar el método normal que ahora filtrará por el usuario del token
      response = await storeAPI.getSuppliers();
    }
    
    const rawSuppliers = response.data || response || [];

    // Transform API data to match component interface
    const transformedSuppliers: Supplier[] = rawSuppliers.map((supplier: any) => ({
      id: supplier.id || supplier._id || Math.random().toString(),
      name: supplier.name || 'Proveedor Sin Nombre',
      contactPerson: supplier.contactPerson || supplier.contact || 'N/A',
      email: supplier.email || 'N/A',
      phone: supplier.phone || 'N/A',
      address: supplier.address || 'N/A',
      products: supplier.products || []
    }));

    setSuppliers(transformedSuppliers);
  } catch (err: any) {
    console.error('Error fetching suppliers:', err);
    setError(err.message || 'No se pudieron cargar los proveedores');
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    // Try to fetch suppliers but don't block the UI if it fails
    fetchSuppliers().catch(() => {
      // Error is already handled in fetchSuppliers
      console.log('Initial supplier fetch failed, but UI remains functional');
    });
  }, []);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEditSupplier = async (supplierId: string) => {
    try {
      const supplier = suppliers.find(s => s.id === supplierId);
      if (supplier) {
        setEditingSupplier(supplier);
        setShowForm(true);
      }
    } catch (err: any) {
      console.error('Error editing supplier:', err);
      alert('No se pudo cargar el proveedor para editar');
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        await storeAPI.deleteSupplier(supplierId);
        // Remove from local state
        setSuppliers(suppliers.filter(s => s.id !== supplierId));
      } catch (err: any) {
        console.error('Error deleting supplier:', err);
        alert('No se pudo eliminar el proveedor');
      }
    }
  };

const handleSubmitSupplier = async (formData: SupplierFormData) => {
  try {
    // Obtener el ID del usuario actual
    const userId = await storeAPI.decodeJWT();
    
    // Añadir el user_id al formData
    const dataToSend = {
      ...formData,
      user_id: userId
    };
    
    if (editingSupplier) {
      // Update existing supplier
      await storeAPI.updateSupplier(editingSupplier.id, dataToSend);
      setSuppliers(suppliers.map(s =>
        s.id === editingSupplier.id ? { ...s, ...formData } : s
      ));
    } else {
      // Add new supplier
      const newSupplier = await storeAPI.createSupplier(dataToSend);
      const transformedSupplier: Supplier = {
        id: newSupplier.id || newSupplier._id || Math.random().toString(),
        name: newSupplier.name || formData.name,
        contactPerson: newSupplier.contactPerson || formData.contactPerson,
        email: newSupplier.email || formData.email,
        phone: newSupplier.phone || formData.phone,
        address: newSupplier.address || formData.address,
        products: newSupplier.products || formData.products
      };
      setSuppliers([...suppliers, transformedSupplier]);
    }
    setShowForm(false);
    setEditingSupplier(null);
  } catch (err: any) {
    console.error('Error saving supplier:', err);
    alert('No se pudo guardar el proveedor');
  }
};
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  // Removed blocking loading and error states - now we show them inline but allow functionality

  return (
    <StoreLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-gray-600">Gestiona los proveedores de tu tienda</p>
        </div>
        <Button onClick={handleAddSupplier}>Agregar Nuevo Proveedor</Button>
      </div>

      {/* Show error notification but don't block functionality */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-red-800">Error al cargar proveedores</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchSuppliers()}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
              <button
                onClick={() => setError(null)}
                className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show loading state only for the content area */}
      {loading && !showForm ? (
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
          <div className="text-lg text-gray-600">Cargando proveedores...</div>
        </div>
      ) : showForm ? (
        <SupplierForm
          initialData={editingSupplier || undefined}
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
