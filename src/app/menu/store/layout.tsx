"use client";

import React, { ReactNode } from "react";
import RouteGuard from "@/components/RouteGuard";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <RouteGuard allowedRoles={["tienda", "store", "seller"]} redirectTo="/profile">
      {children}
    </RouteGuard>
  );
}
