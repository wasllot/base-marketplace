'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';
import { useNotification } from '@/lib/context/NotificationContext';
import styles from './page.module.css';

type Step = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { addNotification } = useNotification();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };

  const handlePlaceOrder = () => {
    addNotification({
      type: 'success',
      message: '¡Pedido realizado con éxito!'
    });
    clearCart();
    window.location.href = '/dashboard';
  };

  const steps: { key: Step; label: string }[] = [
    { key: 'shipping', label: 'Envío' },
    { key: 'payment', label: 'Pago' },
    { key: 'review', label: 'Confirmar' },
  ];

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
            <Link href="/marketplace" className={styles.continueButton}>
              Volver al marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div
                className={`${styles.step} ${
                  steps.findIndex(s => s.key === currentStep) >= index ? styles.active : ''
                }`}
              >
                <span className={styles.stepNumber}>{index + 1}</span>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
              {index < steps.length - 1 && <div className={styles.stepLine} />}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.content}>
          <div className={styles.form}>
            {currentStep === 'shipping' && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Información de envío</h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Nombre completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Dirección</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Estado</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Código postal</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button className={styles.nextButton} onClick={handleNext}>
                    Continuar al pago
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Método de pago</h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Número de tarjeta</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Fecha de expiración</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>CVV</label>
                    <input
                      type="text"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button className={styles.backButton} onClick={handleBack}>
                    Volver
                  </button>
                  <button className={styles.nextButton} onClick={handleNext}>
                    Revisar pedido
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Confirmar pedido</h2>
                
                <div className={styles.reviewSection}>
                  <h3 className={styles.reviewTitle}>Dirección de envío</h3>
                  <p>{formData.name}</p>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.state} {formData.zip}</p>
                  <p>{formData.email}</p>
                  <p>{formData.phone}</p>
                </div>

                <div className={styles.reviewSection}>
                  <h3 className={styles.reviewTitle}>Método de pago</h3>
                  <p>Tarjeta terminada en {formData.cardNumber.slice(-4)}</p>
                </div>

                <div className={styles.formActions}>
                  <button className={styles.backButton} onClick={handleBack}>
                    Volver
                  </button>
                  <button className={styles.placeOrderButton} onClick={handlePlaceOrder}>
                    Realizar pedido
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumen del pedido</h2>
            
            <div className={styles.orderItems}>
              {items.map(item => (
                <div key={item.product.id} className={styles.orderItem}>
                  <div className={styles.orderItemImage}>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.title}
                      fill
                      className={styles.image}
                    />
                    <span className={styles.itemQuantity}>{item.quantity}</span>
                  </div>
                  <div className={styles.orderItemDetails}>
                    <p className={styles.itemName}>{item.product.title}</p>
                    <p className={styles.itemPrice}>${item.product.price.toFixed(2)}</p>
                  </div>
                  <p className={styles.itemTotal}>${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
