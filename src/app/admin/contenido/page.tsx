'use client';

import { useState, useEffect, useCallback } from 'react';

type SiteContent = Record<string, unknown>;

// ── Reusable styled helpers ──────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="cms-field">
      <label className="cms-label">{label}</label>
      {multiline ? (
        <textarea
          className="cms-input cms-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          className="cms-input"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="cms-field">
      <label className="cms-label">{label}</label>
      <input
        className="cms-input"
        type="url"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://images.unsplash.com/..."
      />
      {value && (
        <div className="cms-img-preview">
          <img src={value} alt="preview" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export default function ContenidoPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Fetch content on mount
  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(setContent)
      .catch(() => setError('No se pudo cargar el contenido.'));
  }, []);

  const updateContent = useCallback(<T,>(section: string, value: T) => {
    setContent(prev => prev ? { ...prev, [section]: value } : prev);
    setSaved(false);
  }, []);

  const saveContent = async () => {
    if (!content) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <span>Cargando contenido...</span>
      </div>
    );
  }

  // Typed helpers
  const hero = content.hero as Record<string, string>;
  const marquee = content.marquee as { items: string[] };
  const platforms = content.platforms as Record<string, unknown>;
  const editorial = content.editorial as Record<string, unknown>;
  const values = content.values as Record<string, unknown>;
  const ctaSection = content.cta as Record<string, string>;

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'marquee', label: 'Marquee' },
    { id: 'platforms', label: 'Plataformas' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'values', label: 'Valores' },
    { id: 'cta', label: 'CTA Final' },
  ];

  return (
    <>
      <style jsx global>{`
        .cms-page { max-width: 900px; }

        .cms-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cms-page-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #000;
          letter-spacing: -0.02em;
        }

        .cms-page-subtitle {
          font-size: 0.75rem;
          font-weight: 300;
          color: #A9A9A9;
          margin-top: 0.2rem;
        }

        .save-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .save-status {
          font-size: 0.7rem;
          color: #22c55e;
          font-weight: 500;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .save-btn {
          padding: 0.7rem 1.8rem;
          background: #000;
          color: #fff;
          border: none;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12rem;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .save-btn:hover:not(:disabled) { background: #333; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .tab-bar {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #E8E8E8;
          margin-bottom: 2rem;
          overflow-x: auto;
        }

        .tab-btn {
          padding: 0.7rem 1.4rem;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1rem;
          text-transform: uppercase;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-family: inherit;
          color: #A9A9A9;
          transition: all 0.2s;
          white-space: nowrap;
          margin-bottom: -1px;
        }
        .tab-btn:hover { color: #000; }
        .tab-btn.active { color: #000; border-bottom-color: #000; }

        .cms-card {
          background: #fff;
          border: 1px solid #E8E8E8;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }

        .section-header { margin-bottom: 1.5rem; }
        .section-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #000;
          letter-spacing: 0.02em;
          margin-bottom: 0.25rem;
        }
        .section-subtitle {
          font-size: 0.7rem;
          font-weight: 300;
          color: #A9A9A9;
        }

        .cms-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .cms-field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }

        .cms-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          color: #888;
        }

        .cms-input {
          padding: 0.65rem 0.8rem;
          background: #f7f7f7;
          border: 1px solid #E8E8E8;
          color: #000;
          font-size: 0.82rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .cms-input:focus { border-color: #000; background: #fff; }

        .cms-textarea { resize: vertical; min-height: 70px; }

        .cms-img-preview {
          margin-top: 0.5rem;
          width: 100%;
          max-height: 160px;
          overflow: hidden;
          background: #f0f0f0;
        }
        .cms-img-preview img {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }

        .cms-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .cms-list-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .cms-list-item input {
          flex: 1;
        }

        .cms-remove-btn {
          width: 28px;
          height: 28px;
          background: none;
          border: 1px solid #E8E8E8;
          cursor: pointer;
          font-size: 1rem;
          color: #A9A9A9;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .cms-remove-btn:hover { border-color: #000; color: #000; }

        .cms-add-btn {
          padding: 0.6rem 1rem;
          background: none;
          border: 1px dashed #D3D3D3;
          color: #A9A9A9;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1rem;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .cms-add-btn:hover { border-color: #000; color: #000; }

        .platform-card-editor {
          border: 1px solid #E8E8E8;
          padding: 1.5rem;
          margin-bottom: 1rem;
          background: #fafafa;
        }

        .platform-card-header {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15rem;
          text-transform: uppercase;
          color: #A9A9A9;
          margin-bottom: 1rem;
        }

        .value-item-editor {
          border: 1px solid #E8E8E8;
          padding: 1.5rem;
          margin-bottom: 1rem;
          background: #fafafa;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1rem;
          align-items: start;
        }

        .value-number-badge {
          width: 36px;
          height: 36px;
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 1rem;
          color: #A9A9A9;
          font-size: 0.8rem;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #E8E8E8;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .error-msg {
          font-size: 0.72rem;
          color: #ef4444;
          padding: 0.6rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          margin-bottom: 1rem;
        }

        @media (max-width: 700px) {
          .cms-grid-2 { grid-template-columns: 1fr; }
          .value-item-editor { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cms-page">
        {/* Top bar */}
        <div className="cms-topbar">
          <div>
            <div className="cms-page-title">Contenido del Sitio</div>
            <div className="cms-page-subtitle">Edita el texto e imágenes de cada sección. Guarda para ver los cambios en el sitio.</div>
          </div>
          <div className="save-actions">
            {saved && <span className="save-status">✓ Guardado</span>}
            {error && <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>{error}</span>}
            <button className="save-btn" onClick={saveContent} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── HERO ── */}
        {activeTab === 'hero' && (
          <>
            <div className="cms-card">
              <SectionHeader title="Texto del Hero" subtitle="La primera sección que ven los visitantes al entrar al sitio." />
              <Field label="Tag / Etiqueta superior" value={hero.tag} onChange={v => updateContent('hero', { ...hero, tag: v })} />
              <div className="cms-grid-2">
                <Field label="Título — Línea 1" value={hero.titleLine1} onChange={v => updateContent('hero', { ...hero, titleLine1: v })} />
                <Field label="Título — Línea 2" value={hero.titleLine2} onChange={v => updateContent('hero', { ...hero, titleLine2: v })} />
              </div>
              <Field label="Título — Línea 3 (bold)" value={hero.titleLine3} onChange={v => updateContent('hero', { ...hero, titleLine3: v })} />
              <Field label="Descripción" value={hero.description} onChange={v => updateContent('hero', { ...hero, description: v })} multiline />
            </div>

            <div className="cms-card">
              <SectionHeader title="Botones de Acción (CTA)" />
              <div className="cms-grid-2">
                <Field label="Botón 1 — Texto" value={hero.cta1Text} onChange={v => updateContent('hero', { ...hero, cta1Text: v })} />
                <Field label="Botón 1 — URL" value={hero.cta1Url} onChange={v => updateContent('hero', { ...hero, cta1Url: v })} />
              </div>
              <div className="cms-grid-2">
                <Field label="Botón 2 — Texto" value={hero.cta2Text} onChange={v => updateContent('hero', { ...hero, cta2Text: v })} />
                <Field label="Botón 2 — URL" value={hero.cta2Url} onChange={v => updateContent('hero', { ...hero, cta2Url: v })} />
              </div>
            </div>

            <div className="cms-card">
              <SectionHeader title="Imagen del Hero" subtitle="Pega una URL de imagen (Unsplash, etc.). Se mostrará a la derecha del texto." />
              <ImageField label="URL de imagen" value={hero.heroImage} onChange={v => updateContent('hero', { ...hero, heroImage: v })} />
            </div>
          </>
        )}

        {/* ── MARQUEE ── */}
        {activeTab === 'marquee' && (
          <div className="cms-card">
            <SectionHeader title="Palabras clave del Marquee" subtitle="La banda de texto animado que se desplaza debajo del hero. Puedes agregar, editar o quitar palabras." />
            <div className="cms-list">
              {marquee.items.map((item, i) => (
                <div key={i} className="cms-list-item">
                  <input
                    className="cms-input"
                    value={item}
                    onChange={e => {
                      const updated = [...marquee.items];
                      updated[i] = e.target.value;
                      updateContent('marquee', { items: updated });
                    }}
                  />
                  <button
                    className="cms-remove-btn"
                    onClick={() => {
                      const updated = marquee.items.filter((_, idx) => idx !== i);
                      updateContent('marquee', { items: updated });
                    }}
                    title="Eliminar"
                  >×</button>
                </div>
              ))}
            </div>
            <button
              className="cms-add-btn"
              onClick={() => updateContent('marquee', { items: [...marquee.items, 'Nueva palabra'] })}
            >
              + Agregar palabra
            </button>
          </div>
        )}

        {/* ── PLATAFORMAS ── */}
        {activeTab === 'platforms' && (
          <>
            <div className="cms-card">
              <SectionHeader title="Encabezado de la sección" />
              <div className="cms-grid-2">
                <Field label="Etiqueta" value={(platforms as Record<string,string>).sectionLabel} onChange={v => updateContent('platforms', { ...platforms, sectionLabel: v })} />
                <Field label="Título — Línea 1" value={(platforms as Record<string,string>).titleLine1} onChange={v => updateContent('platforms', { ...platforms, titleLine1: v })} />
              </div>
              <Field label="Título — Parte bold" value={(platforms as Record<string,string>).titleBold} onChange={v => updateContent('platforms', { ...platforms, titleBold: v })} />
            </div>

            {(platforms.cards as Array<Record<string,string>>).map((card, i) => (
              <div key={card.id} className="cms-card">
                <div className="platform-card-header">Card {card.number} — {card.title}</div>
                <div className="cms-grid-2">
                  <Field label="Título" value={card.title} onChange={v => {
                    const cards = [...(platforms.cards as Array<Record<string,string>>)];
                    cards[i] = { ...cards[i], title: v };
                    updateContent('platforms', { ...platforms, cards });
                  }} />
                  <Field label="Texto del enlace" value={card.linkText} onChange={v => {
                    const cards = [...(platforms.cards as Array<Record<string,string>>)];
                    cards[i] = { ...cards[i], linkText: v };
                    updateContent('platforms', { ...platforms, cards });
                  }} />
                </div>
                <Field label="Descripción" value={card.description} multiline onChange={v => {
                  const cards = [...(platforms.cards as Array<Record<string,string>>)];
                  cards[i] = { ...cards[i], description: v };
                  updateContent('platforms', { ...platforms, cards });
                }} />
                <Field label="URL del enlace" value={card.linkUrl} onChange={v => {
                  const cards = [...(platforms.cards as Array<Record<string,string>>)];
                  cards[i] = { ...cards[i], linkUrl: v };
                  updateContent('platforms', { ...platforms, cards });
                }} />
              </div>
            ))}
          </>
        )}

        {/* ── EDITORIAL ── */}
        {activeTab === 'editorial' && (
          <>
            <div className="cms-card">
              <SectionHeader title="Sección Editorial / Identidad" subtitle="La sección con fondo negro que muestra las categorías de moda." />
              <div className="cms-grid-2">
                <Field label="Etiqueta" value={(editorial as Record<string,string>).sectionLabel} onChange={v => updateContent('editorial', { ...editorial, sectionLabel: v })} />
                <Field label="Título — Línea 1" value={(editorial as Record<string,string>).titleLine1} onChange={v => updateContent('editorial', { ...editorial, titleLine1: v })} />
              </div>
              <Field label="Título — Parte bold" value={(editorial as Record<string,string>).titleBold} onChange={v => updateContent('editorial', { ...editorial, titleBold: v })} />
              <Field label="Descripción" value={(editorial as Record<string,string>).description} multiline onChange={v => updateContent('editorial', { ...editorial, description: v })} />
              <div className="cms-grid-2">
                <Field label="Texto botón CTA" value={(editorial as Record<string,string>).ctaText} onChange={v => updateContent('editorial', { ...editorial, ctaText: v })} />
                <Field label="URL botón CTA" value={(editorial as Record<string,string>).ctaUrl} onChange={v => updateContent('editorial', { ...editorial, ctaUrl: v })} />
              </div>
            </div>

            <div className="cms-card">
              <SectionHeader title="Categorías en el panel oscuro" subtitle="Las filas que aparecen en el lado izquierdo negro." />
              <div className="cms-list">
                {(editorial.categories as string[]).map((cat, i) => (
                  <div key={i} className="cms-list-item">
                    <input
                      className="cms-input"
                      value={cat}
                      onChange={e => {
                        const cats = [...(editorial.categories as string[])];
                        cats[i] = e.target.value;
                        updateContent('editorial', { ...editorial, categories: cats });
                      }}
                    />
                    <button
                      className="cms-remove-btn"
                      onClick={() => {
                        const cats = (editorial.categories as string[]).filter((_, idx) => idx !== i);
                        updateContent('editorial', { ...editorial, categories: cats });
                      }}
                    >×</button>
                  </div>
                ))}
              </div>
              <button
                className="cms-add-btn"
                onClick={() => updateContent('editorial', { ...editorial, categories: [...(editorial.categories as string[]), 'Nueva categoría'] })}
              >
                + Agregar categoría
              </button>
            </div>
          </>
        )}

        {/* ── VALUES ── */}
        {activeTab === 'values' && (
          <>
            <div className="cms-card">
              <SectionHeader title="Encabezado de la sección de Valores" />
              <div className="cms-grid-2">
                <Field label="Etiqueta" value={(values as Record<string,string>).sectionLabel} onChange={v => updateContent('values', { ...values, sectionLabel: v })} />
                <Field label="Título — Línea 1" value={(values as Record<string,string>).titleLine1} onChange={v => updateContent('values', { ...values, titleLine1: v })} />
              </div>
              <Field label="Título — Parte bold" value={(values as Record<string,string>).titleBold} onChange={v => updateContent('values', { ...values, titleBold: v })} />
            </div>

            {(values.items as Array<Record<string, string>>).map((item, i) => (
              <div key={i} className="cms-card">
                <div className="value-item-editor">
                  <div className="value-number-badge">{item.number}</div>
                  <div>
                    <Field label="Título" value={item.title} onChange={v => {
                      const items = [...(values.items as Array<Record<string,string>>)];
                      items[i] = { ...items[i], title: v };
                      updateContent('values', { ...values, items });
                    }} />
                    <Field label="Descripción" value={item.description} multiline onChange={v => {
                      const items = [...(values.items as Array<Record<string,string>>)];
                      items[i] = { ...items[i], description: v };
                      updateContent('values', { ...values, items });
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── CTA ── */}
        {activeTab === 'cta' && (
          <div className="cms-card">
            <SectionHeader title="Sección CTA Final" subtitle="El bloque negro al final de la homepage con botones de acción." />
            <div className="cms-grid-2">
              <Field label="Título — Línea 1" value={ctaSection.titleLine1} onChange={v => updateContent('cta', { ...ctaSection, titleLine1: v })} />
              <Field label="Título — Parte bold" value={ctaSection.titleBold} onChange={v => updateContent('cta', { ...ctaSection, titleBold: v })} />
            </div>
            <Field label="Subtítulo / descripción" value={ctaSection.subtitle} multiline onChange={v => updateContent('cta', { ...ctaSection, subtitle: v })} />
            <div className="cms-grid-2">
              <Field label="Botón 1 — Texto" value={ctaSection.btn1Text} onChange={v => updateContent('cta', { ...ctaSection, btn1Text: v })} />
              <Field label="Botón 1 — URL" value={ctaSection.btn1Url} onChange={v => updateContent('cta', { ...ctaSection, btn1Url: v })} />
            </div>
            <div className="cms-grid-2">
              <Field label="Botón 2 — Texto" value={ctaSection.btn2Text} onChange={v => updateContent('cta', { ...ctaSection, btn2Text: v })} />
              <Field label="Botón 2 — URL" value={ctaSection.btn2Url} onChange={v => updateContent('cta', { ...ctaSection, btn2Url: v })} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
