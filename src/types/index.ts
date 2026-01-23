export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'men' | 'women' | 'children' | 'accessories';
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  stock: number;
  featured: boolean;
  createdAt: Date;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  status: OrderStatus;
  total: number;
  shippingCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface DashboardStats {
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  verified: boolean;
}
