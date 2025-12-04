export enum ProductCategory {
  BURGER = 'Hamburguesas',
  PIZZA = 'Pizzas',
  DRINK = 'Bebidas',
  DESSERT = 'Postres'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'Pendiente',
  PREPARING = 'Preparando',
  DELIVERED = 'Entregado',
  CANCELLED = 'Cancelado'
}

export interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string; // ISO String
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer';
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  popularCategory: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}