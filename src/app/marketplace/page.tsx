'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api/types';

// ─── Unsplash image helpers ────────────────────────────────────────────────────
const HERO_IMGS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80',
];

const PRODUCT_IMGS: Record<string, string> = {
  'local-1': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
  'local-2': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
  'local-3': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
  'local-4': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
  'local-5': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
  'local-6': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
  'local-7': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  'local-8': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  'local-9': 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80',
  'local-10':'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
  'local-11':'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
  'local-12':'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
};

function getProductImg(product: Product): string {
  return PRODUCT_IMGS[product.id] ?? product.images?.[0] ??
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80';
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StarRating({ rating = 4, count = 0 }: { rating?: number; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      <div style={{ display: 'flex', gap: '1px' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: 8, height: 8,
            background: i <= rating ? '#000' : '#D3D3D3',
            clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
          }} />
        ))}
      </div>
      {count > 0 && <span style={{ fontSize: '0.52rem', color: '#A9A9A9', fontWeight: 400 }}>({count})</span>}
    </div>
  );
}

function ProductCard({ product, cartCount, onAddToCart, onToggleWishlist, wishlisted }: {
  product: Product;
  cartCount: number;
  onAddToCart: (productId: string, size?: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlisted: boolean;
}) {
  const img = getProductImg(product);
  const isNew = product.condition === 'new';
  const hasSale = product.originalPrice && product.originalPrice > product.price;
  const tagLabel = hasSale ? 'sale' : isNew ? 'new' : product.stock <= 5 ? 'limited' : null;

  const tagStyles: Record<string, React.CSSProperties> = {
    new:     { background: '#000', color: '#fff' },
    sale:    { background: '#c0392b', color: '#fff' },
    limited: { background: '#fff', color: '#000', border: '1px solid #000' },
    exclusive: { background: '#424242', color: '#fff' },
  };

  const sizes = (product.attributes?.tallas as string[]) || ['S', 'M', 'L'];

  return (
    <div className="mp-product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Link href={`/marketplace/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: 1 }}>
        <div className="mp-product-img">
          <img src={img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
        {tagLabel && (
          <div style={{
            position: 'absolute', top: '1rem', left: '1rem',
            padding: '0.3rem 0.65rem',
            fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.12rem', textTransform: 'uppercase',
            zIndex: 2, pointerEvents: 'none',
            ...tagStyles[tagLabel],
          }}>
            {tagLabel === 'sale' ? `−${Math.round((1 - product.price / product.originalPrice!) * 100)}%` :
             tagLabel === 'new' ? 'Nuevo' : tagLabel === 'limited' ? 'Limitado' : 'Exclusivo'}
          </div>
        )}
        <button
          className="mp-wishlist-btn"
          onClick={() => onToggleWishlist(product.id)}
          style={{ background: '#fff', border: 'none', cursor: 'pointer' }}
        >
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: '#000', fill: wishlisted ? '#000' : 'none', strokeWidth: 1.5 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div className="mp-quick-add">
          <button className="mp-quick-add-btn" onClick={() => onAddToCart(product.id)}>+ Agregar</button>
          <div className="mp-quick-sizes">
            {sizes.slice(0, 4).map(s => (
              <button key={s} className="mp-quick-size" onClick={() => onAddToCart(product.id, s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '1.2rem 1.4rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#A9A9A9' }}>
            {product.subcategory}
          </div>
          <StarRating rating={product.rating ?? 4} count={product.reviewCount ?? 0} />
        </div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.03em', color: '#000', marginBottom: '0.6rem', lineHeight: 1.3 }}>
          {product.title}
        </div>
      </div>
      </Link>
      <div style={{ padding: '0 1.4rem 1.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: hasSale ? '#c0392b' : '#000' }}>
            ${product.price.toLocaleString('es-AR')}
          </div>
          {hasSale && (
            <div style={{ fontSize: '0.72rem', fontWeight: 300, color: '#A9A9A9', textDecoration: 'line-through' }}>
              ${product.originalPrice!.toLocaleString('es-AR')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.7rem' }}>
          {['#000', '#424242', '#D3D3D3'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Marketplace Component ────────────────────────────────────────────────

function MarketplaceContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string>('');
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [activePill, setActivePill] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');



  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('query', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      if (priceMin) params.set('minPrice', priceMin);
      if (priceMax) params.set('maxPrice', priceMax);
      if (inStockOnly) params.set('inStock', 'true');
      params.set('sort', sortBy);
      params.set('limit', '48');

      const res = await fetch(`/api/products?${params}`);
      if (res.ok) {
        const json = await res.json();
        // Handle both raw array and {success,data} wrapped shape
        setProducts(Array.isArray(json) ? json : (json.data ?? []));
      }
    } catch {
      // silently fail for demo
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, priceMin, priceMax, inStockOnly, sortBy]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 250);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleAddToCart(productId: string, size?: string) {
    setCartCount(c => c + 1);
    showToast(size ? `Talla ${size} agregada al carrito` : 'Agregado al carrito');
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1, size }),
    });
  }

  function handleToggleWishlist(productId: string) {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showToast('Eliminado de favoritos');
      } else {
        next.add(productId);
        showToast('Agregado a favoritos');
      }
      return next;
    });
  }

  function clearFilters() {
    setSelectedCategory('');
    setSelectedSizes(new Set());
    setSelectedColors(new Set());
    setPriceMin('');
    setPriceMax('');
    setInStockOnly(true);
    setActivePill('Todos');
    setSearchQuery('');
  }

  const pills = ['Todos', 'Moda', 'Accesorios', 'Calzado', 'Nuevos', 'Sale'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorSwatches = [
    { hex: '#000000', name: 'Negro' },
    { hex: '#424242', name: 'Charcoal' },
    { hex: '#A9A9A9', name: 'Gris' },
    { hex: '#D3D3D3', name: 'Gris Claro' },
    { hex: '#ffffff', name: 'Blanco' },
    { hex: '#c0392b', name: 'Rojo' },
    { hex: '#2c3e50', name: 'Azul Oscuro' },
  ];

  return (
    <>


      {/* ─── Toast ─── */}
      {toast && (
        <div style={{
          position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 8000,
          background: '#000', color: '#fff', padding: '0.8rem 1.4rem',
          fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1rem', textTransform: 'uppercase',
          animation: 'slideInRight 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {/* ─── Nav ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid #ebebeb',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.15rem', textTransform: 'uppercase', color: '#A9A9A9', textDecoration: 'none', transition: 'color 0.25s' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', border: '1px solid #ebebeb', padding: '0.45rem 1rem', transition: 'border-color 0.25s' }}>
            <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: '#A9A9A9', fill: 'none', strokeWidth: 2, flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text" placeholder="Buscar productos..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Montserrat,sans-serif', fontSize: '0.65rem', width: 160, color: '#000' }}
            />
          </div>
          <Link href="/carrito"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#000', color: '#fff', padding: '0.5rem 1.1rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12rem', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Carrito
            {cartCount > 0 && (
              <div style={{ background: '#fff', color: '#000', width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 800 }}>
                {cartCount}
              </div>
            )}
          </Link>
        </div>
      </nav>

      {/* ─── Hero Banner ─── */}
      <div
        style={{ marginTop: 64, height: '52vh', minHeight: 340, background: '#000', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', position: 'relative', overflow: 'hidden' }}
      >
        {[
          { tag: 'Temporada 2026', title: 'Nueva\nColección', link: 'Explorar', img: HERO_IMGS[0] },
          { tag: 'Accesorios', title: 'Piezas\nEsenciales', link: 'Ver todo', img: HERO_IMGS[1] },
          { tag: 'Exclusivo', title: 'Drops\nLimitados', link: 'Descubrir', img: HERO_IMGS[2] },
        ].map((col, i) => (
          <div
            key={i} className="mp-hero-col"
            style={{ position: 'relative', overflow: 'hidden', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
          >
            <div className="mp-hero-col-bg" style={{ position: 'absolute', inset: 0, transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)' }}>
              <img src={col.img} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem', background: 'linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%)' }}>
              <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.25rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>{col.tag}</div>
              <div style={{ fontSize: 'clamp(1.1rem,2.5vw,1.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '1rem', whiteSpace: 'pre-line' }}>{col.title}</div>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.15rem', textTransform: 'uppercase', textDecoration: 'none', color: 'rgba(255,255,255,0.6)', transition: 'color 0.25s' }}>
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
          <Link href="/" style={{ textDecoration: 'none', color: '#A9A9A9', transition: 'color 0.2s' }}>Inicio</Link>
          <span style={{ color: '#D3D3D3' }}>›</span>
          <span style={{ color: '#000', fontWeight: 600 }}>Marketplace</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 400, color: '#A9A9A9', letterSpacing: '0.05rem' }}>
            {loading ? 'Cargando...' : `${products.length} productos`}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.08rem', color: '#2a2a2a' }}>
            <span>Ordenar:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08rem', color: '#000', cursor: 'pointer', appearance: 'none', paddingRight: '1rem' }}>
              <option value="featured">Destacados</option>
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="rating">Más valorados</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {([3,4] as const).map(n => (
              <button key={n} onClick={() => setGridCols(n)}
                style={{ width: 28, height: 28, border: `1px solid ${gridCols === n ? '#000' : '#ebebeb'}`, background: gridCols === n ? '#000' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gridCols === n ? '#fff' : '#A9A9A9', transition: 'all 0.2s' }}
              >
                <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}>
                  {n === 3 ? <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Page Body ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '80vh' }}>

        {/* Sidebar */}
        <aside style={{ borderRight: '1px solid #ebebeb', padding: '2.5rem 0', position: 'sticky', top: 'calc(64px + 51px)', height: 'calc(100vh - 115px)', overflowY: 'auto' }}>

          {/* Category */}
          <div style={{ padding: '0 2rem 2rem', borderBottom: '1px solid #ebebeb', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#000', marginBottom: '1.4rem' }}>Categoría</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[{ name: 'Todos', val: '' }, { name: 'Moda', val: 'moda' }, { name: 'Accesorios', val: 'accesorios' }, { name: 'Calzado', val: 'calzado' }].map(c => (
                <label key={c.val} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.68rem', fontWeight: 400, letterSpacing: '0.03rem', color: '#2a2a2a', cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedCategory === c.val} onChange={() => setSelectedCategory(c.val)}
                    style={{ width: 14, height: 14, border: '1px solid #D3D3D3', appearance: 'none', cursor: 'pointer', accentColor: '#000' }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{ padding: '0 2rem 2rem', borderBottom: '1px solid #ebebeb', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#000', marginBottom: '1.4rem' }}>Talla</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {sizes.map(s => (
                <button key={s} onClick={() => setSelectedSizes(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; })}
                  style={{ minWidth: 36, height: 34, padding: '0 0.5rem', border: `1px solid ${selectedSizes.has(s) ? '#000' : '#ebebeb'}`, background: selectedSizes.has(s) ? '#000' : 'transparent', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', fontWeight: 600, color: selectedSizes.has(s) ? '#fff' : '#2a2a2a', transition: 'all 0.2s' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div style={{ padding: '0 2rem 2rem', borderBottom: '1px solid #ebebeb', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#000', marginBottom: '1.4rem' }}>Color</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {colorSwatches.map(c => (
                <div key={c.hex} onClick={() => setSelectedColors(prev => { const n = new Set(prev); n.has(c.hex) ? n.delete(c.hex) : n.add(c.hex); return n; })}
                  title={c.name}
                  style={{ width: 22, height: 22, borderRadius: '50%', background: c.hex, border: `2px solid ${selectedColors.has(c.hex) ? '#000' : 'transparent'}`, cursor: 'pointer', outline: selectedColors.has(c.hex) ? '2px solid #000' : '2px solid transparent', outlineOffset: 2, boxShadow: c.hex === '#ffffff' ? 'inset 0 0 0 1px #ddd' : 'none', transition: 'transform 0.2s' }}
                />
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ padding: '0 2rem 2rem', borderBottom: '1px solid #ebebeb', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#000', marginBottom: '1.4rem' }}>Precio</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="$0" value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ flex: 1, border: '1px solid #ebebeb', padding: '0.5rem 0.7rem', fontFamily: 'Montserrat,sans-serif', fontSize: '0.65rem', fontWeight: 500, color: '#000', outline: 'none', background: 'transparent' }} />
              <span style={{ fontSize: '0.6rem', color: '#A9A9A9', flexShrink: 0 }}>—</span>
              <input type="text" placeholder="$200.000" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ flex: 1, border: '1px solid #ebebeb', padding: '0.5rem 0.7rem', fontFamily: 'Montserrat,sans-serif', fontSize: '0.65rem', fontWeight: 500, color: '#000', outline: 'none', background: 'transparent' }} />
            </div>
          </div>

          {/* Availability */}
          <div style={{ padding: '0 2rem 2rem', borderBottom: '1px solid #ebebeb', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#000', marginBottom: '1.4rem' }}>Disponibilidad</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.68rem', fontWeight: 400, cursor: 'pointer' }}>
                <input type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} style={{ width: 14, height: 14, accentColor: '#000', cursor: 'pointer' }} />
                En stock
              </label>
            </div>
          </div>

          <button onClick={clearFilters}
            style={{ display: 'block', width: 'calc(100% - 4rem)', margin: '0 2rem', padding: '0.7rem', border: '1px solid #ebebeb', background: 'transparent', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15rem', textTransform: 'uppercase', color: '#2a2a2a', transition: 'all 0.25s', textAlign: 'center' }}
          >
            Limpiar filtros
          </button>
        </aside>

        {/* Main Content */}
        <main style={{ padding: '2.5rem' }}>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {pills.map(pill => (
              <button key={pill} onClick={() => { setActivePill(pill); if (pill !== 'Todos') setSelectedCategory(pill.toLowerCase()); else setSelectedCategory(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', border: `1px solid ${activePill === pill ? '#000' : '#ebebeb'}`, background: activePill === pill ? '#000' : 'transparent', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1rem', textTransform: 'uppercase', color: activePill === pill ? '#fff' : '#2a2a2a', whiteSpace: 'nowrap', transition: 'all 0.25s' }}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Product Grid */}
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
                  {/* Inline banner after 6th product */}
                  {i === 6 && (
                    <div style={{ gridColumn: '1 / -1', height: 200, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3rem', position: 'relative', overflow: 'hidden', borderRight: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb' }}
                    >
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#111 0%,#333 60%,#555 100%)', opacity: 0.8 }} />
                      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.3rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.6rem' }}>Studio · Servicios Digitales</div>
                        <div style={{ fontSize: '2rem', fontWeight: 200, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Construimos marcas<br /><strong style={{ fontWeight: 800 }}>desde cero.</strong></div>
                      </div>
                      <Link href="/studio/servicios" style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', background: '#fff', color: '#000', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15rem', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.25s' }}>
                        Ver Digital Studio
                        <svg style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </Link>
                    </div>
                  )}
                  <ProductCard
                    product={product}
                    cartCount={cartCount}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    wishlisted={wishlist.has(product.id)}
                  />
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '3rem 0' }}>
              {['← Prev', '1', '2', '3', '···', '8', 'Next →'].map((p, i) => (
                <button key={i}
                  style={{
                    width: p === '···' ? 'auto' : p.includes('→') || p.includes('←') ? 'auto' : 36,
                    height: 36, padding: p === '···' || p.includes('→') || p.includes('←') ? '0 1rem' : 0,
                    border: p === '1' ? '1px solid #000' : p === '···' ? 'none' : '1px solid #ebebeb',
                    background: p === '1' ? '#000' : 'transparent', cursor: p === '···' ? 'default' : 'pointer',
                    fontFamily: 'Montserrat,sans-serif', fontSize: p === '···' ? '0.7rem' : '0.65rem',
                    fontWeight: 600, color: p === '1' ? '#fff' : p === '···' ? '#A9A9A9' : '#2a2a2a',
                    transition: 'all 0.2s',
                  }}>{p}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ─── Recently Viewed ─── */}
      <div style={{ borderTop: '1px solid #ebebeb', padding: '3rem 2.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>Vistos recientemente</div>
          <a href="#" style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12rem', textTransform: 'uppercase', textDecoration: 'none', color: '#A9A9A9', borderBottom: '1px solid #D3D3D3', paddingBottom: '0.15rem', transition: 'all 0.2s' }}>Ver historial</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: '#ebebeb', marginBottom: '3rem' }}>
          {products.slice(0, 5).map(product => (
            <div key={product.id} style={{ background: '#fff', cursor: 'pointer' }}
            >
              <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                <img src={getProductImg(product)} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
              </div>
              <div style={{ padding: '0.8rem 1rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '0.3rem' }}>{product.title}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 300, color: '#2a2a2a' }}>${product.price.toLocaleString('es-AR')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* ─── Inline Styles ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background: #fff; color: #000; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: #fff; }
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

        .mp-quick-sizes {
          display: flex; background: #fff; border: 1px solid #000; border-left: none;
        }
        .mp-quick-size {
          padding: 0.85rem 0.7rem; background: transparent; border: none; cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.5rem; font-weight: 700; letter-spacing: 0.05rem;
          color: #000; transition: background 0.2s;
          border-right: 1px solid #ebebeb;
        }
        .mp-quick-size:last-child { border-right: none; }
        .mp-quick-size:hover { background: #000; color: #fff; }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 1100px) {
          .mp-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          nav .nav-center { display: none; }
          aside { display: none; }
          .mp-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .mp-products-grid { grid-template-columns: 1fr !important; }
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
