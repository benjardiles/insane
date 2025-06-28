'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ClientLayout from '@/components/layouts/ClientLayout';
import FilterSidebar from '@/components/catalog/FilterSidebar';
import ProductGrid from '@/components/catalog/ProductGrid';
import ReviewSection from '@/components/catalog/ReviewSection';
import { storeAPI } from '@/services/api/store';
import PurchaseOptions from '@/components/catalog/PurchaseOptions';

// Tipos
interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface DeliveryOptions {
  delivery: boolean;
  pickup: boolean;
}

interface CatalogProduct {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  deliveryOptions: DeliveryOptions;
  nutritionalInfo: NutritionalInfo | null;
  image: string;
  store: string;
  store_name?: string;
}

interface ProductsApiResponse {
  data: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

interface FilterState {
  priceRange: { min: number; max: number };
  calories: { min: number; max: number };
  dietary: string[];
}

// Utilidades
const transformProductForCatalog = (product: any): CatalogProduct => {
  return {
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
  };
};

const DEFAULT_FILTERS: FilterState = {
  priceRange: { min: 0, max: 100000 },
  calories: { min: 0, max: 2000 },
  dietary: []
};

export default function CatalogPage() {
  // Estado
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loadingProductDetails, setLoadingProductDetails] = useState<boolean>(false);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);


  useEffect(() => {
    fetchProducts();
  }, [searchQuery, filters.dietary, page]);


  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = buildSearchParams();
      const response = await storeAPI.getAllPublicProducts(
        params.page,
        params.limit,
        params.search,
        params.category
      ) as ProductsApiResponse;
      
      const rawProducts = response.data || [];
      const pagination = response.pagination || { totalPages: 1 };
      
      const transformedProducts = rawProducts.map(transformProductForCatalog);
      
      setProducts(transformedProducts);
      setTotalPages(pagination.totalPages);
      setError(null);
    } catch (err: any) {
      handleError(err, 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId: string) => {
    try {
      setLoadingProductDetails(true);
      const productDetails = await storeAPI.getProduct(productId);
      return transformProductForCatalog(productDetails);
    } catch (err: any) {
      handleError(err, 'Error fetching product details');
      return null;
    } finally {
      setLoadingProductDetails(false);
    }
  };

  const fetchProductReviews = async (productId: string) => {
    try {
      setLoadingReviews(true);
      const reviews = await storeAPI.getReviews(1, 10, productId);
      setProductReviews(reviews.data || []);
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setProductReviews([]); // En caso de error, mostrar lista vacía
    } finally {
      setLoadingReviews(false);
    }
  };

  // Funciones auxiliares
  const buildSearchParams = () => {
    return {
      page,
      limit: 12,
      search: searchQuery,
      category: filters.dietary.length > 0 ? filters.dietary[0] : '',
    };
  };

  const filterProductsByClientSide = (products: CatalogProduct[]): CatalogProduct[] => {
    return products.filter(product => {
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
  };

  const handleError = (err: any, defaultMessage: string) => {
    console.error(`${defaultMessage}:`, err);
    setError(err.message || defaultMessage);
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); 
  };

  const handleProductClick = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productDetails = await fetchProductDetails(productId);
    if (productDetails) {
      setSelectedProduct(productDetails);
      setIsModalOpen(true);
      // Cargar reseñas cuando se abre el modal
      fetchProductReviews(productId);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddReview = async (rating: number, comment: string, customerName: string) => {
    if (!selectedProduct) return;
    
    try {
      await storeAPI.addReview({
        customerName,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        store_name: selectedProduct.store_name || 'Local Store',
        store_id: selectedProduct.user_id,
        rating,
        comment
      });
      
      // Recargar las reseñas después de añadir una nueva
      fetchProductReviews(selectedProduct.id);
    } catch (err: any) {
      handleError(err, 'Failed to add review');
    }
  };

  // Renderizado
  const renderProductDetails = () => {
    if (loadingProductDetails) {
      return <div className="text-center py-10">Loading product details...</div>;
    }
    
    if (!selectedProduct) {
      return <div className="text-center py-10">No product details available</div>;
    }

    return (
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
            
            {renderDeliveryOptions()}
            {renderNutritionalInfo()}
            {renderStockInfo()}
            
            {selectedProduct && (
              <PurchaseOptions
                availableOptions={{
                  delivery: selectedProduct.deliveryOptions?.delivery || false,
                  pickup: selectedProduct.deliveryOptions?.pickup || false
                }}
                productId={selectedProduct.id}
                productName={selectedProduct.name}
                productPrice={selectedProduct.price || 0}
                productImage={selectedProduct.image || '/placeholder-product.jpg'}
                storeId={selectedProduct.user_id}
                storeName={selectedProduct.store_name || 'Local Store'}
              />
            )}
          </div>
        </div>
        
        {/* Sección de reseñas */}
        {renderReviews()}
      </>
    );
  };

  const renderDeliveryOptions = () => {
    if (!selectedProduct?.deliveryOptions) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Opciones de entrega</h3>
        <div className="flex gap-3">
          {selectedProduct.deliveryOptions.delivery && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Entrega a domicilio
            </span>
          )}
          {selectedProduct.deliveryOptions.pickup && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Retiro en tienda
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderNutritionalInfo = () => {
    if (!selectedProduct?.nutritionalInfo) return null;
    
    return (
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
    );
  };

  const renderStockInfo = () => {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">Disponibilidad</h3>
        <p className="text-gray-700">
          {selectedProduct && selectedProduct.stock > 0 
            ? `${selectedProduct.stock} unidades disponibles` 
            : 'Producto agotado'}
        </p>
      </div>
    );
  };

  const renderReviews = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="mt-6 pt-6 border-t">
        <ReviewSection
          storeId={selectedProduct.user_id}
          reviews={productReviews}
          onAddReview={handleAddReview}
        />
        {loadingReviews && (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        )}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          <Button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            variant="outline"
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };


  const filteredProducts = filterProductsByClientSide(products);

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
              onFilterChange={handleFilterChange}
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
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de detalles del producto */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {renderProductDetails()}
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
