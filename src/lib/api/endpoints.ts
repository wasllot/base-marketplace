// Utilizing the BFF proxy route to hide the real API URL
const BASE = '/api/proxy';

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

  // Seller Dashboard (Protected)
  SELLER_ME:          `${BASE}/api/v1/sellers/me`,
  SELLER_PRODUCTS:    `${BASE}/api/v1/sellers/me/products`,
  SELLER_PRODUCT:     (id: string | number) => `${BASE}/api/v1/sellers/me/products/${id}`,

  // Admin Dashboard (Protected - Admin Only)
  ADMIN_STORES:       `${BASE}/api/v1/admin/stores`,
  ADMIN_STORE:        (id: string | number) => `${BASE}/api/v1/admin/stores/${id}`,
  ADMIN_STORE_IMPRS:  (id: string | number) => `${BASE}/api/v1/admin/stores/${id}/impersonate`,
  ADMIN_STORE_APPRV:  (id: string | number) => `${BASE}/api/v1/admin/stores/${id}/approve`,
  ADMIN_PRODUCTS:     `${BASE}/api/v1/admin/products`,
  ADMIN_PRODUCT:      (id: string | number) => `${BASE}/api/v1/admin/products/${id}`,

  // Image Uploads
  UPLOAD_IMAGE:       `${BASE}/api/v1/upload/image`,
} as const;
