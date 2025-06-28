'use client';
import { useState, useEffect } from 'react';
import { Product, storeAPI } from '@/services/api/store';
import StoreLayout from '@/components/layouts/StoreLayout';
import { Button } from '@/components/ui/button';
import ProductsList from '@/components/store/ProductsList';
import ProductForm from '@/components/store/ProductForm';
import { useAuth } from '@/contexts/AuthContext';

// Definir las categorías disponibles
const PRODUCT_CATEGORIES = [
  'Comida Rápida',
  'Bebidas',
  'Postres',
  'Ensaladas',
  'Platos Principales',
  'Aperitivos',
  'Vegetariano',
  'Vegano',
  'Sin Gluten',
  'Otros'
];

// Función para transformar datos de producto
const transformProductData = (rawProduct: any, productId?: string): Product => {
  return {
    id: rawProduct.id || rawProduct._id || productId || Math.random().toString(),
    user_id: rawProduct.user_id,
    name: rawProduct.name || 'Producto Sin Nombre',
    description: rawProduct.description || '',
    price: rawProduct.price || 0,
    stock: rawProduct.stock || 0,
    category: rawProduct.category || 'Otros',
    tags: rawProduct.tags || [],
    deliveryOptions: rawProduct.deliveryOptions || { delivery: true, pickup: true },
    nutritionalInfo: rawProduct.nutritionalInfo || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    image: rawProduct.image || rawProduct.imageUrl || '/placeholder-product.jpg'
  };
};

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const userIdFromToken = await storeAPI.decodeJWT();
      if (!userIdFromToken || typeof userIdFromToken !== 'string') {
        throw new Error('No se pudo obtener el usuario del token');
      }
      
      setLoading(true);
      setError(null);
      
      const response = await storeAPI.getProductsByUser(userIdFromToken);
      const rawProducts = response.data || response || [];
      const transformedProducts = rawProducts.map((product: any) => transformProductData(product));
      
      setProducts(transformedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = async (productId: string) => {
    try {
      const rawProduct = await storeAPI.getProduct(productId);
      const transformedProduct = transformProductData(rawProduct, productId);
      
      setEditingProduct(transformedProduct);
      setShowForm(true);
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      alert('No se pudo cargar el producto para editar');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await storeAPI.deleteProduct(productId);
        fetchProducts();
      } catch (err) {
        console.error(`Error deleting product ${productId}:`, err);
        alert('No se pudo eliminar el producto');
      }
    }
  };

  const handleSubmitProduct = async (formData: any) => {
    try {
      const userIdFromToken = await storeAPI.decodeJWT();

      const dataToSend = {
        name: formData.name,
        user_id: userIdFromToken,
        store_name: user?.store_name || 'Tienda sin nombre',
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        deliveryOptions: {
          delivery: Boolean(formData.deliveryOptions?.delivery),
          pickup: Boolean(formData.deliveryOptions?.pickup)
        },
        ...(formData.nutritionalInfo && {
          nutritionalInfo: {
            calories: Number(formData.nutritionalInfo.calories),
            protein: Number(formData.nutritionalInfo.protein),
            carbs: Number(formData.nutritionalInfo.carbs),
            fat: Number(formData.nutritionalInfo.fat)
          }
        }),
        isActive: formData.isActive !== undefined ? Boolean(formData.isActive) : true
      };

      if (editingProduct) {
        await storeAPI.updateProduct(editingProduct.id, dataToSend);
      } else {
        await storeAPI.createProduct(dataToSend);
      }

      fetchProducts();
      setShowForm(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('No se pudo guardar el producto');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (loading && products.length === 0) return <StoreLayout><div>Cargando...</div></StoreLayout>;
  if (error) return <StoreLayout><div>Error: {error}</div></StoreLayout>;

  return (
    <StoreLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-gray-600">Gestiona los productos de tu tienda</p>
        </div>
        <Button onClick={handleAddProduct}>Añadir Nuevo Producto</Button>
      </div>

      {showForm ? (
        <ProductForm
          initialData={editingProduct as any}
          onSubmit={handleSubmitProduct}
          onCancel={handleCancelForm}
        />
      ) : (
        <ProductsList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </StoreLayout>
  );
}
