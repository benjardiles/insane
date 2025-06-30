'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ClientLayout from '@/components/layouts/ClientLayout';
import { useNotification } from '@/components/ui/notification';
import { ordersAPI } from '@/services/api/orders';
import { useAuth } from '@/contexts/AuthContext';

// Interfaces
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  items: OrderItem[];
  store: {
    id: string;
    name: string;
  };
  deliveryMethod: string;
  paymentMethod: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { showNotification, NotificationComponent } = useNotification();
  const { isAuthenticated, user } = useAuth();

  // Cargar pedidos del usuario
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await ordersAPI.getMyOrders();
        setOrders(response.data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'No se pudieron cargar tus pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // Manejar el clic en el botón de login
  const handleLoginClick = () => {
    localStorage.setItem('redirectAfterLogin', '/menu/orders');
    router.push('/login');
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Traducir estado del pedido
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Pendiente',
      'processing': 'En proceso',
      'ready': 'Listo para entrega',
      'on_way': 'En camino',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // Obtener clase CSS según estado
  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'ready': 'bg-purple-100 text-purple-800',
      'on_way': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Ver detalles de un pedido
  const handleViewOrderDetails = (orderId: string) => {
    router.push(`/menu/orders/${orderId}`);
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2">Cargando tus pedidos...</p>
        </div>
      </ClientLayout>
    );
  }

  // Si no está autenticado, mostrar mensaje y botón de login
  if (!isAuthenticated) {
    return (
      <ClientLayout>
        {NotificationComponent}
        
        <div className="mb-6 px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Mis Pedidos</h1>
          <p className="text-gray-600">Historial de tus compras</p>
        </div>
        
        <div className="text-center py-10">
          <div className="mb-4">
            <LogIn className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Inicia sesión para ver tus pedidos</h2>
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión para acceder a tu historial de pedidos</p>
          <Button onClick={handleLoginClick}>
            Iniciar Sesión
          </Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      {NotificationComponent}
      
      <div className="mb-6 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Mis Pedidos</h1>
        <p className="text-gray-600">Historial de tus compras</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <div className="mb-4">
            <div className="text-6xl mx-auto">📦</div>
          </div>
          <h2 className="text-xl font-semibold mb-2">No tienes pedidos aún</h2>
          <p className="text-gray-600 mb-6">Realiza tu primera compra para ver tu historial aquí</p>
          <Button onClick={() => router.push('/menu/catalog')}>
            Explorar Productos
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                      {translateStatus(order.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-medium">Pedido #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    {order.store?.name || 'Tienda'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col items-end">
                  <p className="font-semibold text-lg">
                    ${order.total.toLocaleString('es-CL')}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                    onClick={() => handleViewOrderDetails(order.id)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}

