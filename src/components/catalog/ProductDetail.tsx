import React from 'react';
import { Card } from '../ui/card';

interface ProductDetailProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  store: {
    name: string;
    rating: number;
  };
  tags: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  name,
  description,
  price,
  image,
  store,
  tags,
  nutritionalInfo
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div 
            className="h-64 md:h-full bg-center bg-cover"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
        <div className="p-6 md:w-1/2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{name}</h1>
              <p className="text-gray-600 mb-4">by {store.name}</p>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{store.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-3xl font-bold">${price.toFixed(2)}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{description}</p>
          </div>
          
          {nutritionalInfo && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Nutritional Information</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-medium">{nutritionalInfo.calories} kcal</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm text-gray-500">Protein</p>
                  <p className="font-medium">{nutritionalInfo.protein}g</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm text-gray-500">Carbs</p>
                  <p className="font-medium">{nutritionalInfo.carbs}g</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm text-gray-500">Fat</p>
                  <p className="font-medium">{nutritionalInfo.fat}g</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductDetail;
