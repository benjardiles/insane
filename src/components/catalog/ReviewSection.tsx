import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewSectionProps {
  storeId: string;
  reviews: Review[];
  onAddReview?: (rating: number, comment: string) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  storeId,
  reviews,
  onAddReview
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview) {
      onAddReview(rating, comment);
      setRating(5);
      setComment('');
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Store Reviews</h2>
        {onAddReview && (
          <Button 
            variant="outline"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>
            
            <Button type="submit">Submit Review</Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{review.user}</p>
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
              <p className="mt-2">{review.comment}</p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
