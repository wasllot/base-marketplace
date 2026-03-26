'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

interface Category {
  id: number;
  name: string;
  slug?: string;
  products_count?: number;
  description?: string;
}

export default function CategoriasAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ data: Category[] } | Category[]>(API.CATEGORIES);
      const list = Array.isArray(data) ? data : (data as { data: Category[] }).data ?? [];
      setCategories(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await apiFetch(API.CATEGORIES, { method: 'POST', body: { name: newName.trim() } });
      setNewName('');
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Error al crear categoría');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await apiFetch(API.CATEGORY(id), { method: 'DELETE' });
      setCategories(c => c.filter(x => x.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'No se pudo eliminar');
    }
  };

  return (
    <>
      <style jsx>{`
        .header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
        .title { font-size:1.3rem; font-weight:700; letter-spacing:-.02em; }
        .subtitle { font-size:.75rem; color:#999; margin-top:.2rem; }
        .create-bar { display:flex; gap:.8rem; margin-bottom:2rem; }
        .input { padding:.7rem 1rem; border:1px solid #e0e0e0; font-size:.82rem; font-family:inherit; outline:none; flex:1; }
        .input:focus { border-color:#000; }
        .btn { background:#000; color:#fff; padding:.7rem 1.5rem; font-size:.72rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; border:none; cursor:pointer; white-space:nowrap; }
        .btn:disabled { opacity:.5; }
        .cat-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:1rem; }
        .cat-card { background:#fff; border:1px solid #e8e8e8; padding:1.5rem; display:flex; flex-direction:column; gap:.5rem; }
        .cat-name { font-size:1rem; font-weight:600; letter-spacing:-.01em; }
        .cat-slug { font-size:.72rem; color:#999; font-family:monospace; }
        .cat-count { font-size:.72rem; color:#666; }
        .card-actions { display:flex; gap:.5rem; margin-top:.5rem; }
        .action-btn { background:none; border:1px solid #e0e0e0; padding:.4rem .8rem; font-size:.7rem; cursor:pointer; font-family:inherit; font-weight:600; transition:all .2s; }
        .action-btn.del:hover { border-color:#ef4444; color:#ef4444; }
        .state-center { display:flex; align-items:center; justify-content:center; height:30vh; color:#999; font-size:.85rem; }
      `}</style>

      <div className="header">
        <div>
          <div className="title">Categorías</div>
          <div className="subtitle">API · {categories.length} categorías encontradas</div>
        </div>
        <button className="btn" onClick={load}>↻ Recargar</button>
      </div>

      <div className="create-bar">
        <input className="input" placeholder="Nombre de nueva categoría..." value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        <button className="btn" onClick={handleCreate} disabled={creating || !newName.trim()}>
          {creating ? 'Creando...' : '+ Crear'}
        </button>
      </div>

      {loading && <div className="state-center">Cargando categorías...</div>}
      {error && <div className="state-center" style={{ color: '#ef4444' }}>{error}</div>}

      {!loading && !error && (
        <div className="cat-grid">
          {categories.map(cat => (
            <div key={cat.id} className="cat-card">
              <div className="cat-name">{cat.name}</div>
              {cat.slug && <div className="cat-slug">/{cat.slug}</div>}
              {cat.products_count !== undefined && <div className="cat-count">{cat.products_count} productos</div>}
              {cat.description && <div className="cat-slug" style={{ color: '#666', fontFamily: 'inherit' }}>{cat.description}</div>}
              <div className="card-actions">
                <button className="action-btn del" onClick={() => handleDelete(cat.id)}>Eliminar</button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="state-center" style={{ gridColumn: '1/-1', color: '#999' }}>Sin categorías</div>
          )}
        </div>
      )}
    </>
  );
}
