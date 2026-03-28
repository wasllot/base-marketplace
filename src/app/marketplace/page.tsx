'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

// ─── API types ────────────────────────────────────────────────────────────────

interface ApiProduct {
  id: number | string;
  name?: string;
  title?: string;
  price: number | string;
  original_price?: number;
  description?: string;
  image?: string;
  images?: string[] | { url: string }[];
  category?: { id: number | string; name: string } | string;
  stock?: number;
  is_featured?: boolean;
  slug?: string;
}

interface ApiCategory {
  id: number | string;
  name: string;
  slug?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80';

function getImg(p: ApiProduct): string {
  if (p.image) return p.image;
  const imgs = p.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (typeof first === 'string') return first;
    if (typeof first === 'object' && 'url' in first) return (first as { url: string }).url;
  }
  return FALLBACK_IMG;
}

function getCatName(p: ApiProduct): string {
  if (!p.category) return '';
  if (typeof p.category === 'string') return p.category;
  return (p.category as { name: string }).name;
}

// ─── Hero images ──────────────────────────────────────────────────────────────

const HERO_IMGS = [
  'https://pub-9e599175b00a4fe9b7dfce1c3f8a091a.r2.dev/images/lifestyle_fashion_image_representing_the_target_audience.jpeg',
  'https://pub-9e599175b00a4fe9b7dfce1c3f8a091a.r2.dev/images/conceptual_visual_representing_the_urban_identity_and.jpeg',
  'https://pub-9e599175b00a4fe9b7dfce1c3f8a091a.r2.dev/images/conceptual_fashion_brand_image_representing_identity_confidence.jpeg',
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 8, height: 8,
          background: i <= 4 ? '#000' : '#D3D3D3',
          clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
        }} />
      ))}
    </div>
  );
}

function ProductCard({ product, onAddToCart, onToggleWishlist, wishlisted }: {
  product: ApiProduct;
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlisted: boolean;
}) {
  const img = getImg(product);
  const price = Number(product.price);
  const origPrice = product.original_price ? Number(product.original_price) : null;
  const hasSale = origPrice && origPrice > price;
  const stock = product.stock ?? 999;
  const tagLabel = hasSale ? 'sale' : stock < 10 ? 'limited' : 'new';
  const catName = getCatName(product);
  const productName = product.name ?? product.title ?? '';

  const tagStyles: Record<string, React.CSSProperties> = {
    new:     { background: '#000', color: '#fff' },
    sale:    { background: '#c0392b', color: '#fff' },
    limited: { background: '#fff', color: '#000', border: '1px solid #000' },
  };

  return (
    <div className="mp-product-card">
      <Link href={`/marketplace/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: 1 }}>
        <div className="mp-product-img">
          <img src={img} alt={productName} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.3rem 0.65rem', fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.12rem', textTransform: 'uppercase', zIndex: 2, pointerEvents: 'none', ...tagStyles[tagLabel] }}>
            {tagLabel === 'sale' ? `−${Math.round((1 - price / origPrice!) * 100)}%` : tagLabel === 'new' ? 'Nuevo' : 'Limitado'}
          </div>
          <button className="mp-wishlist-btn" onClick={(e) => { e.preventDefault(); onToggleWishlist(String(product.id)); }} style={{ background: '#fff', border: 'none', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: '#000', fill: wishlisted ? '#000' : 'none', strokeWidth: 1.5 }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <div className="mp-quick-add">
            <button className="mp-quick-add-btn" onClick={(e) => { e.preventDefault(); onAddToCart(String(product.id)); }}>+ Agregar</button>
          </div>
        </div>
        <div className="mp-product-info">
          <div className="mp-product-meta">
            <div className="mp-product-cat">{catName}</div>
            <StarRating />
          </div>
          <div className="mp-product-title">{productName}</div>
        </div>
      </Link>
      <div className="mp-product-price-container">
        <div className="mp-product-price-row">
          <div className="mp-product-price-current" style={{ color: hasSale ? '#c0392b' : '#000' }}>${price.toLocaleString('es-AR')}</div>
          {hasSale && <div className="mp-product-price-old">${origPrice!.toLocaleString('es-AR')}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function MarketplaceContent() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [activePill, setActivePill] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Load categories on mount
  useEffect(() => {
    apiFetch<{ data: ApiCategory[] } | ApiCategory[]>(API.CATEGORIES)
      .then(d => setCategories(Array.isArray(d) ? d : (d as { data: ApiCategory[] }).data ?? []))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedCategory ? `${API.PRODUCTS}?category=${selectedCategory}` : API.PRODUCTS;
      const data = await apiFetch<{ data: ApiProduct[] } | ApiProduct[]>(url);
      let list = Array.isArray(data) ? data : (data as { data: ApiProduct[] }).data ?? [];

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(p =>
          (p.name ?? p.title ?? '').toLowerCase().includes(q) ||
          getCatName(p).toLowerCase().includes(q)
        );
      }
      if (priceMin) list = list.filter(p => Number(p.price) >= Number(priceMin));
      if (priceMax) list = list.filter(p => Number(p.price) <= Number(priceMax));
      if (sortBy === 'price_asc') list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
      if (sortBy === 'price_desc') list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
      if (sortBy === 'featured') list = [...list].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

      setProducts(list);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, priceMin, priceMax, sortBy]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 250);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleAddToCart(productId: string) {
    setCartCount(c => c + 1);
    showToast('Agregado al carrito');
    apiFetch(API.CART_ITEMS, { method: 'POST', body: { product_id: productId, quantity: 1 } }).catch(() => {});
  }

  function handleToggleWishlist(productId: string) {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(productId)) { next.delete(productId); showToast('Eliminado de favoritos'); }
      else { next.add(productId); showToast('Agregado a favoritos'); apiFetch(API.WISHLIST, { method: 'POST', body: { product_id: productId } }).catch(() => {}); }
      return next;
    });
  }

  function clearFilters() {
    setSelectedCategory(''); setPriceMin(''); setPriceMax(''); setActivePill('Todos'); setSearchQuery('');
  }

  // Derive pills from real categories
  const pills = ['Todos', ...categories.slice(0, 5).map(c => c.name)];

  return (
    <>
      {/* ─── Toast ─── */}
      {toast && (
        <div style={{ position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 8000, background: '#000', color: '#fff', padding: '0.8rem 1.4rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1rem', textTransform: 'uppercase', animation: 'slideInRight 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* ─── Nav ─── */}
      <nav className="mp-nav">
        <div className="mp-nav-left">
          <Link href="/" className="mp-nav-home">
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}><polyline points="15 18 9 12 15 6"/></svg>
            <span className="mp-nav-home-text">Inicio</span>
          </Link>
          <div className="mp-nav-divider" />
          <Link href="/" className="mp-nav-logo">BASE</Link>
        </div>
        <div className="mp-nav-center">Marketplace</div>
        <div className="mp-nav-right">
          <div className="mp-nav-search">
            <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: '#A9A9A9', fill: 'none', strokeWidth: 2, flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Link href="/cuenta" className="mp-nav-account">
            <svg className="mp-nav-icon-mobile" viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5, display: 'none' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="mp-nav-account-text">Mi Cuenta</span>
          </Link>
          <div className="mp-nav-cart" onClick={() => {}}> 
            <svg className="mp-nav-icon-mobile" viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5, display: 'none' }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="mp-nav-cart-text">Carrito</span>
            {cartCount > 0 && <div className="mp-nav-cart-badge">{cartCount}</div>}
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <div className="mp-hero-banner">
        {[
          { tag: 'Temporada 2026', title: 'Nueva\nColección', link: 'Explorar', img: HERO_IMGS[0] },
          { tag: 'Accesorios', title: 'Piezas\nEsenciales', link: 'Ver todo', img: HERO_IMGS[1] },
          { tag: 'Exclusivo', title: 'Drops\nLimitados', link: 'Descubrir', img: HERO_IMGS[2] },
        ].map((col, i) => (
          <div key={i} className="mp-hero-col">
            <div className="mp-hero-col-bg">
              <img src={col.img} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
            </div>
            <div className="mp-hero-col-content">
              <div className="mp-hero-col-tag">{col.tag}</div>
              <div className="mp-hero-col-title">{col.title}</div>
              <a href="#" className="mp-hero-col-link">
                {col.link}
                <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Toolbar ─── */}
      <div className="mp-toolbar">
        <div className="mp-breadcrumbs">
          <Link href="/">Inicio</Link>
          <span>›</span>
          <strong>Marketplace</strong>
        </div>
        <div className="mp-toolbar-actions">
          <span className="mp-toolbar-count">
            {loading ? 'Cargando...' : `${products.length} productos`}
          </span>
          <button className="mp-toolbar-filter-btn" onClick={() => setIsMobileFiltersOpen(true)}>
            Filtros
          </button>
          <div className="mp-toolbar-sort">
            <span className="mp-toolbar-sort-label">Ordenar:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Destacados</option>
              <option value="newest">Más recientes</option>
              <option value="price_asc">Menor a mayor</option>
              <option value="price_desc">Mayor a menor</option>
            </select>
          </div>
          <div className="mp-toolbar-grid-toggles">
            {([3, 4] as const).map(n => (
              <button key={n} onClick={() => setGridCols(n)} className={gridCols === n ? 'active' : ''}>
                <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}>
                  {n === 3 ? <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="mp-layout-container">

        {/* Sidebar */}
        <aside className={`mp-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
          
          <div className="mp-sidebar-mobile-header">
            <span style={{ fontWeight: 700, letterSpacing: '0.15rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Filtros</span>
            <button onClick={() => setIsMobileFiltersOpen(false)} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
          </div>

          {/* Category — live from API */}
          <div className="mp-filter-section">
            <div className="mp-filter-title">Categoría</div>
            <div className="mp-filter-options">
              {[{ id: '', name: 'Todos' }, ...categories].map(c => (
                <label key={String(c.id)} className="mp-filter-label">
                  <input type="checkbox" checked={selectedCategory === String(c.id)}
                    onChange={() => setSelectedCategory(c.id === '' ? '' : String(c.id))}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mp-filter-section">
            <div className="mp-filter-title">Precio</div>
            <div className="mp-price-inputs">
              <input type="text" placeholder="$0" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
              <span>—</span>
              <input type="text" placeholder="$200.000" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
            </div>
          </div>

          <button onClick={clearFilters} className="mp-clear-filters">
            Limpiar filtros
          </button>
        </aside>

        {/* Main */}
        <main className="mp-main-content">

          {/* Pill filters */}
          <div className="mp-pills">
            {pills.map(pill => (
              <button key={pill}
                onClick={() => {
                  setActivePill(pill);
                  if (pill === 'Todos') setSelectedCategory('');
                  else {
                    const match = categories.find(c => c.name === pill);
                    if (match) setSelectedCategory(String(match.id));
                  }
                }}
                className={`mp-pill-btn ${activePill === pill ? 'active' : ''}`}>
                {pill}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, fontSize: '0.7rem', color: '#A9A9A9', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>
              Cargando productos...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', fontSize: '0.75rem', color: '#A9A9A9' }}>
              No se encontraron productos
              <br /><br />
              <button onClick={clearFilters} style={{ padding: '0.7rem 1.5rem', border: '1px solid #000', background: 'transparent', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15rem', textTransform: 'uppercase' }}>
                Ver todos
              </button>
            </div>
          ) : (
            <div className="mp-products-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
              {products.map((product, i) => (
                <React.Fragment key={product.id}>
                  {i === 6 && (
                    <div style={{ gridColumn: '1 / -1', height: 200, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3rem', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#111 0%,#333 60%,#555 100%)', opacity: 0.8 }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.3rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.6rem' }}>Studio · Servicios Digitales</div>
                        <div style={{ fontSize: '2rem', fontWeight: 200, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Construimos marcas<br /><strong style={{ fontWeight: 800 }}>desde cero.</strong></div>
                      </div>
                    </div>
                  )}
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    wishlisted={wishlist.has(String(product.id))}
                  />
                </React.Fragment>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ─── Recently Viewed ─── */}
      {products.length > 0 && (
        <div style={{ borderTop: '1px solid #ebebeb', padding: '3rem 2.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>Vistos recientemente</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 1, background: '#ebebeb', marginBottom: '3rem' }}>
            {products.slice(0, 5).map(product => (
              <Link key={product.id} href={`/marketplace/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', background: '#fff' }}>
                <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                  <img src={getImg(product)} alt={product.name ?? product.title ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                </div>
                <div style={{ padding: '0.8rem 1rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, marginBottom: '0.3rem' }}>{product.name ?? product.title}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 300, color: '#2a2a2a' }}>${Number(product.price).toLocaleString('es-AR')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ─── Styles ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background: #fff; color: #000; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: #000; }

        .mp-hero-col:hover .mp-hero-col-bg { transform: scale(1.04); }

        .mp-products-grid {
          display: grid;
          gap: 0;
          border-top: 1px solid #ebebeb;
          border-left: 1px solid #ebebeb;
        }

        .mp-product-card {
          border-right: 1px solid #ebebeb;
          border-bottom: 1px solid #ebebeb;
          position: relative;
          background: #fff;
          transition: background 0.3s;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .mp-product-info { padding: 1.2rem 1.4rem 0; }
        .mp-product-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem; }
        .mp-product-cat { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.2rem; text-transform: uppercase; color: #A9A9A9; }
        .mp-product-title { font-size: 0.82rem; font-weight: 600; letter-spacing: 0.03em; color: #000; margin-bottom: 0.6rem; line-height: 1.3; }
        .mp-product-price-container { padding: 0 1.4rem 1.4rem; margin-top: auto; }
        .mp-product-price-row { display: flex; align-items: baseline; gap: 0.6rem; }
        .mp-product-price-current { font-size: 0.82rem; font-weight: 700; }
        .mp-product-price-old { font-size: 0.72rem; font-weight: 300; color: #A9A9A9; text-decoration: line-through; }
        .mp-product-card:hover { background: #f7f7f7; }

        .mp-product-img {
          aspect-ratio: 3/4;
          overflow: hidden;
          position: relative;
          background: #ebebeb;
        }
        .mp-product-card:hover .mp-product-img img { transform: scale(1.05); }

        .mp-wishlist-btn {
          position: absolute; top: 1rem; right: 1rem; z-index: 2;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border: none;
          opacity: 0; transform: translateY(-4px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .mp-product-card:hover .mp-wishlist-btn { opacity: 1; transform: translateY(0); }

        .mp-quick-add {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
          display: flex;
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .mp-product-card:hover .mp-quick-add { transform: translateY(0); }

        .mp-quick-add-btn {
          flex: 1; padding: 0.85rem;
          background: #000; color: #fff; border: none; cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.15rem; text-transform: uppercase;
          transition: background 0.25s;
        }
        .mp-quick-add-btn:hover { background: #2a2a2a; }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* --- New Responsive Classes --- */
        .mp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 64px;
          display: flex; alignItems: center; justify-content: space-between;
          padding: 0 2.5rem; background: rgba(255,255,255,0.94);
          backdrop-filter: blur(24px); border-bottom: 1px solid #ebebeb;
        }
        .mp-nav-left { display: flex; align-items: center; gap: 2rem; }
        .mp-nav-home { display: flex; align-items: center; gap: 0.5rem; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.15rem; text-transform: uppercase; color: #A9A9A9; text-decoration: none; }
        .mp-nav-divider { width: 1px; height: 18px; background: #ebebeb; }
        .mp-nav-logo { font-size: 0.9rem; font-weight: 800; letter-spacing: 0.5rem; text-decoration: none; color: #000; text-transform: uppercase; }
        .mp-nav-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.4rem; margin-right: -0.4rem; text-align: center; white-space: nowrap; text-transform: uppercase; color: #424242; }
        .mp-nav-right { display: flex; align-items: center; gap: 1.5rem; }
        .mp-nav-search { display: flex; align-items: center; gap: 0.6rem; border: 1px solid #ebebeb; padding: 0.45rem 1rem; }
        .mp-nav-search input { border: none; outline: none; background: transparent; font-family: 'Montserrat',sans-serif; font-size: 0.65rem; width: 160px; color: #000; }
        .mp-nav-account { display: flex; align-items: center; gap: 0.5rem; border: 1px solid #ebebeb; color: #000; padding: 0.5rem 1.1rem; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12rem; text-transform: uppercase; text-decoration: none; }
        .mp-nav-cart { display: flex; align-items: center; gap: 0.5rem; background: #000; color: #fff; padding: 0.5rem 1.1rem; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12rem; text-transform: uppercase; cursor: pointer; }
        .mp-nav-cart-badge { background: #fff; color: #000; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.5rem; font-weight: 800; }
        
        .mp-hero-banner { margin-top: 64px; height: 52vh; min-height: 340px; background: #000; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); position: relative; overflow: hidden; }
        .mp-hero-col { position: relative; overflow: hidden; border-right: 1px solid rgba(255,255,255,0.07); }
        .mp-hero-col:last-child { border-right: none; }
        .mp-hero-col-bg { position: absolute; inset: 0; transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94); }
        .mp-hero-col-content { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 2.5rem; background: linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%); }
        .mp-hero-col-tag { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.25rem; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem; }
        .mp-hero-col-title { font-size: clamp(1.1rem,2.5vw,1.8rem); font-weight: 700; color: #fff; line-height: 1.15; margin-bottom: 1rem; white-space: pre-line; }
        .mp-hero-col-link { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.58rem; font-weight: 600; letter-spacing: 0.15rem; text-transform: uppercase; text-decoration: none; color: rgba(255,255,255,0.6); }

        .mp-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 2.5rem; border-bottom: 1px solid #ebebeb; background: #fff; position: sticky; top: 64px; z-index: 100; }
        .mp-breadcrumbs { display: flex; align-items: center; gap: 0.6rem; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.08rem; color: #A9A9A9; }
        .mp-breadcrumbs a { text-decoration: none; color: #A9A9A9; }
        .mp-breadcrumbs strong { color: #000; font-weight: 600; }
        .mp-toolbar-actions { display: flex; align-items: center; gap: 2rem; }
        .mp-toolbar-count { font-size: 0.6rem; font-weight: 400; color: #A9A9A9; }
        .mp-toolbar-filter-btn { display: none; align-items: center; gap: 0.4rem; padding: 0.55rem 1.1rem; border: 1px solid #000; background: #000; color: #fff; cursor: pointer; font-family: 'Montserrat',sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1rem; text-transform: uppercase; }
        .mp-toolbar-sort { display: flex; align-items: center; gap: 0.5rem; font-size: 0.6rem; font-weight: 500; color: #2a2a2a; }
        .mp-toolbar-sort select { border: none; outline: none; background: transparent; font-family: 'Montserrat',sans-serif; font-size: 0.6rem; font-weight: 600; color: #000; cursor: pointer; appearance: none; padding-right: 1rem; }
        .mp-toolbar-grid-toggles { display: flex; gap: 0.4rem; }
        .mp-toolbar-grid-toggles button { width: 28px; height: 28px; border: 1px solid #ebebeb; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #A9A9A9; transition: all 0.2s; }
        .mp-toolbar-grid-toggles button.active { border-color: #000; background: #000; color: #fff; }

        .mp-sidebar { border-right: 1px solid #ebebeb; padding: 2.5rem 1.5rem; position: sticky; top: calc(64px + 51px); }
        .mp-sidebar-mobile-header { display: none; align-items: center; justify-content: space-between; padding: 0 0 2rem; border-bottom: 1px solid #ebebeb; margin-bottom: 1.5rem; }
        .mp-filter-section { padding: 0 0 2rem; border-bottom: 1px solid #ebebeb; margin-bottom: 1.5rem; }
        .mp-filter-title { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.2rem; text-transform: uppercase; color: #000; margin-bottom: 1.4rem; }
        .mp-filter-options { display: flex; flex-direction: column; gap: 0.6rem; }
        .mp-filter-label { display: flex; align-items: center; gap: 0.7rem; font-size: 0.68rem; color: #2a2a2a; cursor: pointer; }
        .mp-filter-label input { width: 14px; height: 14px; appearance: none; border: 1px solid #D3D3D3; cursor: pointer; accent-color: #000; }
        .mp-filter-label input:checked { background: #000; border-color: #000; }
        .mp-price-inputs { display: flex; align-items: center; gap: 0.5rem; width: 100%; }
        .mp-price-inputs input { flex: 1; min-width: 0; border: 1px solid #ebebeb; padding: 0.5rem 0.7rem; font-family: 'Montserrat',sans-serif; font-size: 0.65rem; color: #000; outline: none; background: transparent; }
        .mp-price-inputs span { font-size: 0.6rem; color: #A9A9A9; flex-shrink: 0; }
        .mp-clear-filters { display: block; width: 100%; padding: 0.7rem; border: 1px solid #ebebeb; background: transparent; cursor: pointer; font-family: 'Montserrat',sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15rem; text-transform: uppercase; color: #2a2a2a; text-align: center; }

        .mp-main-content { padding: 2.5rem; overflow: hidden; }
        .mp-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2.5rem; }
        .mp-pill-btn { display: flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1.1rem; border: 1px solid #ebebeb; border-radius: 2rem; background: transparent; cursor: pointer; font-family: 'Montserrat',sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1rem; text-transform: uppercase; color: #2a2a2a; white-space: nowrap; transition: all 0.25s; }
        .mp-pill-btn.active { border-color: #000; background: #000; color: #fff; }

        .mp-layout-container {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr);
          min-height: 80vh;
          width: 100%;
          overflow-x: hidden;
        }

        @media (max-width: 1100px) {
          .mp-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 1024px) {
          .mp-layout-container { grid-template-columns: 1fr; }
          .mp-sidebar { display: block; position: fixed; top: 0; left: -100%; width: 320px; height: 100vh; background: #fff; z-index: 9999; padding: 2rem; transition: left 0.3s cubic-bezier(0.25, 1, 0.5, 1); border-right: none; box-shadow: 2px 0 12px rgba(0,0,0,0.15); }
          .mp-sidebar.open { left: 0; }
          .mp-sidebar-mobile-header { display: flex; }
          .mp-toolbar-filter-btn { display: flex; }
          .mp-main-content { padding: 1.5rem !important; }
        }
        @media (max-width: 900px) {
          .mp-nav-left { gap: 1rem; }
          .mp-nav-search { display: none; }
          .mp-hero-banner { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 1.5rem; margin-top: 64px; background: transparent; height: auto; }
          .mp-hero-banner::-webkit-scrollbar { display: none; }
          .mp-hero-col { flex: 0 0 85%; height: 50vh; min-height: 350px; scroll-snap-align: center; border-right: none; margin-left: 1rem; border-radius: 12px; overflow: hidden; }
          .mp-hero-col:last-child { margin-right: 1rem; }
        }
        @media (max-width: 768px) {
          .mp-products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem; }
          .mp-nav { padding: 0 1rem; justify-content: space-between; }
          .mp-nav-left { gap: 0; }
          .mp-nav-home-text { display: none; }
          .mp-nav-home svg { width: 22px !important; height: 22px !important; stroke-width: 2 !important; color: #000; }
          .mp-nav-divider { display: none; }
          .mp-nav-logo { display: none; }
          .mp-toolbar { padding: 0 1rem 1rem; border-bottom: none; }
          .mp-breadcrumbs { display: none; }
          .mp-toolbar-actions { width: 100%; justify-content: space-between; gap: 0.5rem; }
          .mp-toolbar-count { display: none; }
          .mp-toolbar-grid-toggles { display: none; }
          .mp-toolbar-filter-btn { flex: 1; justify-content: center; padding: 0.7rem; border-radius: 2rem; font-size: 0.55rem; }
          .mp-toolbar-sort { flex: 1; justify-content: center; border: 1px solid #ebebeb; border-radius: 2rem; padding: 0.7rem; font-size: 0.55rem; }
          .mp-toolbar-sort select { font-size: 0.55rem; width: 100%; text-align: center; text-align-last: center; }
        }
        @media (max-width: 480px) {
          .mp-main-content { padding: 0 1rem 1rem !important; }
          .mp-pills { margin-bottom: 1.5rem; }
          .mp-product-img { aspect-ratio: 4/5; }
          .mp-nav-account { font-size: 0; padding: 0; border: none; width: 38px; height: 38px; border-radius: 50%; justify-content: center; background: #f7f7f7; }
          .mp-nav-account-text { display: none; }
          .mp-nav-cart-text { display: none; }
          .mp-nav-cart { padding: 0; width: 38px; height: 38px; border-radius: 50%; justify-content: center; position: relative; }
          .mp-nav-icon-mobile { display: block !important; }
          .mp-nav-cart-badge { position: absolute; top: 0; right: 0; transform: translate(25%, -25%); border: 2px solid #fff; }
          .mp-hero-col { min-height: 300px; }
          
          .mp-product-info { padding: 0.8rem 0.8rem 0; }
          .mp-product-price-container { padding: 0 0.8rem 0.8rem; }
          .mp-product-cat { font-size: 0.45rem; letter-spacing: 0.05em; }
          .mp-product-title { font-size: 0.68rem; margin-bottom: 0.4rem; }
          .mp-product-price-current { font-size: 0.75rem; }
          .mp-product-price-old { font-size: 0.65rem; }
          .mp-quick-add-btn { padding: 0.6rem; font-size: 0.5rem; letter-spacing: 0.05rem; }
        }
      `}</style>
    </>
  );
}

export default function Marketplace() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Montserrat,sans-serif', fontSize: '0.7rem', letterSpacing: '0.3rem', textTransform: 'uppercase' }}>
        Cargando...
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
