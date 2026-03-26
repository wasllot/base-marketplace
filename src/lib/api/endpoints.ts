const BASE = 'https://api.reinaldotineo.online';

export const API = {
  // Auth
  LOGIN:    `${BASE}/api/auth/login`,
  REGISTER: `${BASE}/api/auth/register`,

  // Catalog (public)
  PRODUCTS:          `${BASE}/api/v1/products`,
  PRODUCTS_FEATURED: `${BASE}/api/v1/products/featured`,
  PRODUCT:           (id: string | number) => `${BASE}/api/v1/products/${id}`,
  CATEGORIES:        `${BASE}/api/v1/categories`,
  CATEGORY:          (id: string | number) => `${BASE}/api/v1/categories/${id}`,
  SEARCH_FILTERS:    `${BASE}/api/v1/search/filters`,
  STORES:            `${BASE}/api/v1/stores`,
  STORE:             (id: string | number) => `${BASE}/api/v1/stores/${id}`,

  // Cart (protected)
  CART:           `${BASE}/api/v1/cart`,
  CART_ITEMS:     `${BASE}/api/v1/cart/items`,
  CART_ITEM:      (id: string | number) => `${BASE}/api/v1/cart/items/${id}`,

  // Orders (protected)
  ORDERS:       `${BASE}/api/v1/orders`,
  ORDER_TRACK:  (id: string | number) => `${BASE}/api/v1/orders/${id}/track`,

  // User Profile (protected)
  USER:         `${BASE}/api/v1/user`,
  USER_PROFILE: `${BASE}/api/v1/user/profile`,
  WISHLIST:     `${BASE}/api/v1/wishlist`,
} as const;
