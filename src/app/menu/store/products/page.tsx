'use client';

import React, { useState } from 'react';
import StoreLayout from '@/components/layouts/StoreLayout';
import ProductsList from '@/components/store/ProductsList';
import ProductForm from '@/components/store/ProductForm';
import { Button } from '@/components/ui/button';

// Mock data for demonstration
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Organic Vegetables',
    price: 12.99,
    stock: 25,
    category: 'vegetables',
    image: '/images/products/vegetables.jpg',
  },
  {
    id: '2',
    name: 'Artisan Bread',
    price: 5.99,
    stock: 15,
    category: 'bakery',
    image: '/images/products/bread.jpg',
  },
  {
    id: '3',
    name: 'Free-Range Eggs',
    price: 4.50,
    stock: 30,
    category: 'dairy',
    image: '/images/products/eggs.jpg',
  },
  {
    id: '4',
    name: 'Grass-Fed Beef',
    price: 18.99,
    stock: 8,
    category: 'meat',
    image: '/images/products/beef.jpg',
  },
  {
    id: '5',
    name: 'Gluten-Free Pasta',
    price: 6.99,
    stock: 20,
    category: 'prepared',
    image: '/images/products/pasta.jpg',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (productId: string) => {
    // In a real app, you would fetch the product details from the API
    // For now, we'll just find it in our mock data
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProduct({
        ...product,
        description: 'Sample description for this product.',
        tags: ['organic', 'local'],
        deliveryOptions: {
          delivery: true,
          pickup: true,
        },
        nutritionalInfo: {
          calories: 120,
          protein: 3,
          carbs: 20,
          fat: 1,
        },
      });
      setShowForm(true);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    // In a real app, you would call an API to delete the product
    // For now, we'll just filter it out of our mock data
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSubmitProduct = (formData: any) => {
    // In a real app, you would call an API to save the product
    // For now, we'll just update our mock data
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...formData } : p
      ));
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: `${products.length + 1}`,
        image: '/images/products/default.jpg',
      };
      setProducts([...products, newProduct]);
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
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your store's products</p>
        </div>
        <Button onClick={handleAddProduct}>Add New Product</Button>
      </div>

      {showForm ? (
        <ProductForm
          initialData={editingProduct}
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
