'use client';

import React, { useState } from 'react';
import ClientLayout from '@/components/layouts/ClientLayout';
import FilterSidebar from '@/components/catalog/FilterSidebar';
import ProductGrid from '@/components/catalog/ProductGrid';

// Mock data for demonstration
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Arepas de Maíz',
    price: 8.99,
    image: 'https://www.elespectador.com/resizer/v2/HKQZLHLTJRBT3A5H4EBTYADY5Q.jpg?auth=c1c4b13ece48adc050017e2189df8cfd184d77daded022567fd78d0221c9882c&width=920&height=613&smart=true&quality=60',
    store: 'Sabores Colombianos',
    tags: ['gluten-free', 'vegetarian'],
  },
  {
    id: '2',
    name: 'Empanadas Argentinas',
    price: 10.50,
    image: 'https://www.infobae.com/resizer/v2/NQ3JJCL5KFBRFLHUV4FO4JUHXU.jpg?auth=f8ee476cf55f45c2953132b3206c92d1244ebfeb2014706dc2e858082569eaf3&smart=true&width=1200&height=900&quality=85',
    store: 'Delicias Criollas',
    tags: ['homemade', 'meat'],
  },
  {
    id: '3',
    name: 'Tacos al Pastor',
    price: 12.00,
    image: 'https://i.blogs.es/92fc7c/como-preparar-carne-para-tacos-al-pastor-1-/650_1200.jpg',
    store: 'Taquería El Buen Sabor',
    tags: ['spicy', 'mexican'],
  },
  {
    id: '4',
    name: 'Ceviche Peruano',
    price: 15.99,
    image: 'https://i0.wp.com/lacocinalatina.club/wp-content/uploads/2024/05/Ceviche-Peruano-de-pescado-La-Cocina-Latina.jpg?fit=700%2C467&ssl=1',
    store: 'Sabores del Pacífico',
    tags: ['seafood', 'gluten-free'],
  },
  {
    id: '5',
    name: 'Dulce de Leche Alfajores',
    price: 6.50,
    image: 'https://www.pequerecetas.com/wp-content/uploads/2019/06/alfajores-argentinos-de-maicena-con-dulce-de-leche.jpg',
    store: 'Postres Argentinos',
    tags: ['dessert', 'sweet'],
  },
  {
    id: '6',
    name: 'Churros con Chocolate',
    price: 7.99,
    image: 'https://www.manzanaroja.eu/wp-content/uploads/2023/12/churros-con-chocolate-receta.webp',
    store: 'Dulces Españoles',
    tags: ['dessert', 'vegetarian'],
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
