'use client';
import React from 'react';
import { Card } from '@/components/ui/card';

interface SalesData {
  month: string;
  sales: number;
}

interface AdminChartsProps {
  salesData: SalesData[];
}

const AdminCharts: React.FC<AdminChartsProps> = ({ salesData }) => {
  // Aquí normalmente usarías una biblioteca de gráficos como Chart.js o Recharts
  // Para este ejemplo, mostraremos una representación simple

  // Encontrar el valor máximo para calcular las alturas relativas
  const maxSales = Math.max(...salesData.map(item => item.sales));
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tendencia de Ventas</h3>
      
      <div className="flex items-end justify-between h-64 mt-4">
        {salesData.map((item, index) => {
          const heightPercentage = (item.sales / maxSales) * 100;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-12 bg-blue-500 rounded-t-md" 
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <p className="text-xs mt-2">{item.month}</p>
              <p className="text-xs font-medium">${(item.sales / 1000).toFixed(0)}K</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-right">
        <p className="text-sm text-gray-500">
          * Los datos mostrados son para los últimos 6 meses
        </p>
      </div>
    </Card>
  );
};

export default AdminCharts;