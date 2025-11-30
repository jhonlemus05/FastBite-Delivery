import { Product, Order, OrderStatus, ProductCategory, DashboardStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://fastbite-delivery-backend.onrender.com/api';

export const api = {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    const data = await res.json();
    return { ...data, id: data._id };
  },

  async updateProduct(product: Product): Promise<void> {
    const res = await fetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to create order');
    const data = await res.json();
    return { ...data, id: data._id };
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.map((o: any) => ({ ...o, id: o._id }));
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_URL}/orders/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  }
};