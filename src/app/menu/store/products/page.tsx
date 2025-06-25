'use client';
import { useState, useEffect, use } from 'react';
import { storeAPI } from '@/services/api/store';
import StoreLayout from '@/components/layouts/StoreLayout';
import { Button } from '@/components/ui/button';
import ProductsList from '@/components/store/ProductsList';
import ProductForm from '@/components/store/ProductForm';

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

interface Product {
  id: string;
  user_id: string; // Opcional, si el producto está asociado a un usuario
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
  image: string; // Changed from imageUrl to image to match ProductsList component
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  

  const fetchProducts = async () => {
    try {
      // Obtener el userId del token JWT
      const userIdFromToken = await storeAPI.decodeJWT();
      if (!userIdFromToken || typeof userIdFromToken !== 'string') {
        throw new Error('No se pudo obtener el usuario del token');
      }
      setLoading(true);
      setError(null);
      console.log('Fetching products for user:', userIdFromToken);
      const response = await storeAPI.getProductsByUser(userIdFromToken);
      const rawProducts = response.data || response || [];

      // Transform API data to match component interface
      const transformedProducts: Product[] = rawProducts.map((product: any) => ({
        id: product.id || product._id || Math.random().toString(),
        user_id: product.user_id, // Optional, if the product is associated with a user
        name: product.name || 'Producto Sin Nombre',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category || 'Otros',
        tags: product.tags || [],
        deliveryOptions: product.deliveryOptions || { delivery: true, pickup: true },
        nutritionalInfo: product.nutritionalInfo,
        image: product.image || product.imageUrl || '/placeholder-product.jpg'
      }));

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

      // Transform API data to match form interface
      const transformedProduct: Product = {
        id: rawProduct.id || rawProduct._id || productId,
        user_id: rawProduct.user_id, // Optional, if the product is associated with a user
        name: rawProduct.name || '',
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
        // Actualizar la lista de productos
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
      user_id: userIdFromToken, // Se obtiene desde el token
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
