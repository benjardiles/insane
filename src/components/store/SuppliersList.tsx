import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
}

interface SuppliersListProps {
  suppliers: Supplier[];
  onEdit: (supplierId: string) => void;
  onDelete: (supplierId: string) => void;
}

const SuppliersList: React.FC<SuppliersListProps> = ({
  suppliers,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {supplier.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {supplier.address}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {supplier.contactPerson}
                  </div>
                  <div className="text-sm text-gray-500">
                    {supplier.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    {supplier.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {supplier.products.map((product, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(supplier.id)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(supplier.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <div className="text-lg font-medium mb-2">No hay proveedores registrados</div>
                    <div className="text-sm">Comienza agregando tu primer proveedor usando el botón "Agregar Nuevo Proveedor"</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SuppliersList;
