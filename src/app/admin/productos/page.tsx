'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/api/types';

const EMPTY_PRODUCT: Partial<Product> = {
  title: '',
  description: '',
  price: 0,
  currency: 'USD',
  condition: 'new',
  brand: '',
  category: 'moda',
  subcategory: '',
  images: [''],
  stock: 1,
  sku: '',
  attributes: {},
};

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Partial<Product>>(EMPTY_PRODUCT);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      showToast('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const openCreate = () => {
    setEditing({ ...EMPTY_PRODUCT, images: [''] });
    setIsNew(true);
    setView('form');
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p, images: p.images?.length ? p.images : [''] });
    setIsNew(false);
    setView('form');
  };

  const handleSave = async () => {
    if (!editing.title?.trim()) return showToast('El título es requerido');
    if (!editing.price || editing.price <= 0) return showToast('El precio debe ser mayor a 0');
    setSaving(true);
    try {
      const body = {
        ...editing,
        images: (editing.images ?? []).filter(Boolean),
        price: Number(editing.price),
        stock: Number(editing.stock),
      };

      const res = isNew
        ? await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch(`/api/products/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

      if (!res.ok) throw new Error();
      showToast(isNew ? 'Producto creado ✓' : 'Producto actualizado ✓');
      await loadProducts();
      setView('list');
    } catch {
      showToast('Error guardando producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      showToast('Producto eliminado');
      await loadProducts();
    } catch {
      showToast('Error eliminando producto');
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  const filtered = products.filter(p =>
    search === '' ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const set = (key: keyof Product, value: unknown) => setEditing(prev => ({ ...prev, [key]: value }));

  return (
    <>
      <style jsx global>{`
        .prod-page { max-width: 1100px; }

        .prod-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .prod-title { font-size: 1.3rem; font-weight: 700; color: #000; letter-spacing: -0.02em; }
        .prod-subtitle { font-size: 0.75rem; font-weight: 300; color: #A9A9A9; margin-top: 0.2rem; }

        .btn-primary-sm {
          padding: 0.7rem 1.6rem;
          background: #000;
          color: #fff;
          border: none;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1rem;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .btn-primary-sm:hover { background: #333; }
        .btn-primary-sm:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-ghost-sm {
          padding: 0.7rem 1.4rem;
          background: none;
          color: #666;
          border: 1px solid #E8E8E8;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08rem;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .btn-ghost-sm:hover { border-color: #000; color: #000; }

        .btn-danger-sm {
          padding: 0.5rem 0.9rem;
          background: none;
          color: #ef4444;
          border: 1px solid #fecaca;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.06rem;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .btn-danger-sm:hover { background: #fef2f2; }
        .btn-danger-sm:disabled { opacity: 0.4; cursor: not-allowed; }

        .search-bar-wrap {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          max-width: 380px;
          padding: 0.65rem 0.9rem;
          border: 1px solid #E8E8E8;
          background: #fff;
          font-size: 0.82rem;
          font-family: inherit;
          outline: none;
          color: #000;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: #000; }

        .prod-table-wrap {
          background: #fff;
          border: 1px solid #E8E8E8;
          overflow-x: auto;
        }

        .prod-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.78rem;
        }

        .prod-table th {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          color: #A9A9A9;
          padding: 0.9rem 1.2rem;
          border-bottom: 1px solid #E8E8E8;
          text-align: left;
          white-space: nowrap;
        }

        .prod-table td {
          padding: 0.85rem 1.2rem;
          border-bottom: 1px solid #f5f5f5;
          color: #333;
          vertical-align: middle;
        }

        .prod-table tr:last-child td { border-bottom: none; }
        .prod-table tr:hover td { background: #fafafa; }

        .prod-thumb {
          width: 44px;
          height: 44px;
          object-fit: cover;
          background: #f0f0f0;
          display: block;
          flex-shrink: 0;
        }

        .prod-thumb-placeholder {
          width: 44px;
          height: 44px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #ccc;
          flex-shrink: 0;
        }

        .prod-name-cell { display: flex; align-items: center; gap: 0.8rem; }
        .prod-name { font-weight: 500; color: #000; }
        .prod-brand { font-size: 0.67rem; color: #A9A9A9; margin-top: 0.1rem; }

        .badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.1rem;
          text-transform: uppercase;
        }
        .badge-moda { background: #f0f0ff; color: #5050c8; }
        .badge-accesorios { background: #fff0e8; color: #c86020; }
        .badge-new { background: #f0fdf4; color: #16a34a; }
        .badge-used { background: #fef3c7; color: #92400e; }

        .inline-actions { display: flex; gap: 0.5rem; align-items: center; }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #A9A9A9;
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-state-icon { font-size: 2.5rem; }

        /* ── Form ── */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-card {
          background: #fff;
          border: 1px solid #E8E8E8;
          padding: 1.8rem;
          margin-bottom: 1.2rem;
        }
        .form-section-title {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 1.2rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .form-field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.9rem; }
        .form-label {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.13rem;
          text-transform: uppercase;
          color: #888;
        }
        .form-input {
          padding: 0.62rem 0.8rem;
          border: 1px solid #E8E8E8;
          background: #f7f7f7;
          font-size: 0.82rem;
          font-family: inherit;
          color: #000;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }
        .form-input:focus { border-color: #000; background: #fff; }
        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23888'%3e%3cpath d='M4 6l4 4 4-4'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          background-size: 12px;
          cursor: pointer;
        }
        .form-textarea { resize: vertical; min-height: 80px; }

        .img-list { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 0.8rem; }
        .img-row { display: flex; gap: 0.5rem; align-items: flex-start; }
        .img-row input { flex: 1; }
        .img-preview-sm {
          width: 52px;
          height: 52px;
          object-fit: cover;
          background: #f0f0f0;
          border: 1px solid #E8E8E8;
          flex-shrink: 0;
        }

        .form-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem 0 0;
          border-top: 1px solid #E8E8E8;
          margin-top: 0.5rem;
        }

        .toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #000;
          color: #fff;
          padding: 0.9rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          z-index: 9999;
          animation: slideInToast 0.3s ease;
        }

        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 9000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .confirm-dialog {
          background: #fff;
          padding: 2.5rem;
          max-width: 380px;
          width: 90%;
        }

        .confirm-title {
          font-size: 1rem;
          font-weight: 700;
          color: #000;
          margin-bottom: 0.6rem;
        }

        .confirm-text {
          font-size: 0.78rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .confirm-actions { display: flex; gap: 0.8rem; justify-content: flex-end; }

        .prod-count-badge {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1rem;
          text-transform: uppercase;
          color: #A9A9A9;
          margin-bottom: 1rem;
        }

        @media (max-width: 700px) {
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {toast && <div className="toast">{toast}</div>}

      {confirmDelete && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <div className="confirm-title">¿Eliminar producto?</div>
            <div className="confirm-text">Esta acción no se puede deshacer. El producto será removido del marketplace permanentemente.</div>
            <div className="confirm-actions">
              <button className="btn-ghost-sm" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger-sm" onClick={() => handleDelete(confirmDelete)} disabled={!!deleting}>
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="prod-page">
        {/* ── LIST VIEW ── */}
        {view === 'list' && (
          <>
            <div className="prod-topbar">
              <div>
                <div className="prod-title">Productos</div>
                <div className="prod-subtitle">Crea, edita y elimina productos del marketplace.</div>
              </div>
              <button className="btn-primary-sm" onClick={openCreate}>+ Nuevo Producto</button>
            </div>

            <div className="search-bar-wrap">
              <input
                className="search-input"
                placeholder="Buscar por nombre, categoría o marca..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="empty-state">
                <div style={{ width: 24, height: 24, border: '2px solid #E8E8E8', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <span>Cargando productos...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◈</div>
                <div>{search ? 'No hay productos que coincidan con la búsqueda.' : 'No hay productos todavía.'}</div>
                {!search && <button className="btn-primary-sm" onClick={openCreate}>+ Crear primer producto</button>}
              </div>
            ) : (
              <>
                <div className="prod-count-badge">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</div>
                <div className="prod-table-wrap">
                  <table className="prod-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="prod-name-cell">
                              {p.images?.[0] ? (
                                <img className="prod-thumb" src={p.images[0]} alt={p.title} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                              ) : (
                                <div className="prod-thumb-placeholder">◈</div>
                              )}
                              <div>
                                <div className="prod-name">{p.title}</div>
                                <div className="prod-brand">{p.brand} · SKU: {p.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge badge-${p.category === 'moda' ? 'moda' : 'accesorios'}`}>{p.category}</span>
                          </td>
                          <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                          <td style={{ color: p.stock === 0 ? '#ef4444' : p.stock < 5 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>
                            {p.stock}
                          </td>
                          <td>
                            <span className={`badge badge-${p.condition}`}>
                              {p.condition === 'new' ? 'Nuevo' : p.condition === 'used' ? 'Usado' : 'Reacondicionado'}
                            </span>
                          </td>
                          <td>
                            <div className="inline-actions">
                              <button className="btn-ghost-sm" onClick={() => openEdit(p)}>Editar</button>
                              <button className="btn-danger-sm" onClick={() => setConfirmDelete(p.id)} disabled={deleting === p.id}>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {/* ── FORM VIEW ── */}
        {view === 'form' && (
          <>
            <div className="prod-topbar">
              <div>
                <div className="prod-title">{isNew ? 'Nuevo Producto' : 'Editar Producto'}</div>
                <div className="prod-subtitle">{isNew ? 'Completa los datos para crear un nuevo producto.' : `Editando: ${editing.title}`}</div>
              </div>
              <button className="btn-ghost-sm" onClick={() => setView('list')}>← Volver</button>
            </div>

            <div className="form-grid">
              {/* Left column */}
              <div>
                <div className="form-card">
                  <div className="form-section-title">Información básica</div>
                  <div className="form-field">
                    <label className="form-label">Título *</label>
                    <input className="form-input" value={editing.title ?? ''} onChange={e => set('title', e.target.value)} placeholder="Ej: Jacket Oversize Noir" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-input form-textarea" value={editing.description ?? ''} onChange={e => set('description', e.target.value)} placeholder="Descripción del producto..." />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Marca</label>
                    <input className="form-input" value={editing.brand ?? ''} onChange={e => set('brand', e.target.value)} placeholder="BASE Original" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">SKU</label>
                    <input className="form-input" value={editing.sku ?? ''} onChange={e => set('sku', e.target.value)} placeholder="JKT-001" />
                  </div>
                </div>

                <div className="form-card">
                  <div className="form-section-title">Precio y Stock</div>
                  <div className="form-field">
                    <label className="form-label">Precio (USD) *</label>
                    <input className="form-input" type="number" min="0" step="0.01" value={editing.price ?? 0} onChange={e => set('price', parseFloat(e.target.value))} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Precio original (opcional, para mostrar descuento)</label>
                    <input className="form-input" type="number" min="0" step="0.01" value={editing.originalPrice ?? ''} onChange={e => set('originalPrice', parseFloat(e.target.value) || undefined)} placeholder="0.00" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Stock disponible</label>
                    <input className="form-input" type="number" min="0" value={editing.stock ?? 0} onChange={e => set('stock', parseInt(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div>
                <div className="form-card">
                  <div className="form-section-title">Categorización</div>
                  <div className="form-field">
                    <label className="form-label">Categoría</label>
                    <select className="form-input form-select" value={editing.category ?? 'moda'} onChange={e => set('category', e.target.value)}>
                      <option value="moda">Moda</option>
                      <option value="accesorios">Accesorios</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Subcategoría</label>
                    <input className="form-input" value={editing.subcategory ?? ''} onChange={e => set('subcategory', e.target.value)} placeholder="chaquetas, bolsos, gorras..." />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Condición</label>
                    <select className="form-input form-select" value={editing.condition ?? 'new'} onChange={e => set('condition', e.target.value as 'new' | 'used' | 'refurbished')}>
                      <option value="new">Nuevo</option>
                      <option value="used">Usado</option>
                      <option value="refurbished">Reacondicionado</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Moneda</label>
                    <select className="form-input form-select" value={editing.currency ?? 'USD'} onChange={e => set('currency', e.target.value)}>
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="form-card">
                  <div className="form-section-title">Imágenes (URLs)</div>
                  <div className="img-list">
                    {(editing.images ?? ['']).map((url, i) => (
                      <div key={i}>
                        <div className="img-row">
                          <input
                            className="form-input"
                            type="url"
                            value={url}
                            placeholder="https://images.unsplash.com/..."
                            onChange={e => {
                              const imgs = [...(editing.images ?? [])];
                              imgs[i] = e.target.value;
                              set('images', imgs);
                            }}
                          />
                          {(editing.images ?? []).length > 1 && (
                            <button
                              className="btn-ghost-sm"
                              style={{ padding: '0.5rem', minWidth: 36 }}
                              onClick={() => set('images', (editing.images ?? []).filter((_, idx) => idx !== i))}
                            >×</button>
                          )}
                        </div>
                        {url && (
                          <img
                            className="img-preview-sm"
                            src={url}
                            alt="preview"
                            style={{ marginTop: '0.4rem', width: '100%', height: 100 }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn-ghost-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => set('images', [...(editing.images ?? []), ''])}
                  >
                    + Agregar imagen
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-ghost-sm" onClick={() => setView('list')}>Cancelar</button>
              <button className="btn-primary-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
