import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  sub: string; // o puede que sea 'sub', 'id', etc., depende de tu backend
  // otros campos que tenga tu JWT
}


export class StoreAPI {
  private baseURL = 'http://localhost:3002/api/store';
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // GET USER INFO
  async decodeJWT() {
    const token = localStorage.getItem('token');
    let userIdFromToken = null;

    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      userIdFromToken = decoded.sub; // depende de cómo venga en tu token
      console.log('User ID from token:', userIdFromToken);
    }

    return userIdFromToken;
  }

  // DASHBOARD
  async getDashboardStats() {
    try {
      const userId = await this.decodeJWT();
      console.log('Fetching dashboard stats for user:', userId);
      const response = await axios.get(`${this.baseURL}/dashboard/${userId}`, {
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

  async getProductsByUser(userId: string, page = 1, limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/products/user/${userId}`, {
        headers: this.getHeaders(),
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for user ${userId}:`, error);
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
    if (!id) {
      throw new Error('ID de producto no proporcionado');
    }
    
    // Crear un objeto limpio con solo los campos permitidos
    const cleanData = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      stock: Number(productData.stock),
      category: productData.category,
      image: productData.image || '/placeholder-product.jpg',
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      isActive: productData.isActive !== undefined ? productData.isActive : true
    };
    
    // Añadir deliveryOptions sin el _id
    if (productData.deliveryOptions) {
      cleanData.deliveryOptions = {
        delivery: Boolean(productData.deliveryOptions.delivery),
        pickup: Boolean(productData.deliveryOptions.pickup)
      };
    }
    
    // Añadir nutritionalInfo
    if (productData.nutritionalInfo) {
      cleanData.nutritionalInfo = {
        calories: Number(productData.nutritionalInfo.calories || 0),
        protein: Number(productData.nutritionalInfo.protein || 0),
        carbs: Number(productData.nutritionalInfo.carbs || 0),
        fat: Number(productData.nutritionalInfo.fat || 0)
      };
    }
    
    // Eliminar explícitamente campos que no deben enviarse
    delete cleanData.id;
    delete cleanData._id;
    
    console.log(`Datos limpios para actualizar producto ${id}:`, cleanData);
    
    const response = await axios.patch(`${this.baseURL}/products/${id}`, cleanData, {
      headers: this.getHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    
    if (error.response) {
      console.error('Respuesta del servidor:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
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

async getSuppliersByUser(userId: string, page = 1, limit = 10) {
  try {
    // Obtener los proveedores de un usuario específico
    const response = await axios.get(`${this.baseURL}/suppliers/user/${userId}`, {
      headers: this.getHeaders(),
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching suppliers for user ${userId}:`, error);
    throw error;
  }
}
// este le sirve al admin
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
    // Obtener el ID del usuario del token
    const userId = await this.decodeJWT();
    
    // Asegurar que el proveedor esté asociado al usuario actual
    const dataToSend = {
      ...supplierData,
      user_id: userId
    };
    
    console.log('Creating supplier with data:', dataToSend);
    
    const response = await axios.post(`${this.baseURL}/suppliers`, dataToSend, {
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
    // Eliminar campos que no deberían enviarse al API
    const { id: supplierId, _id, createdAt, updatedAt, __v, ...dataToUpdate } = supplierData;
    
    // Asegurar que no se modifica el user_id
    if (dataToUpdate.user_id === undefined) {
      const userId = await this.decodeJWT();
      dataToUpdate.user_id = userId;
    }
    
    console.log(`Updating supplier ${id} with data:`, dataToUpdate);
    
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
