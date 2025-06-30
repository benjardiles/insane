'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ClientLayout from '@/components/layouts/ClientLayout';
import { useNotification } from '@/components/ui/notification';
import { useCartStore } from '@/store/cartStore';
import { ordersAPI, CreateOrderDto } from '@/services/api/orders';
import { Loader2, User, Phone, Mail, MapPin, Trash2, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  // Usar el store de Zustand para el carrito
  const { items, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [processingOrder, setProcessingOrder] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const router = useRouter();
  const { showNotification, NotificationComponent } = useNotification();
  const { user, isAuthenticated } = useAuth();

  // Cargar información del usuario autenticado
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || ''
      });
    }
    setLoading(false);
  }, [user]);

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const proceedToCheckout = async () => {
    if (!isAuthenticated) {
      showNotification("Debes iniciar sesión para completar tu compra", "warning");
      
      // Guardar URL actual para redirigir después del login
      localStorage.setItem('redirectAfterLogin', '/menu/cart');
      router.push('/login');
      return;
    }
    
    // Validar que tengamos la información necesaria
    if (!customerInfo.name || !customerInfo.phone) {
      showNotification('Tu perfil no tiene toda la información necesaria. Por favor actualiza tu perfil.', 'warning');
      router.push('/profile');
      return;
    }
    
    // Si falta la dirección y es necesaria para delivery
    if (!customerInfo.address) {
      showNotification('Necesitas agregar una dirección en tu perfil para continuar', 'warning');
      router.push('/profile');
      return;
    }
    
    // Procesar el pedido directamente sin pasar por checkout
    await handleCreateOrder();
  };

  const handleCreateOrder = async () => {
    // Validar información del cliente
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      showNotification('Falta información necesaria en tu perfil', 'error');
      router.push('/profile');
      return;
    }
    
    if (!isAuthenticated) {
      showNotification("Debes iniciar sesión para completar tu compra", "warning");
      localStorage.setItem('redirectAfterLogin', '/menu/cart');
      router.push('/login');
      return;
    }
    
    try {
      setProcessingOrder(true);
      
      console.log('=== DATOS AL REALIZAR PEDIDO ===');
      console.log('Timestamp:', new Date().toISOString());
      console.log('Usuario autenticado:', isAuthenticated);
      console.log('Información del cliente:', JSON.stringify(customerInfo, null, 2));
      console.log('Items en el carrito:', JSON.stringify(items, null, 2));
      console.log('Total de items:', getTotalItems());
      console.log('Precio total:', getTotalPrice());
      
      // Determinar método de entrega
      let deliveryMethod = 'PICKUP'; // Valor por defecto
      
      if (items.length > 0) {
        const allSameMethod = items.every(item => item.deliveryMethod === items[0].deliveryMethod);
        
        if (allSameMethod) {
          // Convertir a mayúsculas para coincidir con el formato esperado por el backend
          deliveryMethod = items[0].deliveryMethod.toUpperCase();
        } else {
          deliveryMethod = 'DELIVERY'; // Valor por defecto si hay métodos mixtos
          console.log('Métodos de entrega mixtos en el carrito, usando "DELIVERY" por defecto');
        }
      }
      
      console.log('Método de entrega seleccionado:', deliveryMethod);
      
      // Transformar los items al formato esperado por el backend
      const transformedItems = items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        storeId: item.storeId,
        storeName: item.storeName,
        imageUrl: item.image
      }));
      
      // Calcular el total
      const total = getTotalPrice();
      
      // Crear objeto de pedido según el formato esperado por el backend
      const orderData = {
        customer: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email || undefined,
          address: customerInfo.address || undefined
        },
        items: transformedItems,
        total: total,
        deliveryMethod: deliveryMethod, // Ya está en mayúsculas
        notes: 'Pedido realizado desde la web'
      };
      
      console.log('Datos del pedido a crear:', JSON.stringify(orderData, null, 2));
      
      // Crear pedido
      console.log('Creando pedido...');
      const order = await ordersAPI.createOrder(orderData);
      console.log('Respuesta de creación de pedido:', JSON.stringify(order, null, 2));
      
      // Limpiar el carrito local después de crear el pedido
      console.log('Limpiando carrito local...');
      clearCart();
      
      // Mostrar notificación de éxito pero NO redirigir
      showNotification('¡Pedido creado con éxito! Gracias por tu compra.', 'success');
      
      // Opcional: Puedes mostrar un mensaje adicional con el ID del pedido
      showNotification(`Tu número de pedido es: ${order.id}`, 'info');
      
      // No hacemos router.push, el usuario permanece en la página actual
      console.log('Pedido completado, permaneciendo en la página actual');
      
    } catch (error: any) {
      console.error('=== ERROR AL PROCESAR PEDIDO ===');
      console.error('Error completo:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      }
      showNotification('Error al procesar el pedido', 'error');
    } finally {
      setProcessingOrder(false);
    }
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
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2">Cargando información...</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      {NotificationComponent}
      
      <div className="mb-6 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Tu Carrito</h1>
        <p className="text-gray-600">Revisa y finaliza tu compra</p>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-10">
          <div className="mb-4">
            <Image 
              src="/images/empty-cart.svg" 
              alt="Carrito vacío" 
              width={200} 
              height={200}
              className="mx-auto"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Añade productos para comenzar tu pedido</p>
          <Button onClick={continueShopping}>
            Explorar Productos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 border rounded-lg bg-white shadow-sm">
                  <div className="w-full sm:w-20 h-20 mb-4 sm:mb-0 sm:mr-4 relative">
                    <Image
                      src={item.image || '/images/product-placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-gray-500 text-sm">${item.price.toFixed(2)} c/u</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Método: {item.deliveryMethod === 'delivery' ? 'Entrega a domicilio' : 'Recoger en tienda'}
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-4 sm:mt-0">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-2 w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center">
                    <span className="font-medium mr-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Resumen y checkout */}
          <div>
            <Card className="p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Resumen del Pedido</h2>
              
              {isAuthenticated ? (
                <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
                  <h3 className="font-medium mb-2">Información de Entrega</h3>
                  <div className="space-y-1">
                    <div className="flex items-start">
                      <User className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <span>{customerInfo.name || 'No disponible'}</span>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <span>{customerInfo.phone || 'No disponible'}</span>
                    </div>
                    {customerInfo.email && (
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <span>{customerInfo.email}</span>
                      </div>
                    )}
                    {customerInfo.address && (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <span>{customerInfo.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-4 sm:mb-6 bg-blue-50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-blue-700">
                  Inicia sesión para continuar con tu compra
                </div>
              )}
              
              <div className="space-y-2 mb-4 sm:mb-6 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (19%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={proceedToCheckout}
                  disabled={processingOrder || items.length === 0}
                >
                  {processingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Realizar Pedido'
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={continueShopping}
                >
                  Seguir Comprando
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}









