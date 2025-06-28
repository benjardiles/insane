'use client';

import React, { useState, useEffect } from 'react';
import StoreLayout from '@/components/layouts/StoreLayout';
import ReviewsList from '@/components/store/ReviewsList';
import { storeAPI } from '@/services/api/store';

// Interfaz para las reseñas
interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  reviewDate: string;
  productId: string;
  productName: string;
  store_id: string;
}

// Calcular calificación promedio y total de reseñas
const calculateReviewStats = (reviews: Review[]) => {
  if (reviews.length === 0) return { averageRating: 0, totalReviews: 0 };
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    averageRating: totalRating / reviews.length,
    totalReviews: reviews.length,
  };
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [storeId, setStoreId] = useState<string | null>(null);

  // Obtener el ID de la tienda y luego las reseñas
  useEffect(() => {
    const fetchStoreId = async () => {
      try {
        const userId = await storeAPI.decodeJWT();
        if (userId) {
          setStoreId(userId);
        } else {
          throw new Error('No se pudo obtener el ID de la tienda');
        }
      } catch (err: any) {
        console.error('Error getting store ID:', err);
        setError(err.message || 'No se pudo identificar la tienda');
        setLoading(false);
      }
    };

    fetchStoreId();
  }, []);

  // Obtener reseñas cuando cambia el storeId o la página
  useEffect(() => {
    if (!storeId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Obtener todas las reseñas y filtrar por store_id
        const response = await storeAPI.getReviews(page, 20);
        
        // Filtrar las reseñas por store_id
        const storeReviews = response.data?.filter((review: any) => 
          review.store_id === storeId
        ) || [];
        
        // Transformar los datos para que coincidan con la interfaz Review
        const transformedReviews: Review[] = storeReviews.map((review: any) => ({
          id: review._id || review.id,
          customerName: review.customerName || 'Cliente anónimo',
          rating: review.rating || 0,
          comment: review.comment || '',
          reviewDate: review.reviewDate || review.createdAt || new Date().toISOString(),
          productId: review.productId || '',
          productName: review.productName || 'Producto desconocido',
          store_id: review.store_id || storeId
        }));
        
        setReviews(transformedReviews);
        
        // Actualizar la paginación si está disponible
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
        }
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching reviews:', err);
        setError(err.message || 'No se pudieron cargar las reseñas');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [storeId, page]);

  const { averageRating, totalReviews } = calculateReviewStats(reviews);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Función para formatear las reseñas para el componente ReviewsList
  const formatReviewsForList = (reviews: Review[]) => {
    return reviews.map(review => ({
      ...review,
      createdAt: review.reviewDate
    }));
  };

  return (
    <StoreLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reseñas de Clientes</h1>
        <p className="text-gray-600">Vea lo que los clientes están diciendo sobre sus productos</p>
      </div>

      {loading && reviews.length === 0 ? (
        <div className="text-center py-8">
          <p>Cargando reseñas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay reseñas disponibles para su tienda.</p>
          <p className="text-gray-500 mt-2">Las reseñas aparecerán aquí cuando los clientes evalúen sus productos.</p>
        </div>
      ) : (
        <>
          <ReviewsList
            reviews={formatReviewsForList(reviews)}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
          
          {/* Paginación simple */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </StoreLayout>
  );
}
