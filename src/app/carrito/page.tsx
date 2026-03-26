'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';
import styles from './page.module.css';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Carrito de compras</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
            <Link href="/marketplace" className={styles.continueButton}>
              Continuar comprando
            </Link>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.items}>
              <div className={styles.itemsHeader}>
                <span>{items.length} producto(s)</span>
                <button className={styles.clearButton} onClick={clearCart}>
                  Vaciar carrito
                </button>
              </div>

              {items.map(item => (
                <div key={item.product.id} className={styles.item}>
                  <Link href={`/marketplace/producto/${item.product.id}`} className={styles.itemImage}>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      className={styles.image}
                    />
                  </Link>

                  <div className={styles.itemDetails}>
                    <Link href={`/marketplace/producto/${item.product.id}`} className={styles.itemName}>
                      {item.product.title}
                    </Link>
                    <p className={styles.itemBrand}>{item.product.brand}</p>
                    <p className={styles.itemPrice}>${item.product.price.toFixed(2)}</p>
                  </div>

                  <div className={styles.itemActions}>
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

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className={styles.removeButton}
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className={styles.itemTotal}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Resumen del pedido</h2>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>

              {shipping > 0 && (
                <p className={styles.shippingNote}>
                  Envío gratis en pedidos mayores a $100
                </p>
              )}

              <div className={styles.divider} />

              <div className={styles.summaryRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className={styles.checkoutButton}>
                Proceder al checkout
              </Link>

              <Link href="/marketplace" className={styles.continueLink}>
                Continuar comprando
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
