'use client';
import { useState, useEffect } from 'react';
import { storeAPI } from '@/services/api/store';
import StoreLayout from '@/components/layouts/StoreLayout';
import DashboardStats from '@/components/store/DashboardSummary';
import RecentOrders from '@/components/store/RecentOrders';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Obtener estadísticas del dashboard
        const dashboardStats = await storeAPI.getDashboardStats();
        setStats(dashboardStats);
        
        // Obtener órdenes recientes (limitadas a 5)
        const ordersResponse = await storeAPI.getOrders(1, 5);
        setRecentOrders(ordersResponse.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <StoreLayout><div>Cargando...</div></StoreLayout>;
  if (error) return <StoreLayout><div>Error: {error}</div></StoreLayout>;

  return (
    <StoreLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {stats && <DashboardStats stats={stats} />}
      
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
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
