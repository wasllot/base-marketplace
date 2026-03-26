'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api/types';
import { useCart } from '@/lib/context/CartContext';
import { useNotification } from '@/lib/context/NotificationContext';

const FALLBACK_IMGS: Record<string, string> = {
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

function getImg(product: Product): string {
  return FALLBACK_IMGS[product.id] ??
    product.images?.[0] ??
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80';
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { addNotification } = useNotification();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addNotification({ type: 'success', message: `${product.title} añadido al carrito` });
  };

  const isNew   = product.condition === 'new';
  const tagLabel = isNew ? 'Nuevo' : product.condition === 'used' ? 'Usado' : 'Reacondicionado';

  return (
    <Link href={`/marketplace/producto/${product.id}`} className="home-product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-image">
        <div className="product-image-inner" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <img
            src={getImg(product)}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
          />
        </div>
        <div className="product-tag">{tagLabel}</div>
        <div className="product-action" onClick={handleAddToCart}>Agregar al carrito</div>
      </div>
      <div className="product-info">
        <div className="product-category">{product.subcategory}</div>
        <div className="product-name">{product.title}</div>
        <div className="product-price">${product.price.toLocaleString('es-AR')}</div>
      </div>
    </Link>
  );
}
