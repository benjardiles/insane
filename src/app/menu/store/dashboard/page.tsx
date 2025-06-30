'use client';
import { useState, useEffect } from 'react';
import { storeAPI } from '@/services/api/store';
import { ordersAPI } from '@/services/api/orders';
import StoreLayout from '@/components/layouts/StoreLayout';
import DashboardStats from '@/components/store/DashboardSummary';
import RecentOrders from '@/components/store/RecentOrders';
import { Loader2 } from 'lucide-react';

// Definir interfaces para tipar correctamente los datos
interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  items: {
    id?: string;
    name: string;
    quantity: number;
  }[];
}

interface DashboardStats {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  averageRating: number;
  totalReviews: number;
  [key: string]: any; // Para permitir propiedades adicionales
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Obtener ID de la tienda
        const storeId = await storeAPI.decodeJWT();
        
        if (!storeId) {
          throw new Error('No se pudo obtener el ID de la tienda');
        }
        
        // Obtener estadísticas del dashboard usando el método específico para tiendas
        const dashboardStats = await ordersAPI.getStoreOrderStats(storeId);
        
        // Obtener productos de la tienda para contar el total
        const productsResponse = await storeAPI.getProductsByUser(storeId);
        console.log('Products Response:', productsResponse);
        
        // Determinar el total de productos basado en la estructura de la respuesta
        let totalProducts = 0;
        
        // Si la respuesta es directamente un array
        if (Array.isArray(productsResponse)) {
          totalProducts = productsResponse.length;
        }
        // Si la respuesta tiene una propiedad data que es un array
        else if (productsResponse && productsResponse.data && Array.isArray(productsResponse.data)) {
          totalProducts = productsResponse.data.length;
        }
        
        console.log('Total Products calculated:', totalProducts);
        
        // Combinar las estadísticas con el total de productos
        setStats({
          ...dashboardStats,
          totalProducts
        });
        
        // Obtener órdenes recientes usando el método específico para tiendas
        const ordersResponse = await ordersAPI.getOrdersByStoreId(storeId, 1, 5);
        
        // Transformar los datos de órdenes al formato esperado por RecentOrders
        const formattedOrders = (ordersResponse.data || []).map((order: any) => ({
          id: order.id || order._id || String(Math.random()).slice(2),
          customer: order.customer?.name || order.customerName || 'Cliente',
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          total: order.total || 0,
          status: order.status || 'pending',
          items: (order.items || []).map((item: any) => ({
            id: item.id || item._id || String(Math.random()).slice(2),
            name: item.name || item.productName || 'Producto',
            quantity: item.quantity || 1
          }))
        }));
        
        setRecentOrders(formattedOrders);
        
        // Obtener reseñas para calcular calificación promedio
        const reviewsResponse = await storeAPI.getReviews(1, 100);
        
        // Filtrar reseñas por tienda
        const storeReviews = reviewsResponse.data?.filter((review: any) => 
          review.store_id === storeId
        ) || [];
        
        // Calcular calificación promedio
        if (storeReviews.length > 0) {
          const totalRating = storeReviews.reduce((sum: number, review: any) => 
            sum + (review.rating || 0), 0);
          setAverageRating(totalRating / storeReviews.length);
          setTotalReviews(storeReviews.length);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <StoreLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Cargando datos del dashboard...</span>
      </div>
    </StoreLayout>
  );
  
  if (error) return (
    <StoreLayout>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        Error: {error}
      </div>
    </StoreLayout>
  );

  return (
    <StoreLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {stats && <DashboardStats stats={{
        ...stats,
        averageRating,
        totalReviews
      }} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div>
          <RecentOrders orders={recentOrders} />
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
            <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
            <div className="space-y-4">
              <a 
                href="/menu/store/products"
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📦</div>
                  <div>
                    <h3 className="font-medium">Gestionar Productos</h3>
                    <p className="text-sm text-gray-500">Añadir, editar o eliminar productos de tu catálogo</p>
                  </div>
                </div>
              </a>
              <a 
                href="/menu/store/orders"
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📋</div>
                  <div>
                    <h3 className="font-medium">Gestionar Pedidos</h3>
                    <p className="text-sm text-gray-500">Ver y actualizar el estado de los pedidos</p>
                  </div>
                </div>
              </a>
              <a 
                href="/menu/store/reviews"
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">⭐</div>
                  <div>
                    <h3 className="font-medium">Ver Reseñas</h3>
                    <p className="text-sm text-gray-500">Consulta las opiniones de tus clientes</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
