'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

export default function LoginPage() {
  const { login, register, isLoading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      router.push('/cuenta');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .auth-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f7f7f7; padding:2rem; }
        .auth-card { background:#fff; border:1px solid #e8e8e8; padding:3rem; width:100%; max-width:420px; }
        .auth-logo { font-size:1.3rem; font-weight:700; letter-spacing:.5rem; text-align:center; margin-bottom:2.5rem; text-decoration:none; color:#000; display:block; }
        .auth-tabs { display:flex; border-bottom:1px solid #e8e8e8; margin-bottom:2rem; }
        .auth-tab { flex:1; padding:.75rem; font-size:.75rem; font-weight:700; letter-spacing:.1rem; text-transform:uppercase; text-align:center; background:none; border:none; cursor:pointer; font-family:inherit; color:#999; border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .2s; }
        .auth-tab.active { color:#000; border-bottom-color:#000; }
        .field { display:flex; flex-direction:column; gap:.4rem; margin-bottom:1.2rem; }
        .label { font-size:.65rem; font-weight:700; letter-spacing:.12rem; text-transform:uppercase; color:#888; }
        .input { padding:.8rem 1rem; border:1px solid #e0e0e0; font-size:.9rem; font-family:inherit; outline:none; }
        .input:focus { border-color:#000; }
        .submit-btn { width:100%; padding:.9rem; background:#000; color:#fff; border:none; font-size:.75rem; font-weight:700; letter-spacing:.15rem; text-transform:uppercase; cursor:pointer; font-family:inherit; margin-top:.5rem; }
        .submit-btn:disabled { opacity:.5; cursor:not-allowed; }
        .error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; font-size:.8rem; padding:.75rem 1rem; margin-bottom:1rem; }
        .auth-footer { text-align:center; font-size:.75rem; color:#999; margin-top:1.5rem; }
        .auth-footer a { color:#000; font-weight:600; }
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <Link href="/" className="auth-logo">BASE</Link>

          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
              Iniciar Sesión
            </button>
            <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
              Registrarse
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="field">
                <label className="label">Nombre completo</label>
                <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Tu nombre" />
              </div>
            )}
            <div className="field">
              <label className="label">Correo electrónico</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" />
            </div>
            <div className="field">
              <label className="label">Contraseña</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
            </div>
            <button className="submit-btn" type="submit" disabled={loading || isLoading}>
              {loading ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="auth-footer">
            <Link href="/">← Volver al sitio</Link>
          </div>
        </div>
      </div>
    </>
  );
}
