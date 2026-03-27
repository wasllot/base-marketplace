'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

interface Order {
  id: number;
  status: string;
  total: number | string;
  created_at: string;
  items_count?: number;
}

interface WishlistItem {
  id: number;
  product: { id: number; name: string; price: number; image?: string };
}

const STATUS_ES: Record<string, string> = {
  pending: 'Pendiente', processing: 'Procesando',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
};

export default function CuentaPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [tab, setTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/cuenta/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (tab === 'orders' && orders.length === 0) {
      setOrdersLoading(true);
      apiFetch<{ data: Order[] } | Order[]>(API.ORDERS)
        .then(d => setOrders(Array.isArray(d) ? d : (d as { data: Order[] }).data ?? []))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
    if (tab === 'wishlist' && wishlist.length === 0) {
      setWishlistLoading(true);
      apiFetch<{ data: WishlistItem[] } | WishlistItem[]>(API.WISHLIST)
        .then(d => setWishlist(Array.isArray(d) ? d : (d as { data: WishlistItem[] }).data ?? []))
        .catch(() => {})
        .finally(() => setWishlistLoading(false));
    }
  }, [tab, isAuthenticated, orders.length, wishlist.length]);

  const handleLogout = () => { logout(); router.push('/'); };

  if (isLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Cargando...</div>;
  if (!isAuthenticated) return null;

  return (
    <>
      <style jsx>{`
        .cuenta-wrap { max-width:960px; margin:6rem auto 4rem; padding:0 2rem; }
        .cuenta-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2.5rem; flex-wrap:wrap; gap:1rem; }
        .cuenta-title { font-size:1.8rem; font-weight:700; letter-spacing:-.03em; }
        .cuenta-subtitle { font-size:.8rem; color:#999; margin-top:.2rem; }
        .logout-btn { background:none; border:1px solid #e0e0e0; padding:.6rem 1.2rem; font-size:.7rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; cursor:pointer; font-family:inherit; }
        .logout-btn:hover { border-color:#000; }
        .tab-bar { display:flex; border-bottom:1px solid #e8e8e8; margin-bottom:2rem; }
        .tab-btn { padding:.75rem 1.5rem; font-size:.72rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; background:none; border:none; cursor:pointer; font-family:inherit; color:#999; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .2s; }
        .tab-btn.active { color:#000; border-bottom-color:#000; }
        /* Profile */
        .profile-card { background:#fff; border:1px solid #e8e8e8; padding:2.5rem; max-width:560px; }
        .avatar { width:60px; height:60px; background:#000; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; font-weight:700; margin-bottom:1.5rem; }
        .profile-name { font-size:1.3rem; font-weight:700; letter-spacing:-.02em; }
        .profile-email { color:#999; font-size:.85rem; margin-top:.2rem; }
        .profile-row { display:flex; flex-direction:column; gap:.3rem; margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid #f0f0f0; }
        .row-label { font-size:.62rem; font-weight:700; letter-spacing:.12rem; text-transform:uppercase; color:#bbb; }
        .row-value { font-size:.88rem; }
        /* Orders */
        .order-list { display:flex; flex-direction:column; gap:1rem; }
        .order-card { background:#fff; border:1px solid #e8e8e8; padding:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; }
        .order-id { font-weight:700; font-size:.95rem; }
        .order-date { font-size:.75rem; color:#999; margin-top:.15rem; }
        .order-total { font-size:1.1rem; font-weight:700; }
        .status-pill { padding:.25rem .7rem; font-size:.65rem; font-weight:700; }
        /* Wishlist */
        .wish-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; }
        .wish-card { background:#fff; border:1px solid #e8e8e8; padding:1rem; }
        .wish-img { width:100%; aspect-ratio:1; object-fit:cover; background:#f0f0f0; margin-bottom:.75rem; }
        .wish-name { font-size:.85rem; font-weight:500; }
        .wish-price { font-size:.85rem; color:#999; margin-top:.2rem; }
        .empty { padding:4rem 0; text-align:center; color:#ccc; font-size:.9rem; }
        .state-center { display:flex; align-items:center; justify-content:center; padding:4rem 0; color:#999; }
      `}</style>

      <div className="cuenta-wrap">
        <div className="cuenta-header">
          <div>
            <div className="cuenta-title">Mi Cuenta</div>
            <div className="cuenta-subtitle">{user?.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
        </div>

        <div className="tab-bar">
          {(['profile', 'orders', 'wishlist'] as const).map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'profile' ? 'Mi Perfil' : t === 'orders' ? 'Mis Pedidos' : 'Wishlist'}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="profile-card">
            <div className="avatar">{user?.name?.[0]?.toUpperCase() ?? '?'}</div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
            {user?.phone && (
              <div className="profile-row">
                <div className="row-label">Teléfono</div>
                <div className="row-value">{user.phone}</div>
              </div>
            )}
            <div className="profile-row">
              <div className="row-label">ID de cuenta</div>
              <div className="row-value" style={{ fontFamily: 'monospace' }}>#{user?.id}</div>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <>
            {ordersLoading && <div className="state-center">Cargando pedidos...</div>}
            {!ordersLoading && orders.length === 0 && <div className="empty">No tienes pedidos aún. <Link href="/marketplace">¡Explora el marketplace!</Link></div>}
            {!ordersLoading && orders.length > 0 && (
              <div className="order-list">
                {orders.map(o => (
                  <div key={o.id} className="order-card">
                    <div>
                      <div className="order-id">Pedido #{o.id}</div>
                      <div className="order-date">{o.created_at ? new Date(o.created_at).toLocaleDateString('es-AR') : ''}</div>
                    </div>
                    <div className="order-total">${Number(o.total).toLocaleString()}</div>
                    <span className="status-pill" style={{ background: '#f3f4f6', color: '#374151' }}>
                      {STATUS_ES[o.status] ?? o.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'wishlist' && (
          <>
            {wishlistLoading && <div className="state-center">Cargando wishlist...</div>}
            {!wishlistLoading && wishlist.length === 0 && <div className="empty">No tienes items en tu wishlist.</div>}
            {!wishlistLoading && wishlist.length > 0 && (
              <div className="wish-grid">
                {wishlist.map(item => (
                  <Link key={item.id} href={`/marketplace/producto/${item.product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="wish-card">
                      {item.product.image && <img src={item.product.image} alt={item.product.name} className="wish-img" />}
                      <div className="wish-name">{item.product.name}</div>
                      <div className="wish-price">${Number(item.product.price).toLocaleString()}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
