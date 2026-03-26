'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';
import ProductCard, { ApiProduct } from '@/components/ui/ProductCard';

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [content, setContent] = useState<any>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Auto-scroll logic for slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;
    let isHovered = false;

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);

    const step = () => {
      // Solo hacer auto-scroll si no hay hover, no están clickeando/arrastrando, 
      // y si el ancho es suficiente para hacer scroll
      if (!isHovered && !isDown.current && slider.scrollWidth > slider.clientWidth) {
        slider.scrollLeft += 0.5; // velocidad suave
        // Si llega al final, devolver al principio
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 1) {
          slider.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    };
    
    animationId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [products]);

  useEffect(() => {
    // Initial loading animation
    const timer = setTimeout(() => setLoaderDone(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reveal animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Slight delay to attach observers to dynamically loaded content
    const timeout = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 500);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [content, products]);

  useEffect(() => {
    // Fetch dynamic content
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(() => {});
      
    // Fetch products from live API
    apiFetch<{ data: ApiProduct[] } | ApiProduct[]>(API.PRODUCTS)
      .then(data => {
        const prodList = Array.isArray(data) ? data : (data as { data: ApiProduct[] }).data || [];
        // Show featured products first in the slider, up to 8 items
        const featured = [...prodList].sort((a,b) => (b.is_featured?1:0) - (a.is_featured?1:0)).slice(0, 8);
        setProducts(featured);
      })
      .catch(() => {});
  }, []);

  if (!content) return <div style={{ height: '100vh', background: '#000' }} />;

  const { hero, marquee, platforms, editorial, values, cta } = content;

  return (
    <>
      <style jsx global>{`
        :root {
          --brand-black: #050505;
          --brand-white: #ffffff;
          --brand-gray: #f2f2f2;
          --brand-text: #1a1a1a;
          --brand-text-light: #737373;
        }
        
        body {
          background-color: var(--brand-white);
          color: var(--brand-text);
          font-family: 'Helvetica Neue', Inter, system-ui, sans-serif;
          margin: 0;
          overflow-x: hidden;
        }

        /* Nav */
        .home-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          display: flex;
          justify-content: space-between;
          padding: 2rem 4vw;
          z-index: 100;
          transition: background 0.3s, padding 0.3s;
        }
        .home-nav.scrolled {
          background: rgba(255,255,255,0.95);
          padding: 1rem 4vw;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .home-nav-logo {
          font-weight: 700;
          letter-spacing: 0.5rem;
          color: var(--brand-black);
          text-decoration: none;
          font-size: 1.2rem;
        }
        .home-nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .home-nav-link {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          color: var(--brand-text);
          font-weight: 500;
        }
        .home-nav-link:hover { opacity: 0.6; }

        /* Loading Screen */
        .premium-loader {
          position: fixed;
          inset: 0;
          background: var(--brand-black);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 1s cubic-bezier(0.85, 0, 0.15, 1);
        }
        .premium-loader.done {
          transform: translateY(-100%);
        }
        .premium-loader-logo {
          color: var(--brand-white);
          font-size: 2vw;
          font-weight: 700;
          letter-spacing: 0.8em;
          animation: pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Reveal Animations */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }

        /* Cinematic Hero */
        .cinematic-hero {
          min-height: 100vh;
          width: 100vw;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          padding-top: 80px; /* nav height */
        }

        .hero-text-side {
          padding: 6vw 4vw 4vw 4vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--brand-white);
        }

        .hero-image-side {
          height: 100%;
          min-height: calc(100vh - 80px);
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          animation: slowZoom 20s infinite alternate linear;
        }

        @keyframes slowZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }

        .hero-tag {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--brand-text-light);
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .hero-title-huge {
          font-size: clamp(3.5rem, 6vw, 8rem);
          line-height: 0.9;
          font-weight: 500;
          letter-spacing: -0.04em;
          margin-bottom: 2rem;
        }
        
        .hero-title-huge span { display: block; }

        .hero-title-italic {
          font-style: italic;
          font-family: 'Times New Roman', Times, serif;
          font-weight: 400;
          color: var(--brand-text-light);
        }

        .hero-desc {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 400px;
          color: var(--brand-text-light);
          margin-bottom: 3rem;
        }

        .btn-group {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .btn-black {
          background: var(--brand-black);
          color: var(--brand-white);
          padding: 1rem 2.5rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          text-decoration: none;
          transition: background 0.3s, transform 0.3s;
        }
        .btn-black:hover {
          background: #333;
          transform: translateY(-2px);
        }

        .btn-underline {
          color: var(--brand-text);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          position: relative;
          font-weight: 600;
        }
        .btn-underline::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--brand-text);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-underline:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        /* Marquee */
        .premium-marquee {
          background: var(--brand-black);
          color: var(--brand-white);
          padding: 1.5rem 0;
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }
        
        .marquee-inner {
          display: flex;
          animation: premiumScroll 40s linear infinite;
        }

        .marquee-phrase {
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          margin: 0 3rem;
          display: flex;
          align-items: center;
          gap: 3rem;
        }
        
        .marquee-phrase::after {
          content: '✦';
          font-size: 0.8rem;
          opacity: 0.5;
        }

        @keyframes premiumScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Editorial Split Section */
        .editorial-split {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          min-height: 90vh;
        }
        
        .edit-img-pane {
          background: url('https://images.unsplash.com/photo-1618677603286-0ec56cb6e1b5?w=1200&q=80') center/cover;
          position: relative;
        }
        
        .edit-text-pane {
          padding: 8vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--brand-gray);
        }

        .edit-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 2rem;
          font-weight: 700;
        }

        .edit-title {
          font-size: clamp(2.5rem, 4vw, 4rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 2rem;
        }
        
        .edit-desc {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--brand-text-light);
          max-width: 480px;
          margin-bottom: 3rem;
        }

        /* Curated Subcategories Grid */
        .curated-category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .curated-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          color: var(--brand-text);
          text-decoration: none;
          transition: opacity 0.3s;
        }
        .curated-item:hover {
          opacity: 0.6;
        }
        .curated-item-name {
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        /* Essential Marketplace Section */
        .essential-section {
          padding: 8vw 4vw;
          background: var(--brand-white);
        }

        .essential-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 4vw;
        }

        .essential-title {
          font-size: clamp(2.5rem, 4vw, 4rem);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        
        /* Product Slider Redesign */
        .premium-products-slider {
          display: flex;
          overflow-x: auto;
          gap: 2rem;
          padding-bottom: 3rem;
          scroll-snap-type: none; /* Removed for smooth auto-scroll */
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
          margin-right: -4vw; /* Break out of container to right edge */
          padding-right: 4vw;
          cursor: grab;
        }
        
        .premium-products-slider.active {
          cursor: grabbing;
        }

        .premium-products-slider::-webkit-scrollbar {
          display: none; /* Safari/Chrome */
        }

        .slider-item {
          flex: 0 0 clamp(280px, 25vw, 400px);
        }

        /* Values Full Width */
        .values-banner {
          background: var(--brand-black);
          color: var(--brand-white);
          padding: 8vw 4vw;
          text-align: center;
        }
        .values-banner-title {
          font-size: clamp(3rem, 6vw, 6rem);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 6vw;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4vw;
          text-align: left;
        }
        .value-card {
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 2rem;
        }
        .value-num {
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          opacity: 0.5;
          margin-bottom: 1rem;
        }
        .value-title {
          font-size: 1.4rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .value-desc {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
        }

        /* Minimal CTA */
        .minimal-cta {
          padding: 10vw 4vw;
          text-align: center;
          background: var(--brand-gray);
        }
        .cta-big-text {
          font-size: clamp(3rem, 5vw, 5rem);
          letter-spacing: -0.03em;
          line-height: 1.1;
          max-width: 800px;
          margin: 0 auto 3rem;
        }
        
        /* Mobile Adapts */
        @media (max-width: 900px) {
          .cinematic-hero, .editorial-split {
            grid-template-columns: 1fr;
            height: auto;
          }
          .hero-image-side, .edit-img-pane {
            height: 60vh;
          }
          .values-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .values-grid {
            grid-template-columns: 1fr;
          }
          .premium-products-slider {
            margin-right: -4vw;
            padding-right: 4vw;
          }
          .slider-item {
            flex: 0 0 280px;
          }
        }
      `}</style>

      {/* Loader */}
      <div className={`premium-loader ${loaderDone ? 'done' : ''}`}>
        <div className="premium-loader-logo">BASE</div>
      </div>

      {/* Nav */}
      <nav className={`home-nav ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="home-nav-logo">BASE</Link>
        <div className="home-nav-links">
          <Link href="/marketplace?category=moda" className="home-nav-link">Moda</Link>
          <Link href="/marketplace?category=accesorios" className="home-nav-link">Accesorios</Link>
          <Link href="/marketplace" className="home-nav-link">Marketplace</Link>
        </div>
      </nav>

      {/* Cinematic Hero */}
      <section className="cinematic-hero">
        <div className="hero-text-side">
          <div className="reveal">
            <div className="hero-tag">{hero.tag}</div>
            <h1 className="hero-title-huge">
              <span>{hero.titleLine1}</span>
              <span className="hero-title-italic">{hero.titleLine2}</span>
              <span>{hero.titleLine3}</span>
            </h1>
          </div>
          <div className="reveal delay-1">
            <p className="hero-desc">{hero.description}</p>
            <div className="btn-group">
              <Link href={hero.cta1Url} className="btn-black">{hero.cta1Text}</Link>
              <Link href={hero.cta2Url} className="btn-underline">{hero.cta2Text}</Link>
            </div>
          </div>
        </div>
        <div className="hero-image-side">
          <img src={hero.heroImage} alt="BASE Editorial" className="hero-img" />
        </div>
      </section>

      {/* Premium Marquee */}
      <div className="premium-marquee">
        <div className="marquee-inner">
          {[...marquee.items, ...marquee.items, ...marquee.items].map((item: string, i: number) => (
            <span key={i} className="marquee-phrase">{item}</span>
          ))}
        </div>
      </div>

      {/* Editorial Split (Brand Vision) */}
      <section className="editorial-split">
        <div className="edit-img-pane reveal"></div>
        <div className="edit-text-pane">
          <div className="edit-label reveal delay-1">{editorial.sectionLabel}</div>
          <h2 className="edit-title reveal delay-2">
            {editorial.titleLine1} <br/> <i>{editorial.titleBold}</i>
          </h2>
          <p className="edit-desc reveal delay-3">{editorial.description}</p>
          
          <div className="curated-category-grid reveal delay-3">
            {(editorial.categories || []).map((cat: string, i: number) => (
              <Link key={i} href="/marketplace" className="curated-item">
                <span className="curated-item-name">{cat}</span>
                <span>+</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Essentials */}
      <section className="essential-section">
        <div className="essential-header reveal">
          <div>
            <div className="hero-tag">Marketplace</div>
            <h2 className="essential-title">Colección<br/>Esencial.</h2>
          </div>
          <Link href="/marketplace" className="btn-underline">Ver Todo el Marketplace</Link>
        </div>
        
        <div 
          className="premium-products-slider" 
          ref={sliderRef}
          onMouseDown={(e) => {
            isDown.current = true;
            if (sliderRef.current) {
              sliderRef.current.classList.add('active');
              startX.current = e.pageX - sliderRef.current.offsetLeft;
              scrollLeft.current = sliderRef.current.scrollLeft;
            }
          }}
          onMouseLeave={() => {
            isDown.current = false;
            if (sliderRef.current) sliderRef.current.classList.remove('active');
          }}
          onMouseUp={() => {
            isDown.current = false;
            if (sliderRef.current) sliderRef.current.classList.remove('active');
          }}
          onMouseMove={(e) => {
            if (!isDown.current) return;
            e.preventDefault();
            if (sliderRef.current) {
              const x = e.pageX - sliderRef.current.offsetLeft;
              const walk = (x - startX.current) * 1.5; // Scroll speed multiplier
              sliderRef.current.scrollLeft = scrollLeft.current - walk;
            }
          }}
        >
          {/* Duplicamos los productos para que el auto-scroll pueda parecer infinito suave, o simplemente listamos */}
          {[...products, ...products].map((product, i) => (
            <div key={`${product.id}-${i}`} className={`slider-item reveal ${i % 3 === 1 ? 'delay-1' : i % 3 === 2 ? 'delay-2' : ''}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Values Banner */}
      <section className="values-banner">
        <div className="reveal">
          <h2 className="values-banner-title">{values.titleLine1} <br/><i>{values.titleBold}</i></h2>
        </div>
        <div className="values-grid">
          {(values.items || []).map((val: any, i: number) => (
            <div key={i} className={`value-card reveal delay-${i+1}`}>
              <div className="value-num">{val.number}</div>
              <h3 className="value-title">{val.title}</h3>
              <p className="value-desc">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Minimal CTA */}
      <section className="minimal-cta">
        <div className="reveal">
          <h2 className="cta-big-text">{cta.titleLine1} <br/><i>{cta.titleBold}</i></h2>
          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <Link href={cta.btn1Url} className="btn-black">{cta.btn1Text}</Link>
            <Link href={cta.btn2Url} className="btn-underline">{cta.btn2Text}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
