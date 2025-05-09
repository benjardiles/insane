import React from 'react';
import { Card } from '../ui/card';

interface Review {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  productId?: string;
  productName?: string;
}

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  averageRating,
  totalReviews
}) => {
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // 5 stars, 4 stars, 3 stars, 2 stars, 1 star
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++;
    }
  });
  
  const ratingPercentages = ratingCounts.map(count => 
    totalReviews > 0 ? (count / totalReviews) * 100 : 0
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/3 text-center mb-6 md:mb-0">
            <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-yellow-500 text-xl">
                  {i < Math.round(averageRating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <div className="text-gray-500 mt-1">{totalReviews} reviews</div>
          </div>
          
          <div className="md:w-2/3">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star, index) => (
                <div key={star} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{star} stars</div>
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${ratingPercentages[index]}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {ratingCounts[index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{review.customer}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    {i < review.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            {review.productName && (
              <p className="text-sm text-blue-600 mb-2">
                Product: {review.productName}
              </p>
            )}
            <p className="text-gray-700">{review.comment}</p>
          </Card>
        ))}
        
        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
