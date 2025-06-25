import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  store: string;
  tags: string[];
}

interface ProductGridProps {
  products: Product[];
  onProductClick: (productId: string, e: React.MouseEvent) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          onClick={(e) => onProductClick(product.id, e)}
          className="cursor-pointer"
        >
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            store={product.store}
            tags={product.tags}
          />
        </div>
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;