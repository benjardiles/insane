'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  reviewDate: string;
}

interface ReviewSectionProps {
  storeId: string;
  reviews: Review[];
  onAddReview: (rating: number, comment: string, customerName: string) => Promise<void>;
  isLoading?: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  storeId,
  reviews,
  onAddReview,
  isLoading = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Por favor ingrese un comentario');
      return;
    }

    if (!isAuthenticated || !user) {
      alert('Debe iniciar sesión para dejar una reseña');
      return;
    }

    const customerName = user.name;

    setIsSubmitting(true);
    try {
      await onAddReview(rating, comment, customerName);
      
      // Limpiar el formulario después de enviar
      setRating(5);
      setComment('');
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-500">
            {star <= value ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Reseñas de clientes</h3>
        {isAuthenticated ? (
          <Button 
            onClick={() => setShowForm(!showForm)}
            variant="outline"
          >
            {showForm ? 'Cancelar' : 'Escribir una reseña'}
          </Button>
        ) : (
          <Button 
            onClick={() => alert('Debe iniciar sesión para dejar una reseña')}
            variant="outline"
          >
            Iniciar sesión para reseñar
          </Button>
        )}
      </div>

      {showForm && isAuthenticated && (
        <Card className="p-4 space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Reseñando como: <span className="font-bold">{user?.name}</span></p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Calificación</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl text-yellow-500 focus:outline-none"
                  >
                    {star <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Comentario</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Comparta su experiencia con este producto"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
            </Button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Cargando reseñas...</p>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-gray-500">Este producto aún no tiene reseñas.</p>
          <p className="text-gray-500">¡Sé el primero en compartir tu opinión!</p>
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
                <p className="text-sm text-gray-500">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2">{review.comment}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;


