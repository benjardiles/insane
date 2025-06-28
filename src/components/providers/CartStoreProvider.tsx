'use client';
import { useRef, useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';

export default function CartStoreProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);
  const { user } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Cuando cambia el usuario, actual izar el ID y reinicializar
    if (user?.id !== userId) {
      setUserId(user?.id || null);
      initialized.current = false;
    }
    
    // Inicializar el store solo una vez en el cliente o cuando cambia el usuario
    if (!initialized.current) {
      initialized.current = true;
      useCartStore.persist.rehydrate();
    }
  }, [user]);
  
  return <>{children}</>;
}
