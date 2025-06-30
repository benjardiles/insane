import React from 'react';
import { Card } from '../ui/card';

interface DashboardSummaryProps {
  stats: {
    totalProducts: number;
    pendingOrders?: number;
    completedOrders?: number;
    totalRevenue?: number;
    averageRating?: number;
    totalReviews?: number;
  };
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ stats }) => {
  // Función para renderizar estrellas
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-500 text-xl">
            {star <= Math.round(rating) ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  // Asegurarse de que los valores se muestren correctamente
  console.log('Dashboard Summary Stats:', stats);
  
  const summaryItems = [
    {
      title: 'Total Products',
      value: stats.totalProducts !== undefined ? stats.totalProducts : '-',
      icon: '📦',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders !== undefined ? stats.pendingOrders : '-',
      icon: '⏳',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders !== undefined ? stats.completedOrders : '-',
      icon: '✅',
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue !== undefined ? `$${stats.totalRevenue.toFixed(2)}` : '-',
      icon: '💰',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {summaryItems.map((item) => (
        <Card key={item.title} className="p-4">
          <div className="flex items-center">
            <div className="text-3xl mr-4">{item.icon}</div>
            <div>
              <h3 className="text-lg font-medium text-gray-500">{item.title}</h3>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
      
      {/* Tarjeta de calificación mejorada con mejor responsividad */}
      <Card className="p-4">
        <div className="flex items-start">
          <div className="text-3xl mr-4 mt-1">⭐</div>
          <div className="w-full">
            <h3 className="text-lg font-medium text-gray-500 mb-2">Average Rating</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {stats.averageRating !== undefined ? stats.averageRating.toFixed(1) : '-'}
                </span>
                {stats.averageRating !== undefined && renderStars(stats.averageRating)}
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-gray-500">Based on</p>
                <p className="font-semibold">{stats.totalReviews || 0} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Reserved space for future visibility score feature */}
      <Card className="p-4 bg-gray-50 border-dashed border-2">
        <div className="flex items-center">
          <div className="text-3xl mr-4">📊</div>
          <div>
            <h3 className="text-lg font-medium text-gray-500">Visibility Score</h3>
            <p className="text-sm text-gray-400">Coming soon</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardSummary;
