import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

const API_BASE = 'https://api.reinaldotineo.online';

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

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' fill='%23a9a9a9' font-family='sans-serif' font-size='16' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";

function getProductImg(p: ApiProduct): string {
  if (p.image) return p.image;
  const imgs = p.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (typeof first === 'string') return first;
    if (typeof first === 'object' && 'url' in first) return (first as { url: string }).url;
  }
  return FALLBACK_IMG;
}

function getAllImages(p: ApiProduct): string[] {
  if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
    return [getProductImg(p)];
  }
  return p.images.map(img => {
    if (typeof img === 'string') return img;
    return (img as { url: string }).url;
  });
}

function getCatName(p: ApiProduct): string {
  if (!p.category) return '';
  if (typeof p.category === 'string') return p.category;
  return (p.category as { name: string }).name;
}

async function getProduct(id: string): Promise<ApiProduct> {
  const res = await fetch(`${API_BASE}/api/v1/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Not found');
  const data = await res.json();
  // Handle both wrapped {data: {...}} and raw object responses
  return (data?.data ?? data) as ApiProduct;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await params;

  let product: ApiProduct;
  try {
    product = await getProduct(id);
  } catch {
    return notFound();
  }

  const productName = product.name ?? product.title ?? 'Producto';
  const price = Number(product.price);
  const origPrice = product.original_price ? Number(product.original_price) : null;
  const hasSale = origPrice && origPrice > price;
  const catName = getCatName(product);
  const allImages = getAllImages(product);
  const mainImage = allImages[0];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1.2rem 2.5rem', borderBottom: '1px solid #ebebeb', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.08rem', color: '#A9A9A9', textTransform: 'uppercase' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#A9A9A9' }}>Inicio</Link>
        <span style={{ color: '#D3D3D3' }}>›</span>
        <Link href="/marketplace" style={{ textDecoration: 'none', color: '#A9A9A9' }}>Marketplace</Link>
        <span style={{ color: '#D3D3D3' }}>›</span>
        <span style={{ color: '#000', fontWeight: 600 }}>{productName}</span>
      </div>

      <div className="pd-layout">

        {/* Left: Image Gallery */}
        <div style={{ borderRight: '1px solid #ebebeb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
            <img src={mainImage} alt={productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {hasSale && (
              <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: '#c0392b', color: '#fff', padding: '0.4rem 0.8rem', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.12rem', textTransform: 'uppercase' }}>
                −{Math.round((1 - price / origPrice!) * 100)}% OFF
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#ebebeb', borderTop: '1px solid #ebebeb' }}>
              {allImages.map((img, i) => (
                <div key={i} style={{ aspectRatio: '1', background: '#fff', cursor: 'pointer' }}>
                  <img src={img} alt={`${productName} - vista ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: i === 0 ? 1 : 0.6 }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div style={{ padding: '3.5rem' }} className="pd-details">
          <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '1rem' }}>
            {catName && `${catName} · `}BASE
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 200, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.5rem', color: '#000' }} className="pd-title">
            {productName}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: hasSale ? '#c0392b' : '#000' }}>
              ${price.toLocaleString('es-AR')}
            </div>
            {hasSale && (
              <div style={{ fontSize: '1rem', fontWeight: 300, color: '#A9A9A9', textDecoration: 'line-through' }}>
                ${origPrice!.toLocaleString('es-AR')}
              </div>
            )}
          </div>

          {product.description && (
            <p style={{ fontSize: '0.85rem', fontWeight: 400, color: '#424242', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '85%' }}>
              {product.description}
            </p>
          )}

          {/* Stock badge */}
          {product.stock !== undefined && (
            <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: product.stock > 0 ? '#dcfce7' : '#fee2e2', color: product.stock > 0 ? '#166534' : '#dc2626', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05rem', marginBottom: '2rem' }}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
            </div>
          )}

          {/* Add to cart */}
          <AddToCartButton productId={String(product.id)} stock={product.stock ?? 999} />

          {/* Meta */}
          <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8f8f8', border: '1px solid #ebebeb' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '1rem' }}>
              Información del producto
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid #ebebeb', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#999' }}>ID</span><span style={{ fontWeight: 600 }}>#{product.id}</span>
              </div>
              {catName && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid #ebebeb', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#999' }}>Categoría</span><span style={{ fontWeight: 600 }}>{catName}</span>
                </div>
              )}
              {product.is_featured && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid #ebebeb', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#999' }}>Destacado</span><span style={{ fontWeight: 600 }}>Sí</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
