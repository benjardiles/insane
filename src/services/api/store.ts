import axios from 'axios';

export class StoreAPI {
  private baseURL = 'http://localhost:3002/api/store';
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // DASHBOARD
  async getDashboardStats() {
    try {
      const response = await axios.get(`${this.baseURL}/dashboard`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // PRODUCTS
  async getProducts(page = 1, limit = 10, search = '') {
    try {
      const response = await axios.get(`${this.baseURL}/products`, {
        headers: this.getHeaders(),
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(id: string) {
    try {
      const response = await axios.get(`${this.baseURL}/products/${id}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async createProduct(productData: any) {
    try {
      const response = await axios.post(`${this.baseURL}/products`, productData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: any) {
    try {
      const response = await axios.patch(`${this.baseURL}/products/${id}`, productData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      const response = await axios.delete(`${this.baseURL}/products/${id}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  // ORDERS
  async getOrders(page = 1, limit = 10, status = '') {
    try {
      const params: any = { page, limit };
      if (status) params.status = status;
      
      const response = await axios.get(`${this.baseURL}/orders`, {
        headers: this.getHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrder(id: string) {
    try {
      const response = await axios.get(`${this.baseURL}/orders/${id}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: string) {
    try {
      const response = await axios.patch(`${this.baseURL}/orders/${id}/status`, { status }, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id} status:`, error);
      throw error;
    }
  }

// SUPPLIERS
async getSuppliers(page = 1, limit = 10, search = '') {
  try {
    // Obtener todos los proveedores con paginación y búsqueda opcional
    const response = await axios.get(`${this.baseURL}/suppliers`, {
      headers: this.getHeaders(),
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
}

async getSupplier(id: string) {
  try {
    // Obtener un proveedor específico por su ID
    const response = await axios.get(`${this.baseURL}/suppliers/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching supplier ${id}:`, error);
    throw error;
  }
}

async createSupplier(supplierData: any) {
  try {
    // Ensure supplierData has all required fields
    const response = await axios.post(`${this.baseURL}/suppliers`, supplierData, {
      headers: this.getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
}

async updateSupplier(id: string, supplierData: any) {
  try {
    // Remove any fields that shouldn't be sent to the API
    const { id: supplierId, ...dataToUpdate } = supplierData;
    
    // Actualizar un proveedor existente por su ID
    const response = await axios.patch(`${this.baseURL}/suppliers/${id}`, dataToUpdate, {
      headers: this.getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating supplier ${id}:`, error);
    throw error;
  }
}

async deleteSupplier(id: string) {
  try {
    // Eliminar un proveedor por su ID
    const response = await axios.delete(`${this.baseURL}/suppliers/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting supplier ${id}:`, error);
    throw error;
  }
}

  // REVIEWS
  async getReviews(page = 1, limit = 10, productId = '') {
    try {
      const params: any = { page, limit };
      if (productId) params.productId = productId;
      
      const response = await axios.get(`${this.baseURL}/reviews`, {
        headers: this.getHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  async replyToReview(id: string, reply: string) {
    try {
      const response = await axios.patch(`${this.baseURL}/reviews/${id}/reply`, { reply }, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error replying to review ${id}:`, error);
      throw error;
    }
  }
}

export const storeAPI = new StoreAPI();

