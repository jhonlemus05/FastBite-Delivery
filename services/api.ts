import { Product, Order, OrderStatus, ProductCategory, DashboardStats, LoginCredentials, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://fastbite-delivery-backend.onrender.com/api';

export const api = {
  token: localStorage.getItem('token'),

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  },

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  },

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return res.json();
  },

  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.map((p: any) => ({ ...p, id: p._id }));
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const data = await res.json();
    return { ...data, id: data._id };
  },

  async updateProduct(product: Product): Promise<void> {
    const res = await fetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to create order');
    const data = await res.json();
    return { ...data, id: data._id };
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_URL}/orders`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.map((o: any) => ({ ...o, id: o._id }));
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_URL}/orders/dashboard`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  }
};