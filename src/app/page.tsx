'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api/types';
import ProductCard from '@/components/ui/ProductCard';

interface Service {
  id: string;
  name: string;
  icon: string;
}

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaderDone(true), 1200);
    return () => clearTimeout(timer);
  }, []);



  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    // Initial query after a small delay to ensure all nested elements like mapped products are in the DOM
    const timeout = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const services: Service[] = [
    { id: '1', name: 'Desarrollo Full Stack', icon: 'polyline' },
    { id: '2', name: 'Diseño UI/UX', icon: 'circle' },
    { id: '3', name: 'Branding & Identidad', icon: 'polygon' },
    { id: '4', name: 'Optimización de Sistemas', icon: 'circle' },
    { id: '5', name: 'E-commerce Premium', icon: 'bag' },
  ];

  const featuredProducts = products.length > 0 ? products : [
    { id: '1', title: 'Jacket Oversize Noir', description: 'Premium jacket', price: 89000, currency: 'ARS', condition: 'new' as const, brand: 'BASE', category: 'Moda', subcategory: 'Jackets', images: [], stock: 10, sku: 'JKT-001', attributes: {} },
    { id: '2', title: 'Bolso Minimal Gris', description: 'Minimal bag', price: 65000, currency: 'ARS', condition: 'new' as const, brand: 'BASE', category: 'Accesorios', subcategory: 'Bolsos', images: [], stock: 10, sku: 'BLG-001', attributes: {} },
    { id: '3', title: 'Tee Estructura BASE', description: 'Base tee', price: 42000, currency: 'ARS', condition: 'new' as const, brand: 'BASE', category: 'Moda', subcategory: 'Remeras', images: [], stock: 10, sku: 'TEE-001', attributes: {} },
    { id: '4', title: 'Cap Logo Blanco', description: 'Logo cap', price: 35000, currency: 'ARS', condition: 'new' as const, brand: 'BASE', category: 'Accesorios', subcategory: 'Gorros', images: [], stock: 10, sku: 'CAP-001', attributes: {} },
    { id: '5', title: 'Pantalón Wide Charcoal', description: 'Wide pants', price: 78000, currency: 'ARS', condition: 'new' as const, brand: 'BASE', category: 'Moda', subcategory: 'Pantalones', images: [], stock: 10, sku: 'PNT-001', attributes: {} },
    { id: '6', title: 'Hoodie Essential', description: 'Essential hoodie', price: 68000, currency: 'ARS', condition: 'new' as const, brand: 'BASE', category: 'Moda', subcategory: 'Hoodies', images: [], stock: 10, sku: 'HOD-001', attributes: {} },
  ];

  return (
    <>


      <div className={`loader ${loaderDone ? 'done' : ''}`}>
        <div className="loader-logo">BASE</div>
      </div>

      <nav className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="nav-logo">BASE</Link>
        <ul className="nav-links">
          <li><Link href="/marketplace">Moda</Link></li>
          <li><Link href="/marketplace">Marketplace</Link></li>
          <li><Link href="/studio/servicios">Studio</Link></li>
          <li><Link href="#contacto">Contacto</Link></li>
        </ul>
        <div className="nav-actions">
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <svg className="nav-icon" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">E-commerce Premium · Digital Studio</div>
          <h1 className="hero-title">
            <span className="line"><span>Menos,</span></span>
            <span className="line"><span>pero con</span></span>
            <span className="line"><span className="line-bold">intención.</span></span>
          </h1>
          <p className="hero-desc">
            E-commerce premium y desarrollo digital de alta calidad. BASE es fundamento, seguridad y presencia.
          </p>
          <div className="hero-cta">
            <Link href="/marketplace" className="btn-primary"><span>Explorar Marketplace</span></Link>
            <Link href="/studio/servicios" className="btn-ghost">Ver Servicios Studio</Link>
          </div>
          <div className="hero-scroll-hint">
            <div className="scroll-line"></div>
            <span className="scroll-text">Scroll</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-overlay"></div>
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
              alt="BASE — Colección"
              className="hero-img"
            />
          </div>
          <div className="hero-counter">01 / 03</div>
        </div>
      </section>

      <div className="marquee-section">
        <div className="marquee-track">
          {['Marketplace', 'Digital Studio', 'Moda Premium', 'UI/UX Design', 'Branding', 'Full Stack', 'Simplicidad', 'Calidad'].map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot"></span>
            </span>
          ))}
          {['Marketplace', 'Digital Studio', 'Moda Premium', 'UI/UX Design', 'Branding', 'Full Stack', 'Simplicidad', 'Calidad'].map((item, i) => (
            <span key={`dup-${i}`} className="marquee-item">
              {item}
              <span className="marquee-dot"></span>
            </span>
          ))}
        </div>
      </div>

      <section className="section" id="plataformas">
        <div className="section-label reveal" id="label-plataformas">Plataformas</div>
        <h2 className="section-title reveal">
          Dos mundos,<br /><strong>una visión.</strong>
        </h2>
        <div className="platform-grid reveal">
          <Link href="/marketplace" className="platform-card">
            <span className="card-number">01</span>
            <svg className="card-icon" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h3 className="card-title">Marketplace</h3>
            <p className="card-desc">
              Productos seleccionados de moda y accesorios premium. Cada pieza es elegida con propósito, funcionalidad y estética atemporal.
            </p>
            <span className="card-link">
              Explorar colección
              <svg className="card-arrow" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </Link>
          <Link href="/studio/servicios" className="platform-card">
            <span className="card-number">02</span>
            <svg className="card-icon" viewBox="0 0 24 24">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <h3 className="card-title">Digital Studio</h3>
            <p className="card-desc">
              Desarrollo web, diseño UI/UX y optimización de sistemas. Construimos marcas digitales con la misma precisión que nuestras prendas.
            </p>
            <span className="card-link">
              Ver servicios
              <svg className="card-arrow" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </Link>
        </div>
      </section>

      <section className="featured-section" id="marketplace">
        <div className="featured-header reveal">
          <div>
            <div className="section-label">Marketplace · Destacados</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Piezas<br /><strong>esenciales.</strong></h2>
          </div>
          <Link href="/marketplace" className="view-all">
            Ver todos
            <svg style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map((product, i) => (
            <div key={product.id} className={`reveal ${i % 3 === 1 ? 'reveal-delay-1' : i % 3 === 2 ? 'reveal-delay-2' : ''}`}>
               <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="studio-section" id="studio">
        <div className="studio-visual">
          <div className="studio-grid-bg"></div>
          <div className="studio-services">
            {services.map((service) => (
              <div key={service.id} className="service-item">
                <span className="service-name">{service.name}</span>
                <svg className="service-icon" viewBox="0 0 24 24">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
            ))}
          </div>
        </div>
        <div className="studio-content" id="studio-content">
          <div className="section-label reveal">Digital Studio</div>
          <h2 className="section-title reveal">Construimos<br /><strong>desde la base.</strong></h2>
          <p className="hero-desc reveal" style={{ maxWidth: 360 }}>
            Desarrollo web, diseño UI/UX y optimización de sistemas. Creamos experiencias digitales con la misma filosofía que define nuestra marca: menos, pero con intención.
          </p>
          <div className="reveal" style={{ marginTop: '2rem' }}>
            <Link href="/studio/servicios" className="btn-primary"><span>Solicitar Propuesta</span></Link>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="section-label reveal">Identidad</div>
        <h2 className="section-title reveal">Lo que<br /><strong>nos define.</strong></h2>
        <div className="values-grid">
          <div className="value-item reveal">
            <div className="value-number">01</div>
            <div className="value-title">Simplicidad</div>
            <div className="value-desc">Eliminamos lo innecesario. Cada elemento tiene propósito. Cada decisión, intención.</div>
          </div>
          <div className="value-item reveal">
            <div className="value-number">02</div>
            <div className="value-title">Calidad</div>
            <div className="value-desc">Materiales, código y diseño de alto estándar. No hacemos concesiones en lo que entregamos.</div>
          </div>
          <div className="value-item reveal">
            <div className="value-number">03</div>
            <div className="value-title">Atemporalidad</div>
            <div className="value-desc">Piezas y proyectos que trascienden tendencias. Diseñamos para durar, no para un momento.</div>
          </div>
          <div className="value-item reveal">
            <div className="value-number">04</div>
            <div className="value-title">Confianza</div>
            <div className="value-desc">BASE es fundamento. Construimos relaciones sólidas con cada cliente y cada prenda.</div>
          </div>
        </div>
      </section>

      <div className="cta-section" id="contacto">
        <div>
          <h2 className="cta-title">¿Listo para<br /><strong>empezar?</strong></h2>
          <p className="cta-subtitle">Explora nuestro marketplace o contáctanos para servicios digitales.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <Link href="/marketplace" className="btn-white">Explorar Marketplace</Link>
          <Link href="/studio/servicios" className="btn-ghost" style={{ color: 'var(--white)', borderColor: 'rgba(255,255,255,0.2)', textAlign: 'center', fontSize: '0.68rem', fontWeight: '500', letterSpacing: '0.15rem', textTransform: 'uppercase', padding: '1rem 2.5rem', textDecoration: 'none', transition: 'all 0.3s' }}>Ver Studio</Link>
        </div>
      </div>



      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --black: #000000;
          --charcoal: #424242;
          --white: #ffffff;
          --soft-gray: #D3D3D3;
          --dark-gray: #A9A9A9;
          --light-gray: #f5f5f5;
          --off-white: #fafafa;
          --accent: #424242;
          --transition: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        html { scroll-behavior: smooth; }

        .cursor {
          width: 8px;
          height: 8px;
          background: var(--black);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.1s ease;
        }

        .cursor-follower {
          width: 30px;
          height: 30px;
          border: 1px solid var(--black);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          transition: all 0.3s var(--transition);
          opacity: 0.5;
        }

        .cursor-follower.hovered {
          transform: scale(2);
          opacity: 0.2;
        }

        .loader {
          position: fixed;
          inset: 0;
          background: var(--black);
          z-index: 9000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.8s var(--transition), visibility 0.8s;
        }

        .loader.done { opacity: 0; visibility: hidden; }

        .loader-logo {
          font-family: 'Montserrat', sans-serif;
          font-size: 3rem;
          font-weight: 200;
          letter-spacing: 1.5rem;
          color: var(--white);
          animation: loaderPulse 1.5s ease-in-out infinite;
        }

        @keyframes loaderPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: var(--white); }
        ::-webkit-scrollbar-thumb { background: var(--black); }

        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0 3rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        nav.scrolled { border-bottom-color: var(--soft-gray); }

        .nav-logo {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.4rem;
          text-decoration: none;
          color: var(--black);
          opacity: 0;
          animation: fadeUp 0.8s 1.8s var(--transition) forwards;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
          opacity: 0;
          animation: fadeUp 0.8s 2s var(--transition) forwards;
        }

        .nav-links a {
          text-decoration: none;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          color: var(--charcoal);
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--black);
          transition: width 0.3s var(--transition);
        }

        .nav-links a:hover { color: var(--black); }
        .nav-links a:hover::after { width: 100%; }

        .nav-actions {
          display: flex;
          gap: 1.2rem;
          align-items: center;
          opacity: 0;
          animation: fadeUp 0.8s 2.1s var(--transition) forwards;
        }

        .nav-icon {
          width: 18px;
          height: 18px;
          stroke: var(--charcoal);
          fill: none;
          stroke-width: 1.5;
          transition: stroke 0.3s ease;
        }

        .nav-icon:hover { stroke: var(--black); }

        .hero {
          height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 8rem 5rem 4rem 5rem;
          position: relative;
        }

        .hero-tag {
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.3rem;
          text-transform: uppercase;
          color: var(--dark-gray);
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeUp 0.8s 2s var(--transition) forwards;
        }

        .hero-title {
          font-size: clamp(3.5rem, 5.5vw, 5.5rem);
          font-weight: 200;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 2.5rem;
        }

        .hero-title .line {
          display: block;
          overflow: hidden;
        }

        .hero-title .line span {
          display: block;
          transform: translateY(110%);
          animation: slideUp 1s var(--transition) forwards;
        }

        .hero-title .line:nth-child(1) span { animation-delay: 2.2s; }
        .hero-title .line:nth-child(2) span { animation-delay: 2.4s; }

        .hero-title .line-bold { font-weight: 700; }

        .hero-desc {
          font-size: 0.8rem;
          font-weight: 300;
          line-height: 1.9;
          color: var(--charcoal);
          max-width: 280px;
          margin-bottom: 3.5rem;
          opacity: 0;
          animation: fadeUp 0.8s 2.7s var(--transition) forwards;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          opacity: 0;
          animation: fadeUp 0.8s 2.9s var(--transition) forwards;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.9rem 2.2rem;
          background: var(--black);
          color: var(--white);
          text-decoration: none;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          transition: all 0.3s var(--transition);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--charcoal);
          transform: translateX(-100%);
          transition: transform 0.4s var(--transition);
        }

        .btn-primary:hover::before { transform: translateX(0); }
        .btn-primary span { position: relative; z-index: 1; }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.9rem 2.2rem;
          background: transparent;
          color: var(--black);
          text-decoration: none;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          border: 1px solid var(--soft-gray);
          transition: all 0.3s var(--transition);
        }

        .btn-ghost:hover { border-color: var(--black); background: var(--light-gray); }

        .hero-scroll-hint {
          position: absolute;
          bottom: 3rem;
          left: 5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          animation: fadeUp 0.8s 3.2s var(--transition) forwards;
        }

        .scroll-line {
          width: 40px;
          height: 1px;
          background: var(--soft-gray);
          position: relative;
          overflow: hidden;
        }

        .scroll-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: var(--black);
          animation: scrollLine 2s 3.5s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0% { left: -100%; }
          50% { left: 0; }
          100% { left: 100%; }
        }

        .scroll-text {
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          color: var(--dark-gray);
        }

        .hero-right {
          position: relative;
          overflow: hidden;
          background: var(--light-gray);
        }

        .hero-image-wrap {
          position: absolute;
          inset: 0;
          transform: scale(1.1);
          animation: heroReveal 1.4s 1.5s var(--transition) forwards;
        }

        @keyframes heroReveal {
          to { transform: scale(1); }
        }

        .hero-image-overlay {
          position: absolute;
          inset: 0;
          background: var(--black);
          transform-origin: right;
          animation: overlayReveal 1s 1.5s var(--transition) forwards;
        }

        @keyframes overlayReveal {
          to { transform: scaleX(0); }
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(20%) contrast(1.05);
        }

        .hero-img-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a1a 0%, #424242 40%, #888 80%, #ccc 100%);
          display: flex;
          align-items: flex-end;
          padding: 3rem;
        }

        .hero-img-text {
          color: rgba(255,255,255,0.5);
          font-size: 0.6rem;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          font-weight: 300;
        }

        .hero-counter {
          position: absolute;
          bottom: 3rem;
          right: 3rem;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.1rem;
          color: rgba(255,255,255,0.5);
          opacity: 0;
          animation: fadeUp 0.8s 3s var(--transition) forwards;
        }

        .marquee-section {
          border-top: 1px solid var(--soft-gray);
          border-bottom: 1px solid var(--soft-gray);
          overflow: hidden;
          padding: 1.2rem 0;
          background: var(--black);
        }

        .marquee-track {
          display: flex;
          gap: 0;
          animation: marquee 20s linear infinite;
          width: max-content;
        }

        .marquee-item {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 0 2rem;
          white-space: nowrap;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.3rem;
          text-transform: uppercase;
          color: var(--white);
        }

        .marquee-dot {
          width: 4px;
          height: 4px;
          background: var(--dark-gray);
          border-radius: 50%;
          flex-shrink: 0;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .section {
          padding: 8rem 5rem;
        }

        .section-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.3rem;
          text-transform: uppercase;
          color: var(--dark-gray);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .section-label::before {
          content: '';
          width: 20px;
          height: 1px;
          background: var(--dark-gray);
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 200;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 4rem;
        }

        .section-title strong { font-weight: 700; }

        .platform-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5px;
          background: var(--soft-gray);
        }

        .platform-card {
          background: var(--white);
          padding: 3.5rem;
          position: relative;
          overflow: hidden;
          transition: background 0.5s var(--transition);
          text-decoration: none;
          display: block;
        }

        .platform-card::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--black);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s var(--transition);
        }

        .platform-card:hover::before { transform: scaleX(1); }
        .platform-card:hover { background: var(--off-white); }

        .card-icon {
          width: 40px;
          height: 40px;
          margin-bottom: 2rem;
          stroke: var(--charcoal);
          fill: none;
          stroke-width: 1.2;
        }

        .card-title {
          font-size: 1.3rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 0.8rem;
          color: var(--black);
        }

        .card-desc {
          font-size: 0.75rem;
          font-weight: 300;
          line-height: 1.8;
          color: var(--charcoal);
          margin-bottom: 2.5rem;
        }

        .card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--black);
          transition: gap 0.3s var(--transition);
        }

        .card-link:hover { gap: 1rem; }

        .card-arrow {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.5;
          transition: transform 0.3s var(--transition);
        }

        .card-link:hover .card-arrow { transform: translateX(4px); }

        .card-number {
          position: absolute;
          top: 2.5rem;
          right: 3rem;
          font-size: 4rem;
          font-weight: 700;
          color: var(--light-gray);
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .featured-section {
          padding: 8rem 5rem;
          background: var(--off-white);
        }

        .featured-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 4rem;
        }

        .view-all {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--charcoal);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--soft-gray);
          padding-bottom: 0.2rem;
          transition: all 0.3s ease;
        }

        .view-all:hover { color: var(--black); border-color: var(--black); gap: 1rem; }

        .view-all:hover { color: var(--black); border-color: var(--black); gap: 1rem; }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .home-product-card {
          display: block;
          group: true;
        }

        .product-image {
          aspect-ratio: 3/4;
          background: var(--soft-gray);
          overflow: hidden;
          position: relative;
          margin-bottom: 1.2rem;
        }

        .product-image-inner {
          width: 100%;
          height: 100%;
          transition: transform 0.7s var(--transition);
        }

        .home-product-card:hover .product-image-inner { transform: scale(1.04); }

        .product-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: var(--black);
          color: var(--white);
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.1rem;
          text-transform: uppercase;
          padding: 0.3rem 0.7rem;
        }

        .product-action {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--black);
          color: var(--white);
          text-align: center;
          padding: 0.9rem;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          transform: translateY(100%);
          transition: transform 0.4s var(--transition);
        }

        .home-product-card:hover .product-action { transform: translateY(0); }

        .product-info { padding: 0 0.2rem; }
        
        .product-category {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          color: var(--dark-gray);
          margin-bottom: 0.4rem;
        }

        .product-name {
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          margin-bottom: 0.5rem;
        }

        .product-price {
          font-size: 0.8rem;
          font-weight: 300;
          color: var(--charcoal);
        }

        .studio-section {
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 70vh;
        }

        .studio-visual {
          background: var(--black);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 6rem;
        }

        .studio-grid-bg {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image:
            linear-gradient(var(--white) 1px, transparent 1px),
            linear-gradient(90deg, var(--white) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .studio-services {
          display: flex;
          flex-direction: column;
          gap: 1.5px;
          width: 100%;
          max-width: 320px;
          position: relative;
          z-index: 1;
        }

        .service-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 1.8rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s var(--transition);
        }

        .service-item:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          transform: translateX(4px);
        }

        .service-name {
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--white);
        }

        .service-icon {
          width: 14px;
          height: 14px;
          stroke: var(--dark-gray);
          fill: none;
          stroke-width: 1.5;
          transition: stroke 0.3s ease;
        }

        .service-item:hover .service-icon { stroke: var(--white); }

        .studio-content {
          padding: 7rem 5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .values-section {
          padding: 8rem 5rem;
          border-top: 1px solid var(--soft-gray);
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem;
          margin-top: 4rem;
        }

        .value-item { border-top: 1px solid var(--soft-gray); padding-top: 2rem; }

        .value-number {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.2rem;
          color: var(--dark-gray);
          margin-bottom: 1.5rem;
          font-variant-numeric: tabular-nums;
        }

        .value-title {
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 0.8rem;
        }

        .value-desc {
          font-size: 0.72rem;
          font-weight: 300;
          line-height: 1.8;
          color: var(--charcoal);
        }

        .cta-section {
          margin: 0 5rem 5rem;
          background: var(--black);
          padding: 7rem 6rem;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 3rem;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: 'BASE';
          position: absolute;
          right: -2rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20rem;
          font-weight: 700;
          letter-spacing: -1rem;
          color: rgba(255,255,255,0.02);
          line-height: 1;
          pointer-events: none;
        }

        .cta-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 200;
          color: var(--white);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .cta-title strong { font-weight: 700; }

        .cta-subtitle {
          font-size: 0.75rem;
          font-weight: 300;
          color: var(--dark-gray);
          margin-top: 1rem;
          line-height: 1.8;
        }

        .btn-white {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2.5rem;
          background: var(--white);
          color: var(--black);
          text-decoration: none;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          white-space: nowrap;
          transition: all 0.3s var(--transition);
        }

        .btn-white:hover { background: var(--soft-gray); }

        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s var(--transition), transform 0.8s var(--transition);
        }

        .reveal.visible { opacity: 1; transform: translateY(0); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { transform: translateY(110%); }
          to { transform: translateY(0); }
        }

        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { height: 50vh; }
          .hero-left { padding: 6rem 3rem 3rem; }
          .platform-grid { grid-template-columns: 1fr; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
          .studio-section { grid-template-columns: 1fr; }
          .studio-visual { min-height: 40vh; }
          .section { padding: 5rem 3rem; }
          .featured-section { padding: 5rem 3rem; }
          .cta-section { margin: 0 3rem 3rem; padding: 4rem 3rem; grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          nav { padding: 0 1.5rem; }
          .nav-links { display: none; }
          .hero-left { padding: 5rem 2rem 2rem; }
          .section { padding: 4rem 2rem; }
          .featured-section { padding: 4rem 2rem; }
          .products-grid { grid-template-columns: 1fr; }
          .values-grid { grid-template-columns: 1fr; }
          .cta-section { margin: 0 2rem 2rem; padding: 3rem 2rem; }
          .studio-content { padding: 4rem 2rem; }
        }
      `}</style>
    </>
  );
}
