'use client';

import React from 'react';
import StoreLayout from '@/components/layouts/StoreLayout';
import DashboardSummary from '@/components/store/DashboardSummary';
import RecentOrders from '@/components/store/RecentOrders';

// Mock data for demonstration
const MOCK_STATS = {
  totalProducts: 24,
  pendingOrders: 5,
  completedOrders: 42,
  totalRevenue: 1250.75,
  averageRating: 4.7,
};

const MOCK_RECENT_ORDERS = [
  {
    id: 'ORD-001',
    customer: 'Juan Pérez',
    date: '2023-05-15 14:30',
    total: 35000,
    status: 'pending' as const,
    items: [
      { name: 'Verduras Orgánicas', quantity: 1 },
      { name: 'Pan Fresco', quantity: 2 },
    ],
  },
  {
    id: 'ORD-002',
    customer: 'María González',
    date: '2023-05-15 12:15',
    total: 42500,
    status: 'processing' as const,
    items: [
      { name: 'Huevos de Campo', quantity: 1 },
      { name: 'Leche Orgánica', quantity: 1 },
      { name: 'Pasta Sin Gluten', quantity: 1 },
    ],
  },
  {
    id: 'ORD-003',
    customer: 'Roberto López',
    date: '2023-05-14 16:45',
    total: 28750,
    status: 'delivered' as const,
    items: [
      { name: 'Carne de Res Alimentada con Pasto', quantity: 1 },
      { name: 'Papas Orgánicas', quantity: 1 },
    ],
  },
  {
    id: 'ORD-004',
    customer: 'Ana Fernández',
    date: '2023-05-14 10:20',
    total: 15990,
    status: 'delivered' as const,
    items: [
      { name: 'Torta de Chocolate Vegana', quantity: 1 },
    ],
  },
];

export default function StoreDashboardPage() {
  return (
    <StoreLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Store Dashboard</h1>
        <p className="text-gray-600">Overview of your store's performance</p>
      </div>

      <div className="mb-8">
        <DashboardSummary stats={MOCK_STATS} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <RecentOrders orders={MOCK_RECENT_ORDERS} />
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <a 
                href="/menu/store/products"
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📦</div>
                  <div>
                    <h3 className="font-medium">Manage Products</h3>
                    <p className="text-sm text-gray-500">Add, edit or remove products from your catalog</p>
                  </div>
                </div>
              </a>
              <a 
                href="/menu/store/orders"
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📋</div>
                  <div>
                    <h3 className="font-medium">View All Orders</h3>
                    <p className="text-sm text-gray-500">See all orders and their statuses</p>
                  </div>
                </div>
              </a>
              <a 
                href="/menu/store/suppliers"
                className="block p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">🚚</div>
                  <div>
                    <h3 className="font-medium">Manage Suppliers</h3>
                    <p className="text-sm text-gray-500">Add or edit your supplier relationships</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
