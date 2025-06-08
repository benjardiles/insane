import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

interface ProductsListProps {
  products: Product[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
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
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${product.price.toLocaleString('es-CL')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product.id)}
                    className="mr-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 hover:border-red-300"
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <div className="text-lg font-medium mb-2">No hay productos registrados</div>
                    <div className="text-sm">Comienza agregando tu primer producto usando el botón "Añadir Nuevo Producto"</div>
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

export default ProductsList;
