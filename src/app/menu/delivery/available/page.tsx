'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DeliveryLayout from '@/components/layouts/DeliveryLayout';
import AvailableOrdersList from '@/components/delivery/AvailableOrdersList';
import { deliveryAPI, AvailableOrder, PaginationResponse } from '@/services/api/delivery';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function AvailableOrdersPage() {
  const router = useRouter();
  const [availableOrders, setAvailableOrders] = useState<AvailableOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchAvailableOrders = async (pageNum: number) => {
    try {
      setLoading(true);
      
      // Usar el método getAvailableOrders de deliveryAPI
      const response = await deliveryAPI.getAvailableOrders(pageNum, 10);
      
      console.log('API Response:', response);
      
      // Actualizar los pedidos existentes o agregar nuevos
      if (pageNum === 1) {
        setAvailableOrders(response.data || []);
      } else {
        setAvailableOrders(prev => [...prev, ...(response.data || [])]);
      }
      
      // Verificar si hay más páginas
      setHasMore(response.pagination?.hasNext || false);
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching available orders:', err);
      setError('No se pudieron cargar las órdenes disponibles. Por favor, inténtalo de nuevo.');
      if (err.response) {
        console.error('Error response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableOrders(page);
  }, [page]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      if (!orderId) {
        console.error('ID de orden inválido:', orderId);
        setError('No se puede aceptar una orden sin ID válido');
        return;
      }
      
      setLoading(true);
      
      console.log('Aceptando orden con ID:', orderId);
      
      // Usar el método assignOrder de deliveryAPI
      await deliveryAPI.assignOrder(orderId);
      
      // Eliminar la orden de la lista disponible
      setAvailableOrders(availableOrders.filter(order => {
        // Primero intentamos con id, luego con _id
        const orderIdentifier = order.id || order._id;
        return orderIdentifier !== orderId;
      }));
      
      // Mostrar mensaje de éxito (opcional)
      console.log('Pedido asignado correctamente');
      
      // Redireccionar a mi página de órdenes
      router.push('/menu/delivery/my-orders');
    } catch (err: any) {
      console.error('Error accepting order:', err);
      setError('No se pudo aceptar la orden. Por favor, inténtalo de nuevo.');
      if (err.response) {
        console.error('Error response data:', err.response.data);
      }
      setLoading(false);
    }
  };

  const loadMoreOrders = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchAvailableOrders(1);
  };

  if (loading && availableOrders.length === 0) {
    return (
      <DeliveryLayout>
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="mt-4">Cargando órdenes disponibles...</span>
        </div>
      </DeliveryLayout>
    );
  }

  return (
    <DeliveryLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Órdenes Disponibles</h1>
        <p className="text-gray-600">Pedidos disponibles para entrega en tu área</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={handleRefresh} 
            className="ml-4 px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {availableOrders.length === 0 && !loading ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">No hay órdenes disponibles en este momento</p>
          <p className="text-gray-500 mt-2">Vuelve más tarde para nuevas oportunidades de entrega</p>
          <button 
            onClick={handleRefresh} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Actualizar
          </button>
        </div>
      ) : (
        <>
          <AvailableOrdersList
            orders={availableOrders}
            onAcceptOrder={handleAcceptOrder}
          />
          
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Actualizar
            </button>
            
            {hasMore && (
              <button
                onClick={loadMoreOrders}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Cargar Más Órdenes'}
              </button>
            )}
          </div>
        </>
      )}
    </DeliveryLayout>
  );
}







