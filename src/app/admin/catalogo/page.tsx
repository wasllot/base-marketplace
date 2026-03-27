'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

interface ApiProduct {
  id: number;
  name: string;
  price: number | string;
  category?: { name: string };
  image?: string;
  images?: { url: string }[];
  stock?: number;
  is_featured?: boolean;
  slug?: string;
}

export default function CatalogoAdminPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ data: ApiProduct[] } | ApiProduct[]>(API.PRODUCTS);
      const list = Array.isArray(data) ? data : (data as { data: ApiProduct[] }).data ?? [];
      setProducts(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    setDeleting(id);
    try {
      await apiFetch(API.PRODUCT(id), { method: 'DELETE' });
      setProducts(p => p.filter(x => x.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'No se pudo eliminar');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getImg = (p: ApiProduct) =>
    p.image ?? p.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&q=60';

  return (
    <>
      <style jsx>{`
        .cat-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
        .cat-title { font-size:1.3rem; font-weight:700; letter-spacing:-0.02em; }
        .cat-subtitle { font-size:.75rem; color:#999; margin-top:.2rem; }
        .cat-actions { display:flex; gap:.8rem; align-items:center; }
        .search-box { padding:.6rem 1rem; border:1px solid #e0e0e0; background:#fff; font-size:.82rem; font-family:inherit; outline:none; width:220px; }
        .search-box:focus { border-color:#000; }
        .btn-primary { background:#000; color:#fff; padding:.7rem 1.5rem; font-size:.72rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; border:none; cursor:pointer; text-decoration:none; display:inline-block; }
        .btn-primary:hover { background:#333; }
        .table-wrap { background:#fff; border:1px solid #e8e8e8; overflow:hidden; }
        .table { width:100%; border-collapse:collapse; }
        .table th { background:#fafafa; padding:.75rem 1rem; text-align:left; font-size:.65rem; font-weight:700; letter-spacing:.12rem; text-transform:uppercase; color:#999; border-bottom:1px solid #e8e8e8; }
        .table td { padding:.85rem 1rem; font-size:.82rem; border-bottom:1px solid #f0f0f0; vertical-align:middle; }
        .table tr:last-child td { border-bottom:none; }
        .table tr:hover td { background:#fafafa; }
        .prod-thumb { width:44px; height:44px; object-fit:cover; background:#f0f0f0; }
        .prod-name { font-weight:500; }
        .prod-cat { font-size:.72rem; color:#999; margin-top:2px; }
        .badge { display:inline-block; padding:.2rem .55rem; font-size:.62rem; font-weight:700; letter-spacing:.05rem; }
        .badge-green { background:#dcfce7; color:#166534; }
        .badge-gray { background:#f3f4f6; color:#6b7280; }
        .action-btn { background:none; border:1px solid #e0e0e0; padding:.4rem .8rem; font-size:.7rem; cursor:pointer; font-family:inherit; font-weight:600; letter-spacing:.05rem; transition:all .2s; }
        .action-btn:hover { border-color:#000; }
        .action-btn.del:hover { border-color:#ef4444; color:#ef4444; }
        .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:1.2rem; margin-bottom:2rem; }
        .stat-card { background:#fff; border:1px solid #e8e8e8; padding:1.2rem 1.5rem; }
        .stat-value { font-size:1.8rem; font-weight:700; letter-spacing:-0.03em; }
        .stat-label { font-size:.68rem; color:#999; text-transform:uppercase; letter-spacing:.1rem; margin-top:.2rem; }
        .state-center { display:flex; align-items:center; justify-content:center; height:40vh; color:#999; font-size:.85rem; flex-direction:column; gap:.5rem; }
      `}</style>

      <div className="cat-header">
        <div>
          <div className="cat-title">Catálogo de Productos</div>
          <div className="cat-subtitle">Conectado a la API · {products.length} productos</div>
        </div>
        <div className="cat-actions">
          <input className="search-box" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-primary" onClick={load}>↻ Recargar</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Total Productos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{products.filter(p => p.is_featured).length}</div>
          <div className="stat-label">Destacados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{[...new Set(products.map(p => p.category?.name).filter(Boolean))].length}</div>
          <div className="stat-label">Categorías</div>
        </div>
      </div>

      {loading && <div className="state-center"><div>Cargando productos...</div></div>}
      {error && <div className="state-center" style={{ color: '#ef4444' }}>{error}</div>}

      {!loading && !error && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <img src={getImg(p)} alt={p.name} className="prod-thumb" />
                      <div>
                        <div className="prod-name">{p.name}</div>
                        <div className="prod-cat">ID #{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.category?.name ?? '—'}</td>
                  <td>${Number(p.price).toLocaleString()}</td>
                  <td>{p.stock ?? '—'}</td>
                  <td>
                    <span className={`badge ${p.is_featured ? 'badge-green' : 'badge-gray'}`}>
                      {p.is_featured ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <Link href={`https://api.reinaldotineo.online/api/v1/products/${p.id}`} target="_blank">
                        <button className="action-btn">Ver</button>
                      </Link>
                      <button
                        className="action-btn del"
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                      >
                        {deleting === p.id ? '...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
