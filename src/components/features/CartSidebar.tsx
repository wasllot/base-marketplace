'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';
import styles from './CartSidebar.module.css';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={closeCart} />
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Carrito ({totalItems})</h2>
          <button className={styles.closeButton} onClick={closeCart} aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
            <Link href="/marketplace" className={styles.shopButton} onClick={closeCart}>
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(item => (
                <div key={item.product.id} className={styles.item}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.details}>
                    <h3 className={styles.itemName}>{item.product.title}</h3>
                    <p className={styles.itemPrice}>${item.product.price.toFixed(2)}</p>
                    <div className={styles.quantity}>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className={styles.quantityButton}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeItem(item.product.id)}
                    aria-label="Eliminar"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.subtotalAmount}>${subtotal.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className={styles.checkoutButton} onClick={closeCart}>
                Proceder al checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
