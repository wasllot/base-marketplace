'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { useNotification } from '@/lib/context/NotificationContext';

export interface ApiProduct {
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

interface ProductCardProps {
  product: ApiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { addNotification } = useNotification();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use CartContext for now, adapting to API structure
    addItem(product as any);
    addNotification({ type: 'success', message: `${product.name ?? product.title} añadido al carrito` });
  };

  const origPrice = product.original_price ? Number(product.original_price) : null;
  const price = Number(product.price);
  const tagLabel = origPrice && origPrice > price ? 'SALE' : (product.stock ?? 999) < 10 ? 'LIMITED' : 'NEW';


  return (
    <>
      <style jsx>{`
        .premium-card {
          display: block;
          text-decoration: none;
          color: #050505;
          position: relative;
          width: 100%;
          cursor: pointer;
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #f2f2f2;
          margin-bottom: 1rem;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .premium-card:hover .card-img {
          transform: scale(1.05);
        }

        .card-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          padding: 0.3rem 0.6rem;
          background: #fff;
          color: #000;
          z-index: 10;
        }

        .card-quick-add {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.95);
          color: #000;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-align: center;
          text-transform: uppercase;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-top: 1px solid rgba(0,0,0,0.05);
          z-index: 15;
        }

        .premium-card:hover .card-quick-add {
          transform: translateY(0);
        }

        .card-quick-add:hover {
          background: #000;
          color: #fff;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .card-price {
          font-size: 1rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .card-category {
          font-size: 0.8rem;
          color: #737373;
          text-transform: capitalize;
        }
      `}</style>

      <Link href={`/marketplace/producto/${product.id}`} className="premium-card">
        <div className="card-image-wrapper">
          <img src={getImg(product)} alt={product.name ?? product.title ?? ''} className="card-img" />
          <div className="card-tag">{tagLabel}</div>
          <div className="card-quick-add" onClick={handleAddToCart}>Agregar al Carrito</div>
        </div>
        <div className="card-info">
          <div className="card-header">
            <h3 className="card-title">{product.name ?? product.title}</h3>
            <div className="card-price">${price.toLocaleString('es-AR')}</div>
          </div>
          <div className="card-category">{getCatName(product)}</div>
        </div>
      </Link>
    </>
  );
}
