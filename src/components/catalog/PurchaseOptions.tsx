import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRouter } from 'next/navigation';
import { useCartStore, CartItem } from '@/store/cartStore';
import { useNotification } from '@/components/ui/notification';
import { Loader2 } from 'lucide-react';

interface PurchaseOptionsProps {
  availableOptions: {
    delivery: boolean;
    pickup: boolean;
  };
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  storeId: string;
  storeName: string;
  onPurchase?: (quantity: number, method: 'delivery' | 'pickup') => void;
}

const PurchaseOptions: React.FC<PurchaseOptionsProps> = ({
  availableOptions,
  productId,
  productName,
  productPrice,
  productImage,
  storeId,
  storeName,
  onPurchase
}) => {
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  const router = useRouter();
  
  // Usar el store de Zustand
  const { addItem, storeId: cartStoreId, items, clearCart } = useCartStore();
  
  // Usar nuestro hook de notificación
  const { showNotification, NotificationComponent } = useNotification();
  
  // Estado para controlar si el store está hidratado
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Asegurar que el store esté hidratado antes de usarlo
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Añadir estado de carga
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (value: string) => {
    setQuantity(parseInt(value));
  };

  const handleMethodChange = (value: string) => {
    setMethod(value as 'delivery' | 'pickup');
  };

  const handleAddToCart = () => {
    if (!isHydrated || isLoading) return; // No hacer nada si el store no está hidratado o está cargando
    
    setIsLoading(true); // Iniciar estado de carga
    
    // Si el carrito tiene productos de otra tienda, mostrar confirmación
    if (cartStoreId && cartStoreId !== storeId && items.length > 0) {
      if (!confirm('Tu carrito contiene productos de otra tienda. ¿Deseas vaciar tu carrito actual?')) {
        setIsLoading(false); // Terminar estado de carga si cancela
        return; // Usuario canceló, no hacer nada
      }
      
      // Si el usuario confirma, limpiar el carrito antes de añadir el nuevo producto
      clearCart();
    }
    
    // Crear el item para el carrito
    const cartItem: CartItem = {
      id: productId,
      name: productName,
      price: productPrice,
      quantity: quantity,
      image: productImage,
      deliveryMethod: method,
      storeId: storeId,
      storeName: storeName
    };
    
    // Añadir al carrito usando Zustand
    addItem(cartItem);
    
    // Llamar a la función onPurchase si existe (para compatibilidad)
    if (onPurchase) {
      onPurchase(quantity, method);
    }
    
    // Mostrar notificación
    showNotification(`${quantity} x ${productName} añadido a tu carrito`, "success");
    
    // Simular un pequeño retraso para mejor feedback visual
    setTimeout(() => {
      setIsLoading(false); // Terminar estado de carga
    }, 800);
  };

  const viewCart = () => {
    router.push('/menu/cart');
  };

  return (
    <Card className="p-4 relative">
      {NotificationComponent}
      
      <h2 className="text-lg font-semibold mb-4">Opciones de Compra</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <Select
            value={quantity.toString()}
            onValueChange={handleQuantityChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona cantidad" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Método de Entrega</label>
          <Select
            value={method}
            onValueChange={handleMethodChange}
            disabled={!availableOptions.delivery && !availableOptions.pickup}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona método" />
            </SelectTrigger>
            <SelectContent>
              {availableOptions.delivery && (
                <SelectItem value="delivery">Entrega a Domicilio</SelectItem>
              )}
              {availableOptions.pickup && (
                <SelectItem value="pickup">Recoger en Tienda</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Añadiendo...
              </>
            ) : (
              'Añadir al Carrito'
            )}
          </Button>
          
          <Button 
            onClick={viewCart}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            Ver Carrito
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PurchaseOptions;
