'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const collections = [
  {
    id: 'fw25',
    season: 'FW25',
    title: 'Invierno Esencial',
    description: 'Volúmenes amplios, paleta monocromática y materiales de abrigo. La colección que define el invierno BASE.',
    items: ['Jackets Oversize', 'Abrigos de Lana', 'Hoodies Estructurados', 'Pantalones Wide'],
    href: '/marketplace?category=moda',
  },
  {
    id: 'acc25',
    season: 'ACC',
    title: 'Accesorios Signature',
    description: 'Complementos que elevan cualquier look. Bolsos minimalistas, gorros y cinturones con identidad propia.',
    items: ['Bolsos Bucket', 'Gorros Logo', 'Cinturones Reversibles', 'Tote Bags'],
    href: '/marketplace?category=accesorios',
  },
  {
    id: 'basics',
    season: 'CORE',
    title: 'Basics Permanentes',
    description: 'Las prendas que nunca faltan. Corte impecable, calidad superior, siluetas atemporales.',
    items: ['Tees Premium', 'Polos de Seda', 'Sweaters Ligeros', 'Joggers Técnicos'],
    href: '/marketplace',
  },
];

export default function ColeccionesPage() {
  const router = useRouter();

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#fff', fontFamily: "'Inter', 'Helvetica Neue', system-ui, sans-serif" }}>

      {/* Hero editorial */}
      <section style={{
        background: '#000',
        color: '#fff',
        padding: '8rem 5rem 6rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.3rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: 20, height: 1, background: '#A9A9A9', display: 'inline-block' }} />
            Colecciones BASE
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 200, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '2rem' }}>
            Cada pieza,<br /><strong style={{ fontWeight: 700 }}>una historia.</strong>
          </h1>
          <p style={{ fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.9, color: '#A9A9A9', maxWidth: 420, marginBottom: '3rem' }}>
            Diseñamos moda con propósito. Colecciones construidas desde la esencia: materiales seleccionados, siluetas estudiadas y una identidad que trasciende la temporada.
          </p>
          <Link href="/marketplace" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
            padding: '0.9rem 2.2rem', background: '#fff', color: '#000',
            textDecoration: 'none', fontSize: '0.68rem', fontWeight: 600,
            letterSpacing: '0.15rem', textTransform: 'uppercase',
            transition: 'background 0.3s ease',
          }}>
            Explorar Marketplace
          </Link>
        </div>
      </section>

      {/* Collections grid */}
      <section style={{ padding: '7rem 5rem' }}>
        <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.3rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ width: 20, height: 1, background: '#A9A9A9', display: 'inline-block' }} />
          Temporadas
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 200, letterSpacing: '-0.02em', marginBottom: '4rem' }}>
          Nuestras<br /><strong style={{ fontWeight: 700 }}>colecciones.</strong>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5px', background: '#E8E8E8' }}>
          {collections.map((col, i) => (
            <Link key={col.id} href={col.href} style={{
              background: '#fff',
              padding: '3.5rem',
              textDecoration: 'none',
              color: '#000',
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background 0.4s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              <span style={{ position: 'absolute', top: '2.5rem', right: '3rem', fontSize: '4rem', fontWeight: 700, color: '#f5f5f5', lineHeight: 1 }}>
                0{i + 1}
              </span>
              <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.25rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '1.5rem' }}>
                {col.season}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '1rem' }}>{col.title}</h3>
              <p style={{ fontSize: '0.75rem', fontWeight: 300, lineHeight: 1.8, color: '#424242', marginBottom: '2rem' }}>
                {col.description}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {col.items.map((item) => (
                  <li key={item} style={{ fontSize: '0.7rem', fontWeight: 400, color: '#424242', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                    <span style={{ width: 4, height: 4, background: '#000', borderRadius: '50%', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15rem', textTransform: 'uppercase', color: '#000' }}>
                Ver colección
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Philosophy section */}
      <section style={{ padding: '7rem 5rem', background: '#f5f5f5', borderTop: '1px solid #E8E8E8' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.3rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: 20, height: 1, background: '#A9A9A9', display: 'inline-block' }} />
              Nuestra filosofía
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 200, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2rem' }}>
              Diseño con<br /><strong style={{ fontWeight: 700 }}>intención.</strong>
            </h2>
            <p style={{ fontSize: '0.82rem', fontWeight: 300, lineHeight: 1.9, color: '#424242', marginBottom: '2rem' }}>
              En BASE creemos que la moda debe ser deliberada. Cada prenda que diseñamos pasa por un proceso riguroso de selección de materiales, pruebas de silueta y validación de identidad de marca.
            </p>
            <p style={{ fontSize: '0.82rem', fontWeight: 300, lineHeight: 1.9, color: '#424242', marginBottom: '3rem' }}>
              No seguimos tendencias pasajeras. Construimos un guardarropa atemporal, pieza a pieza.
            </p>
            <Link href="/marketplace" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
              padding: '0.9rem 2.2rem', background: '#000', color: '#fff',
              textDecoration: 'none', fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.15rem', textTransform: 'uppercase',
            }}>
              Descubrir BASE
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5px', background: '#E8E8E8' }}>
            {['Materiales Premium', 'Siluetas Estudiadas', 'Identidad Clara', 'Atemporal'].map((item, i) => (
              <div key={i} style={{ background: '#fff', padding: '2.5rem 2rem' }}>
                <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2rem', textTransform: 'uppercase', color: '#A9A9A9', marginBottom: '0.8rem' }}>0{i + 1}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.02em' }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
