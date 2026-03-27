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
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80',
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
    <div className="mp-product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
        <div style={{ padding: '1.2rem 1.4rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#A9A9A9' }}>{catName}</div>
            <StarRating />
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.03em', color: '#000', marginBottom: '0.6rem', lineHeight: 1.3 }}>{productName}</div>
        </div>
      </Link>
      <div style={{ padding: '0 1.4rem 1.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: hasSale ? '#c0392b' : '#000' }}>${price.toLocaleString('es-AR')}</div>
          {hasSale && <div style={{ fontSize: '0.72rem', fontWeight: 300, color: '#A9A9A9', textDecoration: 'line-through' }}>${origPrice!.toLocaleString('es-AR')}</div>}
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
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem', background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #ebebeb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15rem', textTransform: 'uppercase', color: '#A9A9A9', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}><polyline points="15 18 9 12 15 6"/></svg>
            Inicio
          </Link>
          <div style={{ width: 1, height: 18, background: '#ebebeb' }} />
          <Link href="/" style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.5rem', textDecoration: 'none', color: '#000', textTransform: 'uppercase' }}>BASE</Link>
        </div>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.4rem', textTransform: 'uppercase', color: '#424242' }}>
          Marketplace
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid #ebebeb', padding: '0.45rem 1rem' }}>
            <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: '#A9A9A9', fill: 'none', strokeWidth: 2, flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar productos..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Montserrat,sans-serif', fontSize: '0.65rem', width: 160, color: '#000' }} />
          </div>
          <Link href="/cuenta"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #ebebeb', color: '#000', padding: '0.5rem 1.1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12rem', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Mi Cuenta
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#000', color: '#fff', padding: '0.5rem 1.1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12rem', textTransform: 'uppercase', cursor: 'pointer' }}>
            Carrito
            {cartCount > 0 && (
              <div style={{ background: '#fff', color: '#000', width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 800 }}>
                {cartCount}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <div style={{ marginTop: 64, height: '52vh', minHeight: 340, background: '#000', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', position: 'relative', overflow: 'hidden' }}>
        {[
          { tag: 'Temporada 2026', title: 'Nueva\nColección', link: 'Explorar', img: HERO_IMGS[0] },
          { tag: 'Accesorios', title: 'Piezas\nEsenciales', link: 'Ver todo', img: HERO_IMGS[1] },
          { tag: 'Exclusivo', title: 'Drops\nLimitados', link: 'Descubrir', img: HERO_IMGS[2] },
        ].map((col, i) => (
          <div key={i} className="mp-hero-col"
            style={{ position: 'relative', overflow: 'hidden', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
            <div className="mp-hero-col-bg" style={{ position: 'absolute', inset: 0, transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
              <img src={col.img} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem', background: 'linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%)' }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.25rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>{col.tag}</div>
              <div style={{ fontSize: 'clamp(1.1rem,2.5vw,1.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '1rem', whiteSpace: 'pre-line' }}>{col.title}</div>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.15rem', textTransform: 'uppercase', textDecoration: 'none', color: 'rgba(255,255,255,0.6)' }}>
                {col.link}
                <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Toolbar ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2.5rem', borderBottom: '1px solid #ebebeb', background: '#fff', position: 'sticky', top: 64, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.08rem', color: '#A9A9A9' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#A9A9A9' }}>Inicio</Link>
          <span style={{ color: '#D3D3D3' }}>›</span>
          <span style={{ color: '#000', fontWeight: 600 }}>Marketplace</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 400, color: '#A9A9A9' }}>
            {loading ? 'Cargando...' : `${products.length} productos`}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem', fontWeight: 500, color: '#2a2a2a' }}>
            <span>Ordenar:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', fontWeight: 600, color: '#000', cursor: 'pointer', appearance: 'none', paddingRight: '1rem' }}>
              <option value="featured">Destacados</option>
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {([3, 4] as const).map(n => (
              <button key={n} onClick={() => setGridCols(n)}
                style={{ width: 28, height: 28, border: `1px solid ${gridCols === n ? '#000' : '#ebebeb'}`, background: gridCols === n ? '#000' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gridCols === n ? '#fff' : '#A9A9A9', transition: 'all 0.2s' }}>
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
        <aside style={{ borderRight: '1px solid #ebebeb', padding: '2.5rem 0', position: 'sticky', top: 'calc(64px + 51px)', height: 'calc(100vh - 115px)', overflowY: 'auto' }}>

          {/* Category — live from API */}
          <div style={{ padding: '0 2rem 2rem', borderBottom: '1px solid #ebebeb', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#000', marginBottom: '1.4rem' }}>Categoría</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[{ id: '', name: 'Todos' }, ...categories].map(c => (
                <label key={String(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.68rem', color: '#2a2a2a', cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedCategory === String(c.id)}
                    onChange={() => setSelectedCategory(c.id === '' ? '' : String(c.id))}
                    style={{ width: 14, height: 14, appearance: 'none', border: '1px solid #D3D3D3', cursor: 'pointer', accentColor: '#000' }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ padding: '0 2rem 2rem', borderBottom: '1px solid #ebebeb', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#000', marginBottom: '1.4rem' }}>Precio</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="text" placeholder="$0" value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ flex: 1, border: '1px solid #ebebeb', padding: '0.5rem 0.7rem', fontFamily: 'Montserrat,sans-serif', fontSize: '0.65rem', color: '#000', outline: 'none', background: 'transparent' }} />
              <span style={{ fontSize: '0.6rem', color: '#A9A9A9', flexShrink: 0 }}>—</span>
              <input type="text" placeholder="$200.000" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ flex: 1, border: '1px solid #ebebeb', padding: '0.5rem 0.7rem', fontFamily: 'Montserrat,sans-serif', fontSize: '0.65rem', color: '#000', outline: 'none', background: 'transparent' }} />
            </div>
          </div>

          <button onClick={clearFilters}
            style={{ display: 'block', width: 'calc(100% - 4rem)', margin: '0 2rem', padding: '0.7rem', border: '1px solid #ebebeb', background: 'transparent', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15rem', textTransform: 'uppercase', color: '#2a2a2a', textAlign: 'center' }}>
            Limpiar filtros
          </button>
        </aside>

        {/* Main */}
        <main style={{ padding: '2.5rem' }}>

          {/* Pill filters */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
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
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', border: `1px solid ${activePill === pill ? '#000' : '#ebebeb'}`, background: activePill === pill ? '#000' : 'transparent', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1rem', textTransform: 'uppercase', color: activePill === pill ? '#fff' : '#2a2a2a', whiteSpace: 'nowrap', transition: 'all 0.25s' }}>
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
            <div className="mp-products-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: '#ebebeb', marginBottom: '3rem' }}>
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
        }
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

        .mp-layout-container {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: 80vh;
        }

        @media (max-width: 1100px) {
          .mp-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .mp-layout-container { grid-template-columns: 1fr; }
          aside { display: none; }
          .mp-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          main { padding: 1.5rem !important; }
        }
        @media (max-width: 480px) {
          .mp-products-grid { grid-template-columns: 1fr !important; }
          main { padding: 1rem !important; }
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
