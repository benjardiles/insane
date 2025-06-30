"use client";

import React, { ReactNode } from "react";
import RouteGuard from "@/components/RouteGuard";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RouteGuard allowedRoles={["admin"]} redirectTo="/profile">
      {children}
    </RouteGuard>
  );
}