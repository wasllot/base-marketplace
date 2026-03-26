'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_PASSWORD = 'base2026';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('base_admin_auth', 'true');
        router.replace('/admin/contenido');
      } else {
        setError('Contraseña incorrecta.');
        setLoading(false);
      }
    }, 500);
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
          <label className="login-label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="login-input"
            placeholder="········"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
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
