'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/admin/contenido', label: 'Contenido del Sitio', icon: '✦' },
  { href: '/admin/productos', label: 'Productos', icon: '◈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = localStorage.getItem('base_admin_auth') === 'true';
    if (!ok && pathname !== '/admin') {
      router.replace('/admin');
    } else {
      setAuthed(ok || pathname === '/admin');
    }
  }, [pathname, router]);

  if (authed === null) return null;

  if (pathname === '/admin') return <>{children}</>;

  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif; background: #f7f7f7; }

        .admin-shell {
          display: block;   /* Changed from grid to prevent column squishing */
          min-height: 100vh;
        }

        .admin-sidebar {
          background: #000;
          color: #fff;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0;
          width: 240px;
          height: 100vh;
          overflow-y: auto;
          z-index: 100;
        }

        .admin-sidebar-header {
          padding: 2rem 1.8rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .admin-sidebar-logo {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.4rem;
          color: #fff;
          text-decoration: none;
          display: block;
          margin-bottom: 0.3rem;
        }

        .admin-sidebar-badge {
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .admin-nav {
          padding: 1.5rem 0;
          flex: 1;
        }

        .admin-nav-label {
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 0 1.8rem;
          margin-bottom: 0.8rem;
        }

        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.75rem 1.8rem;
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 2px solid transparent;
        }

        .admin-nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .admin-nav-link.active {
          color: #fff;
          border-left-color: #fff;
          background: rgba(255,255,255,0.07);
        }

        .admin-nav-icon {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .admin-sidebar-footer {
          padding: 1.5rem 1.8rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .admin-sidebar-link-sm {
          font-size: 0.68rem;
          font-weight: 400;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color 0.2s;
        }

        .admin-sidebar-link-sm:hover { color: #fff; }

        .admin-logout-btn {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1rem;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-logout-btn:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.5);
        }

        .admin-main {
          margin-left: 240px;
          min-height: 100vh;
        }

        .admin-topbar {
          background: #fff;
          border-bottom: 1px solid #e8e8e8;
          padding: 0 2.5rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .admin-topbar-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #000;
          letter-spacing: 0.02em;
        }

        .admin-topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.7rem;
          color: #A9A9A9;
        }

        .admin-content {
          padding: 2.5rem;
        }
      `}</style>

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <Link href="/" className="admin-sidebar-logo">BASE</Link>
            <div className="admin-sidebar-badge">Panel de Administración</div>
          </div>

          <nav className="admin-nav">
            <div className="admin-nav-label">Gestión</div>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link ${pathname.startsWith(item.href) ? 'active' : ''}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <Link href="/" className="admin-sidebar-link-sm">← Ver sitio público</Link>
            <button
              className="admin-logout-btn"
              onClick={() => {
                localStorage.removeItem('base_admin_auth');
                router.replace('/admin');
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-topbar">
            <span className="admin-topbar-title">
              {navItems.find(i => pathname.startsWith(i.href))?.label ?? 'Admin'}
            </span>
            <div className="admin-topbar-right">
              <span>BASE Admin</span>
            </div>
          </div>
          <div className="admin-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
