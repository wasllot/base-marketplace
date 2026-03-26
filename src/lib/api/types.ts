// ─── Product Domain ───────────────────────────────────────────────────────────

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  condition: 'new' | 'used' | 'refurbished';
  brand: string;
  category: string;
  subcategory: string;
  images: string[];
  stock: number;
  sku: string;
  attributes: Record<string, unknown>;
  tags?: ProductTag[];
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: string[];
  featured?: boolean;
  createdAt?: string;
}

export type ProductTag = 'new' | 'sale' | 'exclusive' | 'limited';

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
  count?: number;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Condition {
  id: string;
  label: string;
}

// ─── Search & Filters ─────────────────────────────────────────────────────────

export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  tags?: string;
  inStock?: boolean;
  sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Cart Domain ──────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  addedAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingEstimate: number;
  total: number;
  updatedAt: string;
}

// ─── Order Domain ─────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  title: string;
  image?: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  total: number;
  shipping: number;
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number; size?: string; color?: string }>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

// ─── Wishlist Domain ──────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

// ─── User Domain ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

// ─── Studio Domain ────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
