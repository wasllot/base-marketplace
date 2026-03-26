/**
 * Repository Layer — Data Access Abstraction
 * 
 * Single Responsibility: Each repository handles one domain's data access.
 * Open/Closed: Extend via new repositories, don't modify existing ones.
 * Dependency Inversion: Services depend on repository interfaces, not JSON files.
 */

import localData from '../data/products.json';
import { Product, Order, Cart, CartItem, WishlistItem } from './types';

// ─── In-memory stores (replace with DB in production) ─────────────────────────

let productsStore: Product[] = localData.products as Product[];

// Cart: keyed by session ID (using 'default' for demo)
const cartsStore: Map<string, Cart> = new Map();

// Orders store (starts with sample data)
let ordersStore: Order[] = (localData.orders as Order[]).map(o => ({
  ...o,
  status: o.status as Order['status'],
  items: o.items.map(item => {
    const product = productsStore.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      title: product?.title ?? 'Producto',
      image: product?.images?.[0],
      quantity: item.quantity,
      price: item.price,
    };
  }),
}));

// Wishlist store
let wishlistStore: WishlistItem[] = [];

// ─── Product Repository ────────────────────────────────────────────────────────

export const ProductRepository = {
  findAll(): Product[] {
    return [...productsStore];
  },

  findById(id: string): Product | null {
    return productsStore.find(p => p.id === id) ?? null;
  },

  create(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    productsStore.push(newProduct);
    return newProduct;
  },

  update(id: string, updates: Partial<Product>): Product | null {
    const idx = productsStore.findIndex(p => p.id === id);
    if (idx === -1) return null;
    productsStore[idx] = { ...productsStore[idx], ...updates };
    return productsStore[idx];
  },

  delete(id: string): boolean {
    const before = productsStore.length;
    productsStore = productsStore.filter(p => p.id !== id);
    return productsStore.length < before;
  },
};

// ─── Cart Repository ───────────────────────────────────────────────────────────

const CART_SESSION = 'default';

function calculateCartTotals(items: CartItem[]): Pick<Cart, 'subtotal' | 'shippingEstimate' | 'total'> {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingEstimate = subtotal > 100 ? 0 : 15;
  return { subtotal, shippingEstimate, total: subtotal + shippingEstimate };
}

export const CartRepository = {
  getCart(sessionId: string = CART_SESSION): Cart {
    if (!cartsStore.has(sessionId)) {
      cartsStore.set(sessionId, {
        id: sessionId,
        items: [],
        subtotal: 0,
        shippingEstimate: 0,
        total: 0,
        updatedAt: new Date().toISOString(),
      });
    }
    return cartsStore.get(sessionId)!;
  },

  addItem(
    productId: string,
    product: Product,
    quantity: number,
    sessionId: string = CART_SESSION,
    opts?: { size?: string; color?: string }
  ): Cart {
    const cart = this.getCart(sessionId);
    const existing = cart.items.find(
      i => i.productId === productId && i.size === opts?.size && i.color === opts?.color
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        id: `ci-${Date.now()}`,
        productId,
        product,
        quantity,
        size: opts?.size,
        color: opts?.color,
        addedAt: new Date().toISOString(),
      });
    }

    Object.assign(cart, calculateCartTotals(cart.items));
    cart.updatedAt = new Date().toISOString();
    cartsStore.set(sessionId, cart);
    return cart;
  },

  updateItem(itemId: string, quantity: number, sessionId: string = CART_SESSION): Cart | null {
    const cart = this.getCart(sessionId);
    const item = cart.items.find(i => i.id === itemId);
    if (!item) return null;

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.id !== itemId);
    } else {
      item.quantity = quantity;
    }

    Object.assign(cart, calculateCartTotals(cart.items));
    cart.updatedAt = new Date().toISOString();
    cartsStore.set(sessionId, cart);
    return cart;
  },

  removeItem(itemId: string, sessionId: string = CART_SESSION): Cart | null {
    const cart = this.getCart(sessionId);
    const before = cart.items.length;
    cart.items = cart.items.filter(i => i.id !== itemId);
    if (cart.items.length === before) return null;

    Object.assign(cart, calculateCartTotals(cart.items));
    cart.updatedAt = new Date().toISOString();
    cartsStore.set(sessionId, cart);
    return cart;
  },

  clearCart(sessionId: string = CART_SESSION): void {
    cartsStore.delete(sessionId);
  },
};

// ─── Order Repository ──────────────────────────────────────────────────────────

export const OrderRepository = {
  findAll(): Order[] {
    return [...ordersStore];
  },

  findById(id: string): Order | null {
    return ordersStore.find(o => o.id === id) ?? null;
  },

  create(order: Omit<Order, 'id' | 'date'>): Order {
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(ordersStore.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString(),
    };
    ordersStore.push(newOrder);
    return newOrder;
  },

  updateStatus(id: string, status: Order['status']): Order | null {
    const order = ordersStore.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
  },
};

// ─── Wishlist Repository ───────────────────────────────────────────────────────

export const WishlistRepository = {
  findAll(): WishlistItem[] {
    return [...wishlistStore];
  },

  findById(id: string): WishlistItem | null {
    return wishlistStore.find(w => w.id === id) ?? null;
  },

  findByProductId(productId: string): WishlistItem | null {
    return wishlistStore.find(w => w.productId === productId) ?? null;
  },

  add(productId: string, product: Product): WishlistItem {
    const item: WishlistItem = {
      id: `wl-${Date.now()}`,
      productId,
      product,
      addedAt: new Date().toISOString(),
    };
    wishlistStore.push(item);
    return item;
  },

  remove(id: string): boolean {
    const before = wishlistStore.length;
    wishlistStore = wishlistStore.filter(w => w.id !== id);
    return wishlistStore.length < before;
  },
};
