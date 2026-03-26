'use client';

import React, { useState, useEffect } from 'react';
import { Service } from '@/lib/api/types';
import { useNotification } from '@/lib/context/NotificationContext';
import styles from './page.module.css';

export default function StudioServicios() {
  const [services, setServices] = useState<Service[]>([]);
  const { addNotification } = useNotification();

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (e) {
        console.error('Failed to fetch services', e);
      }
    }

    fetchServices();
  }, []);

  const handleContact = (serviceTitle: string) => {
    addNotification({
      type: 'success',
      message: `Gracias por tu interés en ${serviceTitle}. Te contactaremos pronto.`
    });
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Digital <span className={styles.highlight}>Studio</span>
          </h1>
          <p className={styles.subtitle}>
            Transformamos ideas en experiencias digitales memorables. 
            Desarrollo de alta calidad con intención y propósito.
          </p>
        </div>
        <div className={styles.geometricAccent} />
      </section>

      <section className={styles.services}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nuestros servicios</h2>
          
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div key={service.id} className={styles.serviceCard} id={service.id}>
                <div className={styles.serviceNumber}>0{index + 1}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                
                <ul className={styles.serviceFeatures}>
                  {service.features.map((feature, i) => (
                    <li key={i} className={styles.feature}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className={styles.serviceFooter}>
                  <span className={styles.servicePrice}>{service.price}</span>
                  <button 
                    className={styles.contactButton}
                    onClick={() => handleContact(service.title)}
                  >
                    Contactar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Proceso de trabajo</h2>
          
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepIcon}>01</div>
              <h3 className={styles.stepTitle}>Descubrimiento</h3>
              <p className={styles.stepDescription}>
                Analizamos tus necesidades y objetivos para crear una estrategia personalizada.
              </p>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepIcon}>02</div>
              <h3 className={styles.stepTitle}>Desarrollo</h3>
              <p className={styles.stepDescription}>
                Implementamos soluciones robustas con código limpio y escalable.
              </p>
            </div>
            
            <div className={styles.processStep}>
              <div className={styles.stepIcon}>03</div>
              <h3 className={styles.stepTitle}>Entrega</h3>
              <p className={styles.stepDescription}>
                Lanzamos tu proyecto con soporte continuo y optimización.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>¿Hablamos?</h2>
            <p className={styles.ctaText}>
              Cuéntanos sobre tu proyecto y encontremos la mejor solución juntos.
            </p>
            <button 
              className={styles.ctaButton}
              onClick={() => handleContact('consultoría')}
            >
              Iniciar conversación
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
