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

  const isNew = product.condition === 'new';
  const tagLabel = isNew ? 'NEW' : product.condition === 'used' ? 'PRE-OWNED' : 'REFURBISHED';

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
          <img src={getImg(product)} alt={product.title} className="card-img" />
          <div className="card-tag">{tagLabel}</div>
          <div className="card-quick-add" onClick={handleAddToCart}>Agregar al Carrito</div>
        </div>
        <div className="card-info">
          <div className="card-header">
            <h3 className="card-title">{product.title}</h3>
            <div className="card-price">${product.price.toLocaleString('es-AR')}</div>
          </div>
          <div className="card-category">{product.subcategory || product.category}</div>
        </div>
      </Link>
    </>
  );
}
