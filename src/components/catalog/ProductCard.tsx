import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/card';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  store: string;
  tags: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  store,
  tags
}) => {
  return (
    <Link href={`/menu/catalog/${id}`}>
      <Card className="overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-100">
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <p className="text-gray-500 text-sm mb-2">by {store}</p>
          <p className="font-bold text-lg mb-2">${price.toFixed(2)}</p>
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
      </Card>
    </Link>
  );
};

export default ProductCard;
