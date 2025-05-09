'use client';

import React from 'react';
import StoreLayout from '@/components/layouts/StoreLayout';
import ReviewsList from '@/components/store/ReviewsList';

// Mock data for demonstration
const MOCK_REVIEWS = [
  {
    id: 'r1',
    customer: 'Juan P.',
    rating: 5,
    comment: 'Los vegetales estaban increíblemente frescos. ¡Definitivamente volveré a comprar!',
    date: '2023-05-15',
    productId: 'p1',
    productName: 'Vegetales Orgánicos Frescos',
  },
  {
    id: 'r2',
    customer: 'María C.',
    rating: 4,
    comment: 'Buena calidad, pero un tomate estaba un poco golpeado.',
    date: '2023-05-10',
    productId: 'p1',
    productName: 'Vegetales Orgánicos Frescos',
  },
  {
    id: 'r3',
    customer: 'Miguel T.',
    rating: 5,
    comment: 'Excelente servicio y los vegetales duraron mucho más que los del supermercado.',
    date: '2023-05-05',
    productId: 'p1',
    productName: 'Vegetales Orgánicos Frescos',
  },
  {
    id: 'r4',
    customer: 'Emilia R.',
    rating: 5,
    comment: 'El pan estaba aún caliente cuando lo recogí. ¡Sabor increíble!',
    date: '2023-05-12',
    productId: 'p2',
    productName: 'Pan Artesanal',
  },
  {
    id: 'r5',
    customer: 'David K.',
    rating: 3,
    comment: 'El pan estaba bueno, pero un poco denso para mi gusto.',
    date: '2023-05-08',
    productId: 'p2',
    productName: 'Pan Artesanal',
  },
  {
    id: 'r6',
    customer: 'Jessica L.',
    rating: 5,
    comment: 'Estos huevos son mucho mejores que los del supermercado. ¡Las yemas son de un naranja brillante!',
    date: '2023-05-14',
    productId: 'p3',
    productName: 'Huevos de Gallinas Libres',
  },
  {
    id: 'r7',
    customer: 'Roberto P.',
    rating: 4,
    comment: 'Carne de res de muy buena calidad. Volvería a comprar.',
    date: '2023-05-11',
    productId: 'p4',
    productName: 'Carne de Res Alimentada con Pasto',
  },
  {
    id: 'r8',
    customer: 'Luisa M.',
    rating: 5,
    comment: '¡Esta pasta es increíble! Ni siquiera parece que sea sin gluten.',
    date: '2023-05-09',
    productId: 'p5',
    productName: 'Pasta Sin Gluten',
  },
];

// Calculate average rating and total reviews
const calculateReviewStats = (reviews: typeof MOCK_REVIEWS) => {
  if (reviews.length === 0) return { averageRating: 0, totalReviews: 0 };
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    averageRating: totalRating / reviews.length,
    totalReviews: reviews.length,
  };
};

export default function ReviewsPage() {
  const reviews = MOCK_REVIEWS;
  const { averageRating, totalReviews } = calculateReviewStats(reviews);

  return (
    <StoreLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customer Reviews</h1>
        <p className="text-gray-600">See what customers are saying about your products</p>
      </div>

      <ReviewsList
        reviews={reviews}
        averageRating={averageRating}
        totalReviews={totalReviews}
      />
    </StoreLayout>
  );
}
