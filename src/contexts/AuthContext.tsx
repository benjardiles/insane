"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProfile, logout } from "@/services/api/auth";

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  account_type: string;
  store_name?: string;
  store_address?: string;
  store_phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkUserRole: (allowedRoles: string[]) => boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Normaliza los tipos de cuenta para comparaciones consistentes
  const normalizeAccountType = (type: string): string => {
    type = type.toLowerCase();
    
    if (type === "tienda" || type === "store" || type === "seller") {
      return "tienda";
    } else if (type === "delivery" || type === "repartidor") {
      return "delivery";
    } else if (type === "admin" || type === "administrator") {
      return "admin";
    } else {
      return "normal"; // Cliente normal
    }
  };

  const checkUserRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    
    const normalizedUserRole = normalizeAccountType(user.account_type);
    return allowedRoles.some(role => normalizeAccountType(role) === normalizedUserRole);
  };

  const refreshUserData = async () => {
    setLoading(true);
    try {
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await logout(token);
      setUser(null);
      router.push("/login");
    }
  };

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user profile:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  // Redirigir a login si no hay autenticación y la ruta requiere autenticación
  useEffect(() => {
    const protectedRoutes = ['/menu', '/profile'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    if (!loading && !user && isProtectedRoute) {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    checkUserRole,
    logout: handleLogout,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
