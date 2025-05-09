'use client';

import React from 'react';
import StoreLayout from '@/components/layouts/StoreLayout';
import ReviewsList from '@/components/store/ReviewsList';

// Mock data for demonstration
const MOCK_REVIEWS = [
  {
    id: 'r1',
    customer: 'John D.',
    rating: 5,
    comment: 'The vegetables were incredibly fresh! Will definitely order again.',
    date: '2023-05-15',
    productId: 'p1',
    productName: 'Fresh Organic Vegetables',
  },
  {
    id: 'r2',
    customer: 'Sarah M.',
    rating: 4,
    comment: 'Great quality produce, but one tomato was slightly bruised.',
    date: '2023-05-10',
    productId: 'p1',
    productName: 'Fresh Organic Vegetables',
  },
  {
    id: 'r3',
    customer: 'Michael T.',
    rating: 5,
    comment: 'Excellent service and the vegetables lasted much longer than store-bought ones.',
    date: '2023-05-05',
    productId: 'p1',
    productName: 'Fresh Organic Vegetables',
  },
  {
    id: 'r4',
    customer: 'Emily R.',
    rating: 5,
    comment: 'The bread was still warm when I picked it up. Amazing flavor!',
    date: '2023-05-12',
    productId: 'p2',
    productName: 'Artisan Bread',
  },
  {
    id: 'r5',
    customer: 'David K.',
    rating: 3,
    comment: 'The bread was good but a bit too dense for my taste.',
    date: '2023-05-08',
    productId: 'p2',
    productName: 'Artisan Bread',
  },
  {
    id: 'r6',
    customer: 'Jessica L.',
    rating: 5,
    comment: 'These eggs are so much better than supermarket eggs. The yolks are bright orange!',
    date: '2023-05-14',
    productId: 'p3',
    productName: 'Free-Range Eggs',
  },
  {
    id: 'r7',
    customer: 'Robert P.',
    rating: 4,
    comment: 'Very good quality beef. Would buy again.',
    date: '2023-05-11',
    productId: 'p4',
    productName: 'Grass-Fed Beef',
  },
  {
    id: 'r8',
    customer: 'Lisa M.',
    rating: 5,
    comment: 'This pasta is amazing! You can not even tell it\'s gluten-free.',
    date: '2023-05-09',
    productId: 'p5',
    productName: 'Gluten-Free Pasta',
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
