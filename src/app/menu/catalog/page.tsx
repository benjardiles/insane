'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ClientLayout from '@/components/layouts/ClientLayout';
import FilterSidebar from '@/components/catalog/FilterSidebar';
import ProductGrid from '@/components/catalog/ProductGrid';
import { storeAPI, Product } from '@/services/api/store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

// Interfaz para los filtros
interface Filters {
  priceRange: { min: number; max: number };
  dietary: string[];
  calories: { min: number; max: number };
}

// Interfaz para la respuesta de la API
interface ProductsApiResponse {
  data: any[];
  pagination: {
    totalPages: number;
  };
}

// Interfaz para el producto en el catálogo (extendiendo Product)
interface CatalogProduct extends Product {
  store: string; // Campo adicional específico para el catálogo
  store_name?: string;
}

export default function CatalogPage() {
  const [filters, setFilters] = useState<Filters>({
    priceRange: { min: 0, max: 100 },
    dietary: [],
    calories: { min: 0, max: 1000 },
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Estado para el modal de detalles del producto
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loadingProductDetails, setLoadingProductDetails] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const params = {
          page,
          limit: 12,
          search: searchQuery,
          category: filters.dietary.length > 0 ? filters.dietary[0] : '',
        };
        
        const response = await storeAPI.getAllPublicProducts(
          params.page,
          params.limit,
          params.search,
          params.category
        ) as ProductsApiResponse;
        
        const rawProducts = response.data || [];
        const pagination = response.pagination || { totalPages: 1 };
        
        const transformedProducts: CatalogProduct[] = rawProducts.map((product: any) => ({
          id: product.id || product._id,
          user_id: product.user_id || '',
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          stock: product.stock || 0,
          category: product.category || '',
          tags: product.tags || [],
          deliveryOptions: product.deliveryOptions || { delivery: true, pickup: true },
          nutritionalInfo: product.nutritionalInfo || null,
          image: product.image || '/placeholder-product.jpg',
          store: product.store_name || 'Local Store',
          store_name: product.store_name
        }));
        
        setProducts(transformedProducts);
        setTotalPages(pagination.totalPages);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, filters.dietary, page]);

  // Filtrado adicional en el cliente
  const filteredProducts: CatalogProduct[] = products.filter(product => {
    // Filtro de precio
    const passesPrice = product.price >= filters.priceRange.min && 
                        product.price <= filters.priceRange.max;
    
    // Filtro de calorías (si hay información nutricional)
    const passesCalories = !product.nutritionalInfo || 
                          !product.nutritionalInfo.calories ||
                          (product.nutritionalInfo.calories >= filters.calories.min && 
                           product.nutritionalInfo.calories <= filters.calories.max);
    
    return passesPrice && passesCalories;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  // Función para manejar el clic en un producto
  const handleProductClick = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Previene la navegación
    e.stopPropagation(); // Detiene la propagación del evento

    try {
      setLoadingProductDetails(true);
      const productDetails = await storeAPI.getProduct(productId);
      
      // Transformar el producto para que coincida con CatalogProduct
      const transformedProduct: CatalogProduct = {
        id: productDetails.id || productDetails._id,
        user_id: productDetails.user_id || '',
        name: productDetails.name || '',
        description: productDetails.description || '',
        price: productDetails.price || 0,
        stock: productDetails.stock || 0,
        category: productDetails.category || '',
        tags: productDetails.tags || [],
        deliveryOptions: productDetails.deliveryOptions || { delivery: true, pickup: true },
        nutritionalInfo: productDetails.nutritionalInfo || null,
        image: productDetails.image || '/placeholder-product.jpg',
        store: productDetails.store_name || 'Local Store',
        store_name: productDetails.store_name
      };
      
      setSelectedProduct(transformedProduct);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setLoadingProductDetails(false);
    }
  };
  return (
    <ClientLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Product Catalog</h1>
        <p className="text-gray-600">Browse local products from your community</p>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {loading && page === 1 ? (
        <div className="text-center py-10">Loading products...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          {error}
          <Button 
            onClick={() => setPage(1)} 
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterSidebar 
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setPage(1);
              }}
            />
          </div>
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                No products found matching your criteria.
              </div>
            ) : (
              <>
                <ProductGrid 
                  products={filteredProducts} 
                  onProductClick={handleProductClick}
                />
                
                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-4">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                        variant="outline"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de detalles del producto */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {loadingProductDetails ? (
            <div className="text-center py-10">Loading product details...</div>
          ) : selectedProduct ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  From {selectedProduct.store_name || 'Local Store'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={selectedProduct.image || '/placeholder-product.jpg'}
                    alt={selectedProduct.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                <div>
                  <div className="flex gap-2 mb-4">
                    {selectedProduct.tags && selectedProduct.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-2xl font-bold mb-4">${selectedProduct.price?.toFixed(2)}</p>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Descripción</h3>
                    <p className="text-gray-700">{selectedProduct.description || 'No description available.'}</p>
                  </div>
                  
                  {/* Delivery Options */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Opciones de entrega</h3>
                    <div className="flex gap-3">
                      {selectedProduct.deliveryOptions?.delivery && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          Entrega a domicilio
                        </span>
                      )}
                      {selectedProduct.deliveryOptions?.pickup && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          Retiro en tienda
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Nutritional Information - Complete */}
                  {selectedProduct.nutritionalInfo && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-1">Información nutricional</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedProduct.nutritionalInfo.calories !== undefined && (
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-gray-600 text-sm">Calorías</p>
                            <p className="font-medium">{selectedProduct.nutritionalInfo.calories} kcal</p>
                          </div>
                        )}
                        {selectedProduct.nutritionalInfo.protein !== undefined && (
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-gray-600 text-sm">Proteínas</p>
                            <p className="font-medium">{selectedProduct.nutritionalInfo.protein}g</p>
                          </div>
                        )}
                        {selectedProduct.nutritionalInfo.carbs !== undefined && (
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-gray-600 text-sm">Carbohidratos</p>
                            <p className="font-medium">{selectedProduct.nutritionalInfo.carbs}g</p>
                          </div>
                        )}
                        {selectedProduct.nutritionalInfo.fat !== undefined && (
                          <div className="bg-gray-100 p-2 rounded">
                            <p className="text-gray-600 text-sm">Grasas</p>
                            <p className="font-medium">{selectedProduct.nutritionalInfo.fat}g</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Stock information */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Disponibilidad</h3>
                    <p className="text-gray-700">
                      {selectedProduct.stock > 0 
                        ? `${selectedProduct.stock} unidades disponibles` 
                        : 'Producto agotado'}
                    </p>
                  </div>
                  
                  {/* Add to cart button or similar action */}
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    Añadir al carrito
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10">No product details available</div>
          )}
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
