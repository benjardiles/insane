'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Shield } from 'lucide-react';
import AdminCharts from '@/components/admin/AdminCharts';

// Definir interfaces para tipar correctamente los datos
interface AdminStats {
  totalStores: number;
  totalUsers: number;
  totalDeliveryDrivers: number;
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
}

interface TopStore {
  id: string;
  name: string;
  sales: number;
  orders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [topStores, setTopStores] = useState<TopStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState([
    { month: 'Ene', sales: 450000 },
    { month: 'Feb', sales: 520000 },
    { month: 'Mar', sales: 680000 },
    { month: 'Abr', sales: 750000 },
    { month: 'May', sales: 820000 },
    { month: 'Jun', sales: 950000 },
  ]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Aquí deberías llamar a tu API de administrador
        // Por ejemplo: const response = await adminAPI.getDashboardStats();
        
        // Simulando datos para demostración
        const mockStats: AdminStats = {
          totalStores: 45,
          totalUsers: 1250,
          totalDeliveryDrivers: 78,
          totalSales: 8750000,
          totalOrders: 3200,
          totalProducts: 1800
        };
        
        const mockTopStores: TopStore[] = [
          { id: '1', name: 'Restaurante El Buen Sabor', sales: 1250000, orders: 420 },
          { id: '2', name: 'Cafetería Aroma', sales: 980000, orders: 350 },
          { id: '3', name: 'Panadería La Esquina', sales: 750000, orders: 280 },
          { id: '4', name: 'Verdulería Don José', sales: 620000, orders: 210 },
          { id: '5', name: 'Carnicería El Toro', sales: 580000, orders: 190 }
        ];
        
        setStats(mockStats);
        setTopStores(mockTopStores);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('No se pudieron cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return (
    <div className="p-8">
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Cargando datos del dashboard administrativo...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Shield className="w-8 h-8 text-[#D05A44] mr-3" />
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
      </div>
      
      {/* Estadísticas generales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏪</div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Total Tiendas</h3>
                <p className="text-2xl font-bold">{stats.totalStores}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👥</div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Total Usuarios</h3>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🚚</div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Repartidores</h3>
                <p className="text-2xl font-bold">{stats.totalDeliveryDrivers}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💰</div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Ventas Totales</h3>
                <p className="text-2xl font-bold">${stats.totalSales.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📦</div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Pedidos Totales</h3>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🛒</div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Productos Totales</h3>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Top 5 tiendas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Top 5 Tiendas por Ventas</h2>
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tienda
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedidos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topStores.map((store, index) => (
                <tr key={store.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {index + 1}. {store.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${store.sales.toLocaleString('es-CL')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{store.orders}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Análisis de Ventas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Análisis de Ventas</h2>
        <AdminCharts salesData={salesData} />
      </div>
      
      {/* Acciones rápidas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/stores" className="block p-4 border rounded-lg hover:bg-gray-50 bg-white">
            <div className="flex items-center">
              <div className="text-2xl mr-4">🏪</div>
              <div>
                <h3 className="font-medium">Gestionar Tiendas</h3>
                <p className="text-sm text-gray-500">Administrar todas las tiendas de la plataforma</p>
              </div>
            </div>
          </a>
          
          <a href="/admin/users" className="block p-4 border rounded-lg hover:bg-gray-50 bg-white">
            <div className="flex items-center">
              <div className="text-2xl mr-4">👥</div>
              <div>
                <h3 className="font-medium">Gestionar Usuarios</h3>
                <p className="text-sm text-gray-500">Administrar usuarios y permisos</p>
              </div>
            </div>
          </a>
          
          <a href="/admin/orders" className="block p-4 border rounded-lg hover:bg-gray-50 bg-white">
            <div className="flex items-center">
              <div className="text-2xl mr-4">📦</div>
              <div>
                <h3 className="font-medium">Ver Pedidos</h3>
                <p className="text-sm text-gray-500">Supervisar todos los pedidos de la plataforma</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
