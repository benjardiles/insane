import React from 'react';
import { Card } from '../ui/card';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  productId: string;
  productName: string;
}

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

// Componente reutilizable para mostrar la calificación general
export const RatingOverview: React.FC<{
  averageRating: number;
  totalReviews: number;
  className?: string;
}> = ({ averageRating, totalReviews, className = '' }) => {
  // Función para renderizar estrellas
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-500">
            {star <= Math.round(rating) ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Calificación general</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex">{renderStars(averageRating)}</div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Basado en</p>
          <p className="font-semibold">{totalReviews} reseñas</p>
        </div>
      </div>
    </Card>
  );
};

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  averageRating,
  totalReviews
}) => {
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Función para renderizar estrellas (para las reseñas individuales)
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-500">
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Usar el componente reutilizable para el resumen de calificaciones */}
      <RatingOverview 
        averageRating={averageRating} 
        totalReviews={totalReviews} 
      />

      {/* Lista de reseñas */}
      {reviews.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-gray-500">No hay reseñas disponibles.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{review.customerName}</p>
                  {renderStars(review.rating)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  <p className="text-sm font-medium">{review.productName}</p>
                </div>
              </div>
              <p className="mt-2">{review.comment}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;




