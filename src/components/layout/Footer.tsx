import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer className="footer-global">
        <div className="footer-top-global">
          <div>
            <div className="footer-brand-logo-global">BASE</div>
            <p className="footer-brand-tagline-global">Menos, pero con intención.<br /><br />E-commerce premium y desarrollo digital de alta calidad.</p>
          </div>
          <div>
            <div className="footer-col-title-global">Shop</div>
            <ul className="footer-links-global">
              <li><Link href="/marketplace">Moda</Link></li>
              <li><Link href="/marketplace">Accesorios</Link></li>
              <li><Link href="/marketplace">Todos los productos</Link></li>
              <li><Link href="/marketplace">Destacados</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title-global">Studio</div>
            <ul className="footer-links-global">
              <li><Link href="/studio/servicios">Servicios</Link></li>
              <li><Link href="/studio/servicios">Desarrollo Full Stack</Link></li>
              <li><Link href="/studio/servicios">Diseño UI/UX</Link></li>
              <li><Link href="/studio/servicios">Branding</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title-global">Soporte</div>
            <ul className="footer-links-global">
              <li><Link href="/dashboard">Mi cuenta</Link></li>
              <li><Link href="/carrito">Carrito</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom-global">
          <span className="footer-copy-global">© 2026 BASE. Todos los derechos reservados.</span>
          <ul className="footer-socials-global">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">TikTok</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </footer>
      <style jsx>{`
        .footer-global {
          background: #000000;
          padding: 5rem 5rem 3rem;
          color: #ffffff;
          width: 100%;
        }

        .footer-top-global {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 4rem;
          padding-bottom: 4rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .footer-brand-logo-global {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.4rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .footer-brand-tagline-global {
          font-size: 0.72rem;
          font-weight: 300;
          font-style: italic;
          color: #A9A9A9;
          line-height: 1.6;
          max-width: 220px;
        }

        .footer-col-title-global {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          color: #A9A9A9;
          margin-bottom: 1.8rem;
        }

        .footer-links-global { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; margin: 0; padding: 0; }
        
        .footer-links-global a {
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          transition: color 0.3s ease;
          letter-spacing: 0.03em;
        }

        .footer-links-global a:hover { color: #ffffff; }

        .footer-bottom-global {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2.5rem;
        }

        .footer-copy-global {
          font-size: 0.62rem;
          font-weight: 300;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }

        .footer-socials-global {
          display: flex;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-socials-global a {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.3);
          transition: color 0.3s ease;
        }

        .footer-socials-global a:hover { color: #ffffff; }

        @media (max-width: 1024px) {
          .footer-top-global { grid-template-columns: 1fr 1fr; gap: 3rem; }
          .footer-global { padding: 4rem 3rem 2rem; }
        }

        @media (max-width: 640px) {
          .footer-top-global { grid-template-columns: 1fr; gap: 2rem; }
          .footer-global { padding: 3rem 2rem 2rem; }
          .footer-bottom-global { flex-direction: column; gap: 1rem; align-items: flex-start; }
        }
      `}</style>
    </>
  );
}
