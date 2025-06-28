'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ClientLayout from '@/components/layouts/ClientLayout';
import { useCartStore } from '@/store/cartStore';
import { storeAPI } from '@/services/api/store';
import { useNotification } from '@/components/ui/notification';

export default function CartPage() {
  const { items, storeId, storeName, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const { showNotification, NotificationComponent } = useNotification();

  // Manejar la hidratación del estado
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verificar token válido
          const userId = await storeAPI.decodeJWT();
          setIsAuthenticated(!!userId);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    showNotification("El producto ha sido eliminado de tu carrito", "success");
  };

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
      clearCart();
      showNotification("Todos los productos han sido eliminados de tu carrito", "success");
    }
  };

  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      showNotification("Debes iniciar sesión para completar tu compra", "warning");
      
      // Guardar URL actual para redirigir después del login
      localStorage.setItem('redirectAfterLogin', '/menu/cart');
      router.push('/login');
      return;
    }
    
    // Redirigir a la página de checkout
    router.push('/menu/checkout');
  };

  const continueShopping = () => {
    router.push('/menu/catalog');
  };

  // Calcular subtotal
  const subtotal = getTotalPrice();
  
  // Calcular impuestos (ejemplo: 19% IVA)
  const taxRate = 0.19;
  const taxes = subtotal * taxRate;
  
  // Calcular total
  const total = subtotal + taxes;

  if (loading) {
    return (
      <ClientLayout>
        <div className="text-center py-10">Cargando...</div>
      </ClientLayout>
    );
  }

  // Mostrar un estado de carga hasta que se hidrate el estado
  if (!isHydrated) {
    return (
      <ClientLayout>
        <div className="text-center py-10">Cargando carrito...</div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      {NotificationComponent}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tu Carrito</h1>
        <p className="text-gray-600">
          {items.length > 0 
            ? `${items.length} ${items.length === 1 ? 'producto' : 'productos'} de ${storeName}`
            : 'No hay productos en tu carrito'}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row border-b pb-6 last:border-0 last:pb-0">
                    <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                      <Image
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 sm:ml-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            Método: {item.deliveryMethod === 'delivery' ? 'Entrega a domicilio' : 'Recoger en tienda'}
                          </p>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <p className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} por unidad</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 mx-2 text-center"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={continueShopping}
                >
                  Seguir Comprando
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  Vaciar Carrito
                </Button>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Resumen de Compra</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (19%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={proceedToCheckout}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Proceder al Pago
              </Button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Los precios incluyen IVA. Los costos de envío se calcularán en el siguiente paso.
              </p>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">Añade productos de nuestro catálogo para comenzar tu compra</p>
          <Button 
            onClick={continueShopping}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Explorar Catálogo
          </Button>
        </Card>
      )}
    </ClientLayout>
  );
}

