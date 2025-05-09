'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ClientLayout from '@/components/layouts/ClientLayout';
import ProductDetail from '@/components/catalog/ProductDetail';
import PurchaseOptions from '@/components/catalog/PurchaseOptions';
import ReviewSection from '@/components/catalog/ReviewSection';

// Mock data for demonstration
const MOCK_PRODUCT = {
  id: '2',
  name: 'Ají Rojo Chileno',
  description: 'Un puñado de ajíes rojos vibrantes y picantes. Ideales para darle sazón y picor a tus comidas. Cultivados en tierras chilenas y cosechados en su punto justo.',
  price: 8.99,
  image: '/images/products/aji.jpg',
  store: {
    id: 'store2',
    name: 'El Rincón del Sabor',
    rating: 4.8,
  },
  tags: ['picante', 'chileno', 'fresco'],
  nutritionalInfo: {
    calories: 40,
    protein: 2,
    carbs: 9,
    fat: 0.4,
  },
  availableOptions: {
    delivery: true,
    pickup: true,
  },
};

const MOCK_REVIEWS = [
  {
    id: 'r1',
    user: 'Ana P.',
    rating: 5,
    comment: '¡Estos ajíes están fileteados! Súper frescos y con el picor justo.',
    date: '2023-06-01',
  },
  {
    id: 'r2',
    user: 'Carlos R.',
    rating: 4,
    comment: 'Buena calidad, pero un poco demasiado picantes para mi paladar.',
    date: '2023-05-28',
  },
  {
    id: 'r3',
    user: 'Emilia K.',
    rating: 5,
    comment: 'Perfectos para preparar pebre. ¡Voy a seguir comprando!',
    date: '2023-05-20',
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  
  const product = MOCK_PRODUCT;
  const reviews = MOCK_REVIEWS;
  
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const handlePurchase = (quantity: number, method: 'delivery' | 'pickup') => {
    setPurchaseMessage(
      `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart with ${method} option.`
    );
    
    // Clear the message after 3 seconds
    setTimeout(() => {
      setPurchaseMessage(null);
    }, 3000);
  };

  const handleAddReview = (rating: number, comment: string) => {
    // In a real app, this would submit the review to an API
    alert(`Thank you for your ${rating}-star review!`);
  };

  if (!product) {
    return (
      <ClientLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Product not found.</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="mb-6">
        <button 
          onClick={() => window.history.back()}
          className="text-blue-500 hover:underline mb-4 flex items-center"
        >
          ← Back to Catalog
        </button>
      </div>

      {purchaseMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {purchaseMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <ProductDetail
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            store={product.store}
            tags={product.tags}
            nutritionalInfo={product.nutritionalInfo}
          />
        </div>
        <div>
          <PurchaseOptions
            availableOptions={product.availableOptions}
            onPurchase={handlePurchase}
          />
        </div>
      </div>

      <div className="mt-10">
        <ReviewSection
          storeId={product.store.id}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      </div>
    </ClientLayout>
  );
}
