import React from 'react';
import Link from 'next/link';
import { getAllProducts } from '@/lib/api/bff';
import { notFound } from 'next/navigation';

export default async function StorePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const storeName = decodeURIComponent(resolvedParams.id);
  
  // Fetch products from this specific brand/store
  const { data: storeProducts } = await getAllProducts({ brand: storeName, limit: 100 });

  if (!storeProducts || storeProducts.length === 0) {
    // We could return notFound() if we want strict checking, but let's show an empty store for now
    // return notFound();
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: '#f8f8f8' }}>
      
      {/* ─── Store Header ─── */}
      <div style={{ background: '#000', color: '#fff', padding: '5rem 2.5rem 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#000' }}>
            {storeName.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {storeName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              <span>Vendedor Verificado</span>
              <span>•</span>
              <span>{storeProducts.length} Productos publicados</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Breadcrumb ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1.2rem 2.5rem', borderBottom: '1px solid #ebebeb', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.08rem', color: '#A9A9A9', textTransform: 'uppercase', background: '#fff' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#A9A9A9', transition: 'color 0.2s' }}>Inicio</Link>
        <span style={{ color: '#D3D3D3' }}>›</span>
        <Link href="/marketplace" style={{ textDecoration: 'none', color: '#A9A9A9', transition: 'color 0.2s' }}>Marketplace</Link>
        <span style={{ color: '#D3D3D3' }}>›</span>
        <span style={{ color: '#000', fontWeight: 600 }}>Tienda {storeName}</span>
      </div>

      {/* ─── Store Content ─── */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem' }}>Publicaciones de {storeName}</h2>
        
        {storeProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', border: '1px solid #ebebeb' }}>
            <div style={{ fontSize: '0.8rem', color: '#A9A9A9', marginBottom: '1rem' }}>Esta tienda aún no tiene productos publicados.</div>
            <Link href="/marketplace" style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15rem', textTransform: 'uppercase', textDecoration: 'underline', color: '#000' }}>
              Volver al Marketplace
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {storeProducts.map((product) => {
              const mainImage = product.images && product.images.length > 0 
                ? product.images[0] 
                : 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80';

              return (
                <Link key={product.id} href={`/marketplace/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: '#fff', border: '1px solid #ebebeb', transition: 'transform 0.2s', position: 'relative' }}>
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f4f4f4' }}>
                    <img src={mainImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.2rem' }}>
                    <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '0.4rem' }}>
                      {product.category}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#000', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                      {product.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#000' }}>
                      ${product.price.toLocaleString('es-AR')}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

    </div>
  );
}
