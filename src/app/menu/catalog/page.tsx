'use client';

import React, { useState } from 'react';
import ClientLayout from '@/components/layouts/ClientLayout';
import FilterSidebar from '@/components/catalog/FilterSidebar';
import ProductGrid from '@/components/catalog/ProductGrid';

// Mock data for demonstration
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Organic Vegetables',
    price: 12.99,
    image: '/images/products/vegetables.jpg',
    store: 'Green Market',
    tags: ['organic', 'vegetarian', 'vegan'],
  },
  {
    id: '2',
    name: 'Artisan Bread',
    price: 5.99,
    image: '/images/products/bread.jpg',
    store: 'Local Bakery',
    tags: ['homemade', 'vegetarian'],
  },
  {
    id: '3',
    name: 'Free-Range Eggs',
    price: 4.50,
    image: '/images/products/eggs.jpg',
    store: 'Farm Fresh',
    tags: ['organic', 'free-range'],
  },
  {
    id: '4',
    name: 'Grass-Fed Beef',
    price: 18.99,
    image: '/images/products/beef.jpg',
    store: 'Butcher Shop',
    tags: ['grass-fed', 'high-protein'],
  },
  {
    id: '5',
    name: 'Gluten-Free Pasta',
    price: 6.99,
    image: '/images/products/pasta.jpg',
    store: 'Pasta House',
    tags: ['gluten-free', 'vegetarian'],
  },
  {
    id: '6',
    name: 'Vegan Chocolate Cake',
    price: 24.99,
    image: '/images/products/cake.jpg',
    store: 'Sweet Treats',
    tags: ['vegan', 'dairy-free'],
  },
];

export default function CatalogPage() {
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 100 },
    dietary: [] as string[],
    calories: { min: 0, max: 1000 },
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on current filters
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    // Price filter
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
      return false;
    }

    // Dietary preferences filter
    if (filters.dietary.length > 0) {
      const hasMatchingTag = filters.dietary.some(tag => 
        product.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.store.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <ClientLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Product Catalog</h1>
        <p className="text-gray-600">Browse local products from your community</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar 
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </ClientLayout>
  );
}
