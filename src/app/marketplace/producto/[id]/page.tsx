import React from 'react';
import Link from 'next/link';
import { getProductById } from '@/lib/api/bff';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton'; // We'll create a client component purely for interactivity

export default async function ProductPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  let product;
  try {
    product = await getProductById(id);
  } catch (error) {
    return notFound();
  }

  // Get a fallback image if no images provided
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80';

  const sizes = (product.attributes?.tallas as string[]) || ['S', 'M', 'L'];
  const isNew = product.condition === 'new';

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      {/* ─── Breadcrumb ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1.2rem 2.5rem', borderBottom: '1px solid #ebebeb', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.08rem', color: '#A9A9A9', textTransform: 'uppercase' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#A9A9A9', transition: 'color 0.2s' }}>Inicio</Link>
        <span style={{ color: '#D3D3D3' }}>›</span>
        <Link href="/marketplace" style={{ textDecoration: 'none', color: '#A9A9A9', transition: 'color 0.2s' }}>Marketplace</Link>
        <span style={{ color: '#D3D3D3' }}>›</span>
        <span style={{ color: '#000', fontWeight: 600 }}>{product.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 120px)' }}>
        
        {/* Left Column: Image Gallery */}
        <div style={{ borderRight: '1px solid #ebebeb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={mainImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {isNew && (
              <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: '#000', color: '#fff', padding: '0.4rem 0.8rem', fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.12rem', textTransform: 'uppercase' }}>
                Nuevo
              </div>
            )}
          </div>
          {/* Mock Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: '#ebebeb', borderTop: '1px solid #ebebeb' }}>
              {product.images.map((img, i) => (
                <div key={i} style={{ aspectRatio: '1', background: '#fff', cursor: 'pointer' }}>
                  <img src={img} alt={`${product.title} - view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: i === 0 ? 1 : 0.6 }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div style={{ padding: '3.5rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '1rem' }}>
            {product.brand} · {product.category}
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 200, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.5rem', color: '#000' }}>
            {product.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#000' }}>
              ${product.price.toLocaleString('es-AR')}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div style={{ fontSize: '1rem', fontWeight: 300, color: '#A9A9A9', textDecoration: 'line-through' }}>
                ${product.originalPrice.toLocaleString('es-AR')}
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', fontWeight: 400, color: '#424242', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '85%' }}>
            {product.description}
          </p>

          <div style={{ borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', padding: '2rem 0', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15rem', textTransform: 'uppercase' }}>Talla</span>
              <span style={{ fontSize: '0.6rem', fontWeight: 500, color: '#A9A9A9', textDecoration: 'underline', cursor: 'pointer' }}>Guía de tallas</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {sizes.map((s, i) => (
                <button key={s} style={{ flex: 1, padding: '1rem', background: i === 1 ? '#000' : 'transparent', color: i === 1 ? '#fff' : '#000', border: `1px solid ${i === 1 ? '#000' : '#ebebeb'}`, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive add to cart using the client component */}
          <AddToCartButton productId={product.id} stock={product.stock} />

          {/* Seller / Store Information Box */}
          <div style={{ marginTop: '4rem', padding: '2rem', background: '#f8f8f8', border: '1px solid #ebebeb' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '1rem' }}>
              Vendido por
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                  {product.brand.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{product.brand} Shop</div>
                  <div style={{ fontSize: '0.65rem', color: '#A9A9A9' }}>Vendedor verificado · 98% calificaciones positivas</div>
                </div>
              </div>
              <Link href={`/tienda/${encodeURIComponent(product.brand)}`} style={{ padding: '0.6rem 1.2rem', border: '1px solid #000', background: 'transparent', color: '#000', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1rem', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block' }}>
                Visitar Tienda
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
