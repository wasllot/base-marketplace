'use client';

import { useEffect, useState } from 'react';
import { apiFetch, setToken } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';
import { useRouter } from 'next/navigation';

interface Store {
  id: number;
  name: string;
  store_name?: string;
  slug?: string;
  description?: string;
  logo?: string;
  products_count?: number;
  is_active?: boolean;
  status?: string;
  whatsapp?: string;
  contact_email?: string;
  categories?: any[];
  owner?: { name: string; email: string };
}

export default function TiendasAdminPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Store | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch<any>(API.ADMIN_STORES);
      let list: Store[] = [];
      if (Array.isArray(res)) list = res;
      else if (res?.data?.data) list = res.data.data;
      else if (res?.data) list = Array.isArray(res.data) ? res.data : [];
      setStores(list);
    } catch (e: any) {
      setError(e.message || 'Error al cargar tiendas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const res = await apiFetch<any>(API.ADMIN_STORE(id));
      const store = res?.data ?? res;
      setSelected(store);
    } catch {
      setSelected(stores.find(s => s.id === id) ?? null);
    } finally {
      setDetailLoading(false);
    }
  };

  const impersonate = async (id: number) => {
    if (!confirm('¿Deseas entrar al panel de control de esta tienda? Esto cambiará tu sesión temporalmente.')) return;
    try {
      const res = await apiFetch<{ access_token: string }>(API.ADMIN_STORE_IMPRS(id), { method: 'POST' });
      // Backup admin token
      const currentToken = localStorage.getItem('base_api_token');
      if (currentToken) localStorage.setItem('base_admin_token_backup', currentToken);
      
      // Inject seller token
      setToken(res.access_token);
      localStorage.setItem('base_user_role', 'seller');
      localStorage.setItem('base_user_name', selected?.name || selected?.store_name || 'Vendedor');
      
      router.replace('/admin/mi-tienda');
    } catch (e: any) {
      alert('Error impersonando: ' + e.message);
    }
  };

  const deleteStore = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta tienda PERMANENTEMENTE?')) return;
    try {
      await apiFetch(API.ADMIN_STORE(id), { method: 'DELETE' });
      setSelected(null);
      load();
    } catch (e: any) {
      alert('Error eliminando: ' + e.message);
    }
  };

  const openCreate = () => {
    setModalMode('create');
    setFormData({});
    setIsModalOpen(true);
  };

  const openEdit = (s: Store) => {
    setModalMode('edit');
    setFormData({
      store_name: s.name || s.store_name,
      description: s.description || '',
      whatsapp: s.whatsapp || '',
      contact_email: s.contact_email || s.owner?.email || '',
    });
    setIsModalOpen(true);
  };

  const saveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === 'create') {
        await apiFetch(API.ADMIN_STORES, {
          method: 'POST',
          body: formData
        });
      } else {
        await apiFetch(API.ADMIN_STORE(selected!.id), {
          method: 'PUT',
          body: formData
        });
      }
      setIsModalOpen(false);
      if (modalMode === 'edit' && selected) loadDetail(selected.id);
      load();
    } catch (err: any) {
      alert('Error guardando: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
        .title { font-size:1.3rem; font-weight:700; letter-spacing:-.02em; }
        .subtitle { font-size:.75rem; color:#999; margin-top:.2rem; }
        .btn { background:#000; color:#fff; padding:.7rem 1.5rem; font-size:.72rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; border:none; cursor:pointer; }
        .btn-outline { background:transparent; border:1px solid #ccc; color:#000; }
        .btn-danger { background:#ef4444; }
        .flex-btns { display: flex; gap: 0.5rem; flex-wrap:wrap; }
        
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
        
        .modal-overlay { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:900; display:flex; align-items:center; justify-content:center; }
        .modal { background:#fff; width:90%; max-width:500px; padding:2rem; max-height:90vh; overflow-y:auto; }
        .modal h2 { margin-bottom: 1.5rem; font-size:1.2rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; margin-bottom:0.4rem; color:#666; }
        .form-group input, .form-group textarea { width:100%; padding:0.6rem; border:1px solid #ddd; font-family:inherit; font-size:0.85rem; }
        
        @media (max-width:800px) { .layout { grid-template-columns:1fr; } }
      `}</style>

      <div className="header">
        <div>
          <div className="title">Tiendas y Vendedores</div>
          <div className="subtitle">Gestión Completa de Tiendas</div>
        </div>
        <div className="flex-btns">
          <button className="btn btn-outline" onClick={load}>↻ Recargar</button>
          <button className="btn" onClick={openCreate}>+ Nueva Tienda</button>
        </div>
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
                    <td><strong>{s.name || s.store_name}</strong></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '.72rem' }}>/{s.slug ?? s.id}</td>
                    <td>{s.products_count ?? '—'}</td>
                    <td>
                      <span className={`badge ${s.status === 'approved' || s.is_active !== false ? 'badge-on' : 'badge-off'}`}>
                        {s.status === 'approved' || s.is_active !== false ? 'Activa' : 'Inactiva'}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  {selected.logo && <img src={selected.logo} alt={selected.name} className="det-logo" />}
                  <button className="btn" style={{ padding:'0.4rem 0.8rem', fontSize:'0.6rem' }} onClick={() => impersonate(selected.id)}>
                    Entrar como Tienda →
                  </button>
                </div>
                
                <div className="det-name">{selected.name || selected.store_name}</div>
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
                
                <div className="det-row" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexDirection: 'row' }}>
                  <button className="btn btn-outline" onClick={() => openEdit(selected)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => deleteStore(selected.id)}>Eliminar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modalMode === 'create' ? 'Nueva Tienda' : 'Editar Tienda'}</h2>
            <form onSubmit={saveStore}>
              <div className="form-group">
                <label>Nombre de la Tienda *</label>
                <input required value={formData.store_name || ''} onChange={e => setFormData({...formData, store_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input placeholder="+58414..." value={formData.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email de Contacto</label>
                <input type="email" value={formData.contact_email || ''} onChange={e => setFormData({...formData, contact_email: e.target.value})} />
              </div>

              {modalMode === 'create' && (
                <>
                  <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                    <label>Nuevo Usuario (Vendedor) - Nombre *</label>
                    <input required value={formData.user_name || ''} onChange={e => setFormData({...formData, user_name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Email de Acceso *</label>
                    <input required type="email" value={formData.user_email || ''} onChange={e => setFormData({...formData, user_email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Contraseña *</label>
                    <input required type="password" value={formData.user_password || ''} onChange={e => setFormData({...formData, user_password: e.target.value})} />
                  </div>
                </>
              )}

              <div className="flex-btns" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
