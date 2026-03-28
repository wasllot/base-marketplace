'use client';

import { useEffect, useState, useRef } from 'react';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

interface ApiProduct {
  id: number;
  name: string;
  price: number | string;
  category_id?: number;
  category?: { id: number, name: string };
  image?: string;
  images?: { url: string }[];
  stock_quantity?: number;
  stock?: number;
  is_featured?: boolean;
  is_active?: boolean;
  seller_id?: number;
  seller?: { id: number, name: string, store_name: string };
}

export default function CatalogoAdminPage() {
  const [role, setRole] = useState<'admin' | 'seller'>('seller');
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<{id:number, name:string}[]>([]);
  const [stores, setStores] = useState<{id:number, name:string, store_name:string}[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create'|'edit'>('create');
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const init = async () => {
    const r = (localStorage.getItem('base_user_role') as 'admin' | 'seller') || 'seller';
    setRole(r);
    
    // Load dropdown data
    try {
      const catsRes = await apiFetch<any>(API.CATEGORIES);
      setCategories(Array.isArray(catsRes) ? catsRes : catsRes.data ?? []);
      
      if (r === 'admin') {
        const storesRes = await apiFetch<any>(API.ADMIN_STORES);
        setStores(Array.isArray(storesRes) ? storesRes : storesRes?.data?.data ?? []);
      }
    } catch {}

    loadProducts(r);
  };

  const loadProducts = async (currentRole: 'admin'|'seller') => {
    setLoading(true);
    setError('');
    try {
      const endpoint = currentRole === 'admin' ? API.ADMIN_PRODUCTS : API.SELLER_PRODUCTS;
      const data = await apiFetch<any>(endpoint);
      const list = Array.isArray(data) ? data : (data.data?.data ?? data.data ?? []);
      setProducts(list);
    } catch (e: any) {
      setError(e.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { init(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto permanentemente?')) return;
    setDeleting(id);
    try {
      const endpoint = role === 'admin' ? API.ADMIN_PRODUCT(id) : API.SELLER_PRODUCT(id);
      await apiFetch(endpoint, { method: 'DELETE' });
      setProducts(p => p.filter(x => x.id !== id));
    } catch (e: any) {
      alert(e.message || 'No se pudo eliminar');
    } finally {
      setDeleting(null);
    }
  };

  const openCreate = () => {
    setModalMode('create');
    setFormData({ is_active: true, stock_quantity: 1 });
    setIsModalOpen(true);
  };

  const openEdit = (p: ApiProduct) => {
    setModalMode('edit');
    setFormData({
      id: p.id,
      name: p.name,
      price: p.price,
      stock_quantity: p.stock_quantity ?? p.stock ?? 0,
      category_id: p.category_id ?? p.category?.id,
      image: p.image ?? p.images?.[0]?.url,
      is_active: p.is_active !== false,
      seller_id: p.seller_id ?? p.seller?.id,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const fData = new FormData();
      fData.append('image', file);
      fData.append('folder', 'products');
      
      // Note: apiFetch doesn't handle FormData easily due to JSON.stringify, 
      // so we use normal fetch with the token for the upload.
      const token = localStorage.getItem('base_api_token');
      const res = await fetch(API.UPLOAD_IMAGE, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error subiendo imagen');
      
      setFormData({ ...formData, image: data.data.url });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (modalMode === 'create') {
        const endpoint = role === 'admin' ? API.ADMIN_PRODUCTS : API.SELLER_PRODUCTS;
        await apiFetch(endpoint, { method: 'POST', body: formData });
      } else {
        const endpoint = role === 'admin' ? API.ADMIN_PRODUCT(formData.id) : API.SELLER_PRODUCT(formData.id);
        await apiFetch(endpoint, { method: 'PUT', body: formData });
      }
      setIsModalOpen(false);
      loadProducts(role);
    } catch (err: any) {
      alert('Error guardando: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtrado
  const [filterStore, setFilterStore] = useState('');
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStore = filterStore ? (p.seller_id?.toString() === filterStore || p.seller?.id?.toString() === filterStore) : true;
    return matchSearch && matchStore;
  });

  const getImg = (p: ApiProduct | any) => p.image ?? p.images?.[0]?.url ?? 'https://via.placeholder.com/150?text=Sin+Imagen';

  return (
    <>
      <style jsx>{`
        .cat-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
        .cat-title { font-size:1.3rem; font-weight:700; letter-spacing:-0.02em; }
        .cat-subtitle { font-size:.75rem; color:#999; margin-top:.2rem; text-transform:uppercase; letter-spacing:.05em; }
        .cat-actions { display:flex; gap:.8rem; align-items:center; flex-wrap:wrap; }
        .search-box, .select-box { padding:.6rem 1rem; border:1px solid #e0e0e0; background:#fff; font-size:.82rem; font-family:inherit; outline:none; }
        .search-box:focus, .select-box:focus { border-color:#000; }
        
        .btn-primary { background:#000; color:#fff; padding:.7rem 1.5rem; font-size:.72rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; border:none; cursor:pointer; text-decoration:none; display:inline-block; }
        .btn-primary:hover { background:#333; }
        
        .table-wrap { background:#fff; border:1px solid #e8e8e8; overflow-x:auto; }
        .table { width:100%; border-collapse:collapse; min-width: 600px; }
        .table th { background:#fafafa; padding:.75rem 1rem; text-align:left; font-size:.65rem; font-weight:700; letter-spacing:.12rem; text-transform:uppercase; color:#999; border-bottom:1px solid #e8e8e8; }
        .table td { padding:.85rem 1rem; font-size:.82rem; border-bottom:1px solid #f0f0f0; vertical-align:middle; }
        
        .prod-thumb { width:44px; height:44px; object-fit:cover; background:#f0f0f0; border-radius:4px; }
        .prod-name { font-weight:600; }
        
        .badge { display:inline-block; padding:.2rem .55rem; font-size:.62rem; font-weight:700; letter-spacing:.05rem; border-radius:4px; }
        .badge-green { background:#dcfce7; color:#166534; }
        .badge-gray { background:#f3f4f6; color:#6b7280; }
        
        .action-btn { background:none; border:1px solid #e0e0e0; padding:.4rem .8rem; font-size:.7rem; cursor:pointer; font-weight:600; transition:all .2s; }
        .action-btn:hover { border-color:#000; }
        .action-btn.del:hover { border-color:#ef4444; color:#ef4444; }
        
        .state-center { display:flex; align-items:center; justify-content:center; height:40vh; color:#999; font-size:.85rem; flex-direction:column; }
        
        .modal-overlay { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:900; display:flex; align-items:center; justify-content:center; padding: 1rem; }
        .modal { background:#fff; width:100%; max-width:550px; padding:2rem; max-height:90vh; overflow-y:auto; border-radius:8px; }
        .modal h2 { margin-bottom: 1.5rem; font-size:1.2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display:block; font-size:0.7rem; font-weight:700; text-transform:uppercase; margin-bottom:0.4rem; color:#666; }
        .form-group input, .form-group select { width:100%; padding:0.6rem; border:1px solid #ddd; font-family:inherit; font-size:0.85rem; }
      `}</style>

      <div className="cat-header">
        <div>
          <div className="cat-title">Gestión de Productos</div>
          <div className="cat-subtitle">{role === 'admin' ? 'Catálogo Global' : 'Mis Artículos'} · {products.length} ítems</div>
        </div>
        <div className="cat-actions">
          {role === 'admin' && stores.length > 0 && (
            <select className="select-box" value={filterStore} onChange={e => setFilterStore(e.target.value)}>
              <option value="">Todas las Tiendas</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name || s.store_name}</option>)}
            </select>
          )}
          <input className="search-box" placeholder="Buscar por nombre..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn-primary" style={{ background: 'transparent', color: '#000', border: '1px solid #000' }} onClick={() => loadProducts(role)}>↻</button>
          <button className="btn-primary" onClick={openCreate}>+ Crear Producto</button>
        </div>
      </div>

      {loading && <div className="state-center">Cargando productos...</div>}
      {error && <div className="state-center" style={{ color: '#ef4444' }}>{error}</div>}

      {!loading && !error && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                {role === 'admin' && <th>Tienda</th>}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                      <img src={getImg(p)} alt={p.name} className="prod-thumb" />
                      <div>
                        <div className="prod-name">{p.name}</div>
                        <div style={{ fontSize: '.72rem', color: '#999' }}>{p.category?.name ?? 'Sin categoría'}</div>
                      </div>
                    </div>
                  </td>
                  {role === 'admin' && (
                    <td style={{ fontSize: '.75rem', fontWeight: 500 }}>{p.seller?.store_name ?? p.seller?.name ?? '—'}</td>
                  )}
                  <td>${Number(p.price).toLocaleString()}</td>
                  <td>{p.stock_quantity ?? p.stock ?? '—'}</td>
                  <td>
                    <span className={`badge ${p.is_active !== false ? 'badge-green' : 'badge-gray'}`}>
                      {p.is_active !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                      <button className="action-btn" onClick={() => openEdit(p)}>Editar</button>
                      <button className="action-btn del" onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>
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

      {isModalOpen && (
        <div className="modal-overlay" onMouseDown={() => setIsModalOpen(false)}>
          <div className="modal" onMouseDown={e => e.stopPropagation()}>
            <h2>{modalMode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}</h2>
            <form onSubmit={saveProduct}>
              
              <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <img src={getImg(formData)} className="prod-thumb" style={{ width: '64px', height: '64px' }} alt="Preview" />
                <div>
                  <label>Imagen Principal</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                  <button type="button" className="action-btn" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                    {uploadingImage ? 'Subiendo...' : 'Seleccionar Imagen (R2)'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Nombre del Producto *</label>
                <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input required type="number" step="0.01" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input required type="number" value={formData.stock_quantity ?? formData.stock ?? ''} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                    <option value="">Seleccionar...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                
                {role === 'admin' && (
                  <div className="form-group">
                    <label>Tienda (Vendedor) *</label>
                    <select required value={formData.seller_id || ''} onChange={e => setFormData({...formData, seller_id: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {stores.map(s => <option key={s.id} value={s.id}>{s.name || s.store_name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input type="checkbox" id="is_active" style={{ width: 'auto' }} checked={formData.is_active !== false} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                <label htmlFor="is_active" style={{ margin: 0 }}>Producto Activo (Visible en tienda)</label>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                <button type="button" className="btn-primary" style={{ flex: 1, background: 'transparent', color: '#000', border: '1px solid #ccc' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
