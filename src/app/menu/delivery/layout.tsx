"use client";

import React, { ReactNode } from "react";
import RouteGuard from "@/components/RouteGuard";

interface DeliveryLayoutProps {
  children: ReactNode;
}

export default function DeliveryLayout({ children }: DeliveryLayoutProps) {
  return (
    <RouteGuard allowedRoles={["delivery"]} redirectTo="/profile">
      {children}
    </RouteGuard>
  );
}
