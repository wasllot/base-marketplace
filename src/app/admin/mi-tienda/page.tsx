'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

interface SellerProfile {
  id: number;
  user_id: number;
  store_name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  whatsapp: string | null;
  contact_email: string | null;
  website: string | null;
  address: string | null;
  categories: any[];
  bank_account: string | null;
  bank_name: string | null;
  status: string;
}

export default function MiTiendaPage() {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<any>(API.SELLER_ME);
      setProfile(res?.data ?? res);
    } catch (e: any) {
      setError(e.message || 'No se pudo cargar el perfil de la tienda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const handleChange = (field: keyof SellerProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const payload = {
        store_name: profile.store_name,
        description: profile.description,
        whatsapp: profile.whatsapp,
        contact_email: profile.contact_email,
        website: profile.website,
        address: profile.address,
        bank_account: profile.bank_account,
        bank_name: profile.bank_name,
        // Categories array usually requires IDs only, mapping them if they are objects
      };

      await apiFetch(API.SELLER_ME, {
        method: 'PUT',
        body: payload
      });
      
      setSuccess('Perfil actualizado correctamente.');
    } catch (e: any) {
      setError(e.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando perfil...</div>;

  if (!profile && error) return <div style={{ color: 'red', padding: '2rem' }}>{error}</div>;
  if (!profile) return null;

  return (
    <>
      <style jsx>{`
        .header { margin-bottom: 2rem; }
        .title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .subtitle { color: #666; font-size: 0.85rem; }
        
        .card {
          background: #fff;
          border: 1px solid #e8e8e8;
          padding: 2rem;
          max-width: 800px;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #444;
          letter-spacing: 0.05em;
        }

        .form-group input, .form-group textarea {
          padding: 0.75rem;
          background: #fafafa;
          border: 1px solid #e8e8e8;
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus, .form-group textarea:focus {
          border-color: #000;
        }

        .btn {
          background: #000;
          color: #fff;
          padding: 0.85rem 2rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
        }

        .btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .alert {
          padding: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }
        
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border-color: #fca5a5;
        }
        
        @media (max-width: 768px) {
          .row { grid-template-columns: 1fr; gap: 1rem; }
        }
      `}</style>

      <div className="header">
        <h1 className="title">Perfil de Tienda: {profile.store_name}</h1>
        <p className="subtitle">Actualiza la información pública y los datos de contacto de tu negocio.</p>
      </div>

      {success && <div className="alert">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSave}>
          <div className="row">
            <div className="form-group">
              <label>Nombre de la Tienda</label>
              <input 
                required
                value={profile.store_name || ''} 
                onChange={e => handleChange('store_name', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Página Web</label>
              <input 
                type="url"
                placeholder="https://..."
                value={profile.website || ''} 
                onChange={e => handleChange('website', e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Descripción</label>
            <textarea 
              rows={4}
              value={profile.description || ''} 
              onChange={e => handleChange('description', e.target.value)} 
              placeholder="Escribe algo sobre tu tienda y tus productos..."
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label>WhatsApp (Atención al Cliente)</label>
              <input 
                placeholder="+58414XXXXXXX"
                value={profile.whatsapp || ''} 
                onChange={e => handleChange('whatsapp', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Email de Contacto</label>
              <input 
                type="email"
                value={profile.contact_email || ''} 
                onChange={e => handleChange('contact_email', e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label>Dirección Física (Opcional)</label>
            <input 
              value={profile.address || ''} 
              onChange={e => handleChange('address', e.target.value)} 
            />
          </div>

          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </>
  );
}
