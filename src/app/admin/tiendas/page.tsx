'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

interface Store {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  products_count?: number;
  is_active?: boolean;
  owner?: { name: string; email: string };
}

export default function TiendasAdminPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Store | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ data: Store[] } | Store[]>(API.STORES);
      const list = Array.isArray(data) ? data : (data as { data: Store[] }).data ?? [];
      setStores(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar tiendas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const data = await apiFetch<{ data: Store } | Store>(API.STORE(id));
      const store = (data as { data: Store }).data ?? (data as Store);
      setSelected(store);
    } catch {
      // fallback to listed data
      setSelected(stores.find(s => s.id === id) ?? null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
        .title { font-size:1.3rem; font-weight:700; letter-spacing:-.02em; }
        .subtitle { font-size:.75rem; color:#999; margin-top:.2rem; }
        .btn { background:#000; color:#fff; padding:.7rem 1.5rem; font-size:.72rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; border:none; cursor:pointer; }
        .layout { display:grid; grid-template-columns:1fr 340px; gap:1.5rem; }
        .table-wrap { background:#fff; border:1px solid #e8e8e8; }
        .table { width:100%; border-collapse:collapse; }
        .table th { background:#fafafa; padding:.75rem 1rem; text-align:left; font-size:.65rem; font-weight:700; letter-spacing:.12rem; text-transform:uppercase; color:#999; border-bottom:1px solid #e8e8e8; }
        .table td { padding:.85rem 1rem; font-size:.82rem; border-bottom:1px solid #f0f0f0; vertical-align:middle; cursor:pointer; }
        .table tr:hover td { background:#f7f7f7; }
        .table tr.active td { background:#000; color:#fff; }
        .detail-panel { background:#fff; border:1px solid #e8e8e8; padding:1.5rem; }
        .det-logo { width:64px; height:64px; object-fit:cover; background:#f0f0f0; margin-bottom:1rem; }
        .det-name { font-size:1.1rem; font-weight:700; margin-bottom:.3rem; }
        .det-slug { font-size:.72rem; color:#999; font-family:monospace; margin-bottom:1rem; }
        .det-row { display:flex; flex-direction:column; gap:.15rem; margin-bottom:.75rem; }
        .det-label { font-size:.6rem; font-weight:700; letter-spacing:.12rem; text-transform:uppercase; color:#999; }
        .det-value { font-size:.82rem; }
        .badge { display:inline-block; padding:.25rem .6rem; font-size:.65rem; font-weight:700; }
        .badge-on { background:#dcfce7; color:#166534; }
        .badge-off { background:#f3f4f6; color:#6b7280; }
        .state-center { display:flex; align-items:center; justify-content:center; height:40vh; color:#999; font-size:.85rem; }
        .empty-detail { display:flex; align-items:center; justify-content:center; height:100%; color:#ccc; font-size:.82rem; flex-direction:column; gap:.5rem; }
        @media (max-width:800px) { .layout { grid-template-columns:1fr; } }
      `}</style>

      <div className="header">
        <div>
          <div className="title">Tiendas y Vendedores</div>
          <div className="subtitle">API · {stores.length} tiendas</div>
        </div>
        <button className="btn" onClick={load}>↻ Recargar</button>
      </div>

      {loading && <div className="state-center">Cargando tiendas...</div>}
      {error && <div className="state-center" style={{ color: '#ef4444' }}>{error}</div>}

      {!loading && !error && (
        <div className="layout">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Tienda</th>
                  <th>Slug</th>
                  <th>Productos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(s => (
                  <tr
                    key={s.id}
                    className={selected?.id === s.id ? 'active' : ''}
                    onClick={() => loadDetail(s.id)}
                  >
                    <td><strong>{s.name}</strong></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '.72rem' }}>/{s.slug ?? s.id}</td>
                    <td>{s.products_count ?? '—'}</td>
                    <td>
                      <span className={`badge ${s.is_active !== false ? 'badge-on' : 'badge-off'}`}>
                        {s.is_active !== false ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>Sin tiendas</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="detail-panel">
            {detailLoading && <div className="empty-detail">Cargando...</div>}
            {!detailLoading && !selected && (
              <div className="empty-detail">
                <span style={{ fontSize: '1.5rem' }}>◈</span>
                <span>Selecciona una tienda para ver el detalle</span>
              </div>
            )}
            {!detailLoading && selected && (
              <>
                {selected.logo && <img src={selected.logo} alt={selected.name} className="det-logo" />}
                <div className="det-name">{selected.name}</div>
                <div className="det-slug">/{selected.slug ?? selected.id}</div>

                <div className="det-row">
                  <div className="det-label">ID</div>
                  <div className="det-value">#{selected.id}</div>
                </div>
                {selected.description && (
                  <div className="det-row">
                    <div className="det-label">Descripción</div>
                    <div className="det-value">{selected.description}</div>
                  </div>
                )}
                {selected.owner && (
                  <div className="det-row">
                    <div className="det-label">Propietario</div>
                    <div className="det-value">{selected.owner.name}<br /><span style={{ color: '#999', fontSize: '.75rem' }}>{selected.owner.email}</span></div>
                  </div>
                )}
                <div className="det-row">
                  <div className="det-label">Estado</div>
                  <div className="det-value">
                    <span className={`badge ${selected.is_active !== false ? 'badge-on' : 'badge-off'}`}>
                      {selected.is_active !== false ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
                {selected.products_count !== undefined && (
                  <div className="det-row">
                    <div className="det-label">Productos</div>
                    <div className="det-value">{selected.products_count}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
