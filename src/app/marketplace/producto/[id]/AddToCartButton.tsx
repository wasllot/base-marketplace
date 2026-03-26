'use client';

import React, { useState } from 'react';

export default function AddToCartButton({ productId, stock }: { productId: string, stock: number }) {
  const [added, setAdded] = useState(false);
  const isAvailable = stock > 0;

  const handleAddToCart = () => {
    if (!isAvailable) return;
    setAdded(true);
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1, size: 'M' }),
    });
    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={handleAddToCart}
          disabled={!isAvailable}
          style={{ flex: 1, padding: '1.2rem', background: added ? '#27ae60' : (isAvailable ? '#000' : '#ebebeb'), color: isAvailable ? '#fff' : '#A9A9A9', border: 'none', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15rem', textTransform: 'uppercase', cursor: isAvailable ? 'pointer' : 'not-allowed', transition: 'background 0.3s' }}
        >
          {added ? 'Agregado al carrito ✓' : (isAvailable ? 'Agregar al carrito' : 'Agotado')}
        </button>
        <button style={{ width: '64px', background: 'transparent', border: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: '#000', fill: 'none', strokeWidth: 1.5 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isAvailable ? '#27ae60' : '#e74c3c' }} />
        <span style={{ color: isAvailable ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>
          {isAvailable ? 'En stock' : 'Sin stock'}
        </span>
        <span style={{ color: '#A9A9A9' }}>— Envío estimado en 48hs</span>
      </div>
    </>
  );
}
