'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

interface Order {
  id: number;
  status: string;
  total: number | string;
  created_at: string;
  user?: { name: string; email: string };
  items_count?: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending:   '#fef9c3',
  processing:'#dbeafe',
  shipped:   '#d1fae5',
  delivered: '#dcfce7',
  cancelled: '#fee2e2',
};

const STATUS_TEXT: Record<string, string> = {
  pending:    'Pendiente',
  processing: 'Procesando',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

export default function PedidosAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<any>(API.ORDERS);
      let list: Order[] = [];
      if (Array.isArray(res)) list = res;
      else if (res?.data?.data) list = res.data.data;
      else if (res?.data) list = Array.isArray(res.data) ? res.data : [];
      setOrders(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar pedidos. Asegúrate de estar autenticado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const statuses = ['all', ...Array.from(new Set(orders.map(o => o.status)))];
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const fmt = (date: string) => new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    revenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
  };

  return (
    <>
      <style jsx>{`
        .header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
        .title { font-size:1.3rem; font-weight:700; letter-spacing:-.02em; }
        .subtitle { font-size:.75rem; color:#999; margin-top:.2rem; }
        .btn { background:#000; color:#fff; padding:.7rem 1.5rem; font-size:.72rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; border:none; cursor:pointer; }
        .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:1.2rem; margin-bottom:2rem; }
        .stat-card { background:#fff; border:1px solid #e8e8e8; padding:1.2rem 1.5rem; }
        .stat-value { font-size:1.8rem; font-weight:700; letter-spacing:-.03em; }
        .stat-label { font-size:.68rem; color:#999; text-transform:uppercase; letter-spacing:.1rem; margin-top:.2rem; }
        .filter-bar { display:flex; gap:.5rem; margin-bottom:1.5rem; flex-wrap:wrap; }
        .filter-btn { padding:.4rem 1rem; font-size:.7rem; font-weight:600; letter-spacing:.05rem; text-transform:uppercase; background:#fff; border:1px solid #e0e0e0; cursor:pointer; font-family:inherit; }
        .filter-btn.active { background:#000; color:#fff; border-color:#000; }
        .table-wrap { background:#fff; border:1px solid #e8e8e8; }
        .table { width:100%; border-collapse:collapse; }
        .table th { background:#fafafa; padding:.75rem 1rem; text-align:left; font-size:.65rem; font-weight:700; letter-spacing:.12rem; text-transform:uppercase; color:#999; border-bottom:1px solid #e8e8e8; }
        .table td { padding:.85rem 1rem; font-size:.82rem; border-bottom:1px solid #f0f0f0; vertical-align:middle; }
        .table tr:last-child td { border-bottom:none; }
        .table tr:hover td { background:#fafafa; }
        .status-pill { padding:.25rem .7rem; font-size:.65rem; font-weight:700; letter-spacing:.05rem; border-radius:2px; display:inline-block; }
        .state-center { display:flex; align-items:center; justify-content:center; height:40vh; color:#999; font-size:.85rem; }
      `}</style>

      <div className="header">
        <div>
          <div className="title">Pedidos</div>
          <div className="subtitle">API de Órdenes · {orders.length} pedidos</div>
        </div>
        <button className="btn" onClick={load}>↻ Recargar</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Pedidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pendientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">${stats.revenue.toLocaleString()}</div>
          <div className="stat-label">Ingresos Totales</div>
        </div>
      </div>

      <div className="filter-bar">
        {statuses.map(s => (
          <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'Todos' : STATUS_TEXT[s] ?? s}
          </button>
        ))}
      </div>

      {loading && <div className="state-center">Cargando pedidos...</div>}
      {error && <div className="state-center" style={{ color: '#ef4444', flexDirection: 'column' }}><span>⚠ {error}</span></div>}

      {!loading && !error && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Orden #</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><strong>#{o.id}</strong></td>
                  <td>
                    <div>{o.user?.name ?? 'Usuario'}</div>
                    <div style={{ fontSize: '.7rem', color: '#999' }}>{o.user?.email ?? ''}</div>
                  </td>
                  <td><strong>${Number(o.total).toLocaleString()}</strong></td>
                  <td>
                    <span
                      className="status-pill"
                      style={{ background: STATUS_COLORS[o.status] ?? '#f3f4f6', color: '#111' }}
                    >
                      {STATUS_TEXT[o.status] ?? o.status}
                    </span>
                  </td>
                  <td>{o.created_at ? fmt(o.created_at) : '—'}</td>
                  <td>{o.items_count ?? '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>Sin pedidos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
