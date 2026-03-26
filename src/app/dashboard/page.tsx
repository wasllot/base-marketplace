'use client';

import React, { useState, useEffect } from 'react';
import { Order, User } from '@/lib/api/types';
import styles from './page.module.css';

type Tab = 'orders' | 'profile' | 'settings';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, userRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/user')
        ]);
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : (ordersData.data || []));
        }
        
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
      } catch (e) {
        console.error('Failed to fetch data', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return '#f59e0b';
      case 'shipped': return '#3b82f6';
      case 'delivered': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mi cuenta</h1>

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              <button
                className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Mis pedidos
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Perfil
              </button>
              <button
                className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Configuración
              </button>
            </nav>
          </aside>

          <main className={styles.main}>
            {loading ? (
              <div className={styles.loading}>Cargando...</div>
            ) : (
              <>
                {activeTab === 'orders' && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Mis pedidos</h2>
                    
                    {orders.length === 0 ? (
                      <p className={styles.empty}>No tienes pedidos aún</p>
                    ) : (
                      <div className={styles.ordersList}>
                        {orders.map(order => (
                          <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                              <div>
                                <span className={styles.orderId}>Pedido #{order.id}</span>
                                <span className={styles.orderDate}>{order.date}</span>
                              </div>
                              <span 
                                className={styles.orderStatus}
                                style={{ backgroundColor: getStatusColor(order.status) }}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                            
                            <div className={styles.orderItems}>
                              {order.items.map((item, index) => (
                                <span key={index} className={styles.orderItemBadge}>
                                  {item.quantity}x Producto
                                </span>
                              ))}
                            </div>
                            
                            <div className={styles.orderFooter}>
                              <span className={styles.orderTotal}>
                                Total: ${order.total.toFixed(2)}
                              </span>
                              <span className={styles.orderShipping}>
                                Envío: ${order.shipping.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'profile' && user && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Información del perfil</h2>
                    
                    <div className={styles.profileInfo}>
                      <div className={styles.profileField}>
                        <span className={styles.fieldLabel}>Nombre</span>
                        <span className={styles.fieldValue}>{user.name}</span>
                      </div>
                      <div className={styles.profileField}>
                        <span className={styles.fieldLabel}>Email</span>
                        <span className={styles.fieldValue}>{user.email}</span>
                      </div>
                      <div className={styles.profileField}>
                        <span className={styles.fieldLabel}>Teléfono</span>
                        <span className={styles.fieldValue}>{user.phone}</span>
                      </div>
                      <div className={styles.profileField}>
                        <span className={styles.fieldLabel}>Dirección</span>
                        <span className={styles.fieldValue}>
                          {user.address.street}, {user.address.city}, {user.address.state} {user.address.zip}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Configuración</h2>
                    
                    <div className={styles.settingsList}>
                      <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                          <span className={styles.settingLabel}>Notificaciones</span>
                          <span className={styles.settingDescription}>
                            Recibir notificaciones sobre pedidos y promociones
                          </span>
                        </div>
                        <label className={styles.toggle}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.slider} />
                        </label>
                      </div>
                      
                      <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                          <span className={styles.settingLabel}>Newsletter</span>
                          <span className={styles.settingDescription}>
                            Recibir actualizaciones y noticias
                          </span>
                        </div>
                        <label className={styles.toggle}>
                          <input type="checkbox" />
                          <span className={styles.slider} />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
