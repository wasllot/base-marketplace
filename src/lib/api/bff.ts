/**
 * BFF (Backend for Frontend) Service Layer
 * 
 * Single Responsibility: Each service function handles one use case.
 * Open/Closed: Add new filtering strategies without modifying existing filters.
 * Dependency Inversion: Depends on Repository abstractions, not JSON files directly.
 */

import {
  Product, SearchFilters, PaginatedResponse, Category, Brand, Condition,
  Service, Order, Cart, WishlistItem, CreateOrderRequest,
} from './types';
import {
  ProductRepository, CartRepository, OrderRepository, WishlistRepository,
} from './repository';
import { NotFoundError, ValidationError, ConflictError } from './errors';
import localData from '../data/products.json';

// ─── Product Service ───────────────────────────────────────────────────────────

type SortFn = (a: Product, b: Product) => number;

const sortStrategies: Record<string, SortFn> = {
  featured:  (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
  newest:    (a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''),
  price_asc: (a, b) => a.price - b.price,
  price_desc:(a, b) => b.price - a.price,
  rating:    (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
};

export async function getAllProducts(
  filters?: SearchFilters
): Promise<PaginatedResponse<Product>> {
  let results = ProductRepository.findAll();

  // Text search across title, description, brand
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (filters?.category) {
    results = results.filter(p => p.category === filters.category);
  }

  // Subcategory filter
  if (filters?.subcategory) {
    results = results.filter(p => p.subcategory === filters.subcategory);
  }

  // Brand filter
  if (filters?.brand) {
    results = results.filter(p => p.brand === filters.brand);
  }

  // Condition filter
  if (filters?.condition) {
    results = results.filter(p => p.condition === filters.condition);
  }

  // Price range filter
  if (filters?.minPrice !== undefined) {
    results = results.filter(p => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter(p => p.price <= filters.maxPrice!);
  }

  // In-stock filter
  if (filters?.inStock) {
    results = results.filter(p => p.stock > 0);
  }

  // Tag filter
  if (filters?.tags) {
    const tags = filters.tags.split(',').map(t => t.trim());
    results = results.filter(p => p.tags?.some(t => tags.includes(t)));
  }

  // Sort
  const sortFn = sortStrategies[filters?.sort ?? 'featured'];
  if (sortFn) results.sort(sortFn);

  // Paginate
  const total = results.length;
  const page = Math.max(1, filters?.page ?? 1);
  const limit = Math.max(1, Math.min(100, filters?.limit ?? 48));
  const totalPages = Math.ceil(total / limit);
  const data = results.slice((page - 1) * limit, page * limit);

  return { data, total, page, limit, totalPages };
}

export async function getProductById(id: string): Promise<Product> {
  const product = ProductRepository.findById(id);
  if (!product) throw new NotFoundError('Product', id);
  return product;
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  if (!data.title?.trim()) throw new ValidationError('title is required');
  if (!data.price || data.price <= 0) throw new ValidationError('price must be positive');
  return ProductRepository.create(data);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const updated = ProductRepository.update(id, data);
  if (!updated) throw new NotFoundError('Product', id);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  const deleted = ProductRepository.delete(id);
  if (!deleted) throw new NotFoundError('Product', id);
}

// ─── Category / Filter Service ─────────────────────────────────────────────────

const categories: Category[] = localData.categories as Category[];
const brands: Brand[] = (localData.brands as string[]).map((name, i) => ({ id: `brand-${i}`, name }));
const conditions: Condition[] = localData.conditions;
const services: Service[] = [];

export async function getCategories() {
  // Enrich with product counts
  const all = ProductRepository.findAll();
  return categories.map(cat => ({
    ...cat,
    count: all.filter(p => p.category === cat.id).length,
  }));
}

export async function getFilterOptions() {
  return {
    categories: await getCategories(),
    brands,
    conditions,
  };
}

export async function getServices(): Promise<Service[]> {
  return services;
}

// ─── Cart Service ─────────────────────────────────────────────────────────────

export async function getCart(sessionId?: string): Promise<Cart> {
  return CartRepository.getCart(sessionId);
}

export async function addToCart(
  productId: string,
  quantity: number,
  sessionId?: string,
  opts?: { size?: string; color?: string }
): Promise<Cart> {
  if (quantity <= 0) throw new ValidationError('quantity must be greater than 0');
  const product = ProductRepository.findById(productId);
  if (!product) throw new NotFoundError('Product', productId);
  if (product.stock < quantity) throw new ValidationError('Insufficient stock');
  return CartRepository.addItem(productId, product, quantity, sessionId, opts);
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
  sessionId?: string
): Promise<Cart> {
  if (quantity < 0) throw new ValidationError('quantity cannot be negative');
  const updated = CartRepository.updateItem(itemId, quantity, sessionId);
  if (!updated) throw new NotFoundError('CartItem', itemId);
  return updated;
}

export async function removeFromCart(itemId: string, sessionId?: string): Promise<Cart> {
  const updated = CartRepository.removeItem(itemId, sessionId);
  if (!updated) throw new NotFoundError('CartItem', itemId);
  return updated;
}

// ─── Order Service ─────────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  return OrderRepository.findAll();
}

export async function getOrderById(id: string): Promise<Order> {
  const order = OrderRepository.findById(id);
  if (!order) throw new NotFoundError('Order', id);
  return order;
}

export async function createOrder(req: CreateOrderRequest): Promise<Order> {
  if (!req.items?.length) throw new ValidationError('Order must have at least one item');
  if (!req.shippingAddress) throw new ValidationError('Shipping address is required');

  const orderItems = req.items.map(item => {
    const product = ProductRepository.findById(item.productId);
    if (!product) throw new NotFoundError('Product', item.productId);
    if (product.stock < item.quantity) throw new ValidationError(`Insufficient stock for ${product.title}`);
    return {
      productId: product.id,
      title: product.title,
      image: product.images?.[0],
      quantity: item.quantity,
      price: product.price,
      size: item.size,
      color: item.color,
    };
  });

  const itemsTotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = itemsTotal > 100 ? 0 : 15;

  return OrderRepository.create({
    status: 'processing',
    items: orderItems,
    shippingAddress: req.shippingAddress,
    total: itemsTotal + shipping,
    shipping,
    paymentMethod: req.paymentMethod,
    estimatedDelivery: new Date(Date.now() + 7 * 864e5).toISOString().split('T')[0],
  });
}

// ─── Wishlist Service ─────────────────────────────────────────────────────────

export async function getWishlist(): Promise<WishlistItem[]> {
  return WishlistRepository.findAll();
}

export async function addToWishlist(productId: string): Promise<WishlistItem> {
  const product = ProductRepository.findById(productId);
  if (!product) throw new NotFoundError('Product', productId);
  const existing = WishlistRepository.findByProductId(productId);
  if (existing) throw new ConflictError('Product already in wishlist');
  return WishlistRepository.add(productId, product);
}

export async function removeFromWishlist(id: string): Promise<void> {
  const removed = WishlistRepository.remove(id);
  if (!removed) throw new NotFoundError('WishlistItem', id);
}
