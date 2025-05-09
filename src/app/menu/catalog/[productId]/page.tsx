'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import ClientLayout from '@/components/layouts/ClientLayout';
import ProductDetail from '@/components/catalog/ProductDetail';
import PurchaseOptions from '@/components/catalog/PurchaseOptions';
import ReviewSection from '@/components/catalog/ReviewSection';

// Mock data for demonstration
const MOCK_PRODUCT = {
  id: '1',
  name: 'Fresh Organic Vegetables',
  description: 'A selection of fresh, locally grown organic vegetables. This bundle includes carrots, tomatoes, lettuce, and bell peppers. All produce is harvested within 24 hours of delivery to ensure maximum freshness.',
  price: 12.99,
  image: '/images/products/vegetables.jpg',
  store: {
    id: 'store1',
    name: 'Green Market',
    rating: 4.7,
  },
  tags: ['organic', 'vegetarian', 'vegan', 'local'],
  nutritionalInfo: {
    calories: 120,
    protein: 3,
    carbs: 20,
    fat: 1,
  },
  availableOptions: {
    delivery: true,
    pickup: true,
  },
};

const MOCK_REVIEWS = [
  {
    id: 'r1',
    user: 'John D.',
    rating: 5,
    comment: 'The vegetables were incredibly fresh! Will definitely order again.',
    date: '2023-05-15',
  },
  {
    id: 'r2',
    user: 'Sarah M.',
    rating: 4,
    comment: 'Great quality produce, but one tomato was slightly bruised.',
    date: '2023-05-10',
  },
  {
    id: 'r3',
    user: 'Michael T.',
    rating: 5,
    comment: 'Excellent service and the vegetables lasted much longer than store-bought ones.',
    date: '2023-05-05',
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  
  // In a real app, you would fetch the product data based on the ID
  // For now, we'll just use the mock data
  const product = MOCK_PRODUCT;
  const reviews = MOCK_REVIEWS;
  
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const handlePurchase = (quantity: number, method: 'delivery' | 'pickup') => {
    // In a real app, this would add the item to a cart or process the order
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
