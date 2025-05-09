import React from 'react';
import { Card } from '../ui/card';

interface DashboardSummaryProps {
  stats: {
    totalProducts: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    averageRating: number;
  };
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ stats }) => {
  const summaryItems = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: '⏳',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: '✅',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: '💰',
    },
    {
      title: 'Average Rating',
      value: `${stats.averageRating.toFixed(1)} ★`,
      icon: '⭐',
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
