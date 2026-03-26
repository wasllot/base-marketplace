'use client';

import React from 'react';
import { useNotification } from '@/lib/context/NotificationContext';
import styles from './ToastNotifications.module.css';

export default function ToastNotifications() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className={styles.container}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`${styles.toast} ${styles[notification.type]}`}
          onClick={() => removeNotification(notification.id)}
        >
          <span className={styles.message}>{notification.message}</span>
          <button className={styles.close} aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
