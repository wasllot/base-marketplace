'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, setToken } from '@/lib/api/apiClient';
import { API } from '@/lib/api/endpoints';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch<{ access_token: string }>(API.LOGIN, {
        method: 'POST',
        body: { email, password },
      });
      setToken(res.access_token);
      localStorage.setItem('base_admin_auth', 'true');
      
      // Intentamos conseguir el perfil para saber si es admin o vendedor
      let role = 'seller';
      try {
        const userRes = await apiFetch<any>(API.USER);
        if (userRes?.name) localStorage.setItem('base_user_name', userRes.name);
        
        // Verificación definitiva de Admin: Si puede traer tiendas, es admin.
        try {
          await apiFetch(API.ADMIN_STORES);
          role = 'admin';
        } catch {
          role = 'seller';
        }

        localStorage.setItem('base_user_role', role);
      } catch (e) {
        console.warn('No se pudo obtener el perfil de usuario', e);
      }

      router.replace(role === 'admin' ? '/admin/tiendas' : '/admin/catalogo');
    } catch (err: any) {
      setError(err?.message || 'Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif;
          background: #000;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          width: 100%;
          max-width: 380px;
          padding: 3rem;
        }

        .login-logo {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.5rem;
          color: #fff;
          margin-bottom: 0.4rem;
        }

        .login-subtitle {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 3rem;
        }

        .login-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          display: block;
          margin-bottom: 0.6rem;
        }

        .login-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          font-size: 0.85rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.1rem;
          margin-bottom: 1.5rem;
        }

        .login-input:focus {
          border-color: rgba(255,255,255,0.4);
        }

        .login-input::placeholder {
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.1rem;
        }

        .login-btn {
          width: 100%;
          padding: 0.9rem;
          background: #fff;
          color: #000;
          border: none;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2rem;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }

        .login-btn:hover:not(:disabled) {
          background: #e8e8e8;
        }

        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-error {
          font-size: 0.7rem;
          color: #ff4444;
          margin-top: 1rem;
          text-align: center;
          letter-spacing: 0.03em;
        }
      `}</style>

      <div className="login-card">
        <div className="login-logo">BASE</div>
        <div className="login-subtitle">Panel de Administración</div>

        <form onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="login-input"
            placeholder="admin@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <label className="login-label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="login-input"
            placeholder="········"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </>
  );
}
