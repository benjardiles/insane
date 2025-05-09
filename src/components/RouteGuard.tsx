"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles,
  redirectTo = "/profile",
}) => {
  const { user, loading, checkUserRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir a login
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // Si hay usuario pero no tiene el rol permitido, redirigir
    if (!loading && user && !checkUserRole(allowedRoles)) {
      router.push(redirectTo);
    }
  }, [user, loading, allowedRoles, redirectTo, router, checkUserRole]);

  // Mostrar un indicador de carga mientras se verifica
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3E9] flex items-center justify-center">
        <div className="text-[#D05A44]">Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado o no tiene el rol adecuado, no mostrar nada
  // (la redirección se manejará en el useEffect)
  if (!user || !checkUserRole(allowedRoles)) {
    return null;
  }

  // Si está autenticado y tiene el rol adecuado, mostrar el contenido
  return <>{children}</>;
};

export default RouteGuard;
