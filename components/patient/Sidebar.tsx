'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const NAV = [
  { href: '/patient',         icon: '🏠', label: 'Inicio',       short: 'Inicio' },
  { href: '/patient/chat',    icon: '💬', label: 'Dani IA',      short: 'Dani' },
  { href: '/patient/doctor',  icon: '🥼', label: 'Mis Doctores', short: 'Doctores' },
  { href: '/patient/diary',   icon: '📅', label: 'Mi Diario',    short: 'Diario' },
  { href: '/patient/exams',   icon: '🧪', label: 'Mis Exámenes', short: 'Exámenes' },
  { href: '/patient/habits',  icon: '🌱', label: 'Minihábitо',   short: 'Hábito' },
];

const BOTTOM = [
  { href: '/patient/upgrade',  icon: '⭐', label: 'Mejorar plan', highlight: true },
  { href: '/patient/profile',  icon: '👤', label: 'Mi Perfil' },
  { href: '/patient/settings', icon: '⚙️', label: 'Configuración' },
];

const LEVELS = [
  { min: 0,    max: 99,   label: 'Aprendiz',     emoji: '📖', color: '#92400E' },
  { min: 100,  max: 299,  label: 'Consciente',   emoji: '👁️', color: '#16A34A' },
  { min: 300,  max: 699,  label: 'Activo',       emoji: '⚡', color: '#0E8A7A' },
  { min: 700,  max: 1499, label: 'Comprometido', emoji: '🎯', color: '#1B3A6B' },
  { min: 1500, max: 9999, label: 'Guardián',     emoji: '🛡️', color: '#065F52' },
];

function getLevel(pts: number) {
  return LEVELS.find(l => pts >= l.min && pts <= l.max) ?? LEVELS[0];
}

export default function Sidebar() {
  const path = usePathname();
  const [nombre, setNombre] = useState('Paciente');
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('mnx_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.nombre) setNombre(user.nombre.split(' ')[0]);
      if (user.puntos !== undefined) setPuntos(user.puntos);
    }
    // Escuchar cambios de puntos en tiempo real
    function onStorage() {
      const s = localStorage.getItem('mnx_user');
      if (s) {
        const u = JSON.parse(s);
        if (u.nombre) setNombre(u.nombre.split(' ')[0]);
        if (u.puntos !== undefined) setPuntos(u.puntos);
      }
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('mnx_update', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('mnx_update', onStorage);
    };
  }, []);

  const level = getLevel(puntos);
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const progress = nextLevel ? Math.round(((puntos - level.min) / (nextLevel.min - level.min)) * 100) : 100;

  return (
    <>
      <aside className="sidebar" style={s.sidebar}>
        <div style={s.brand}>
          <Image src="/logo_sidebar.png" alt="MiNexoSalud" width={160} height={48}
            style={{ objectFit: 'contain', display: 'block' }} priority />
        </div>

        <div style={s.userBox}>
          <div style={s.avatar}>{nombre[0]?.toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {level.emoji} {level.label} · {puntos} pts
            </div>
          </div>
        </div>

        <div style={s.levelBar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
            <span>{level.label}</span>
            {nextLevel && <span>{nextLevel.label}</span>}
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#99DDC7', borderRadius: 4, transition: 'width .4s' }} />
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3, textAlign: 'right' as const }}>
            {nextLevel ? `${nextLevel.min - puntos} pts para ${nextLevel.label}` : '¡Nivel máximo!'}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px' }}>
          <div style={s.navLabel}>Menú</div>
          {NAV.map(item => {
            const active = path === item.href || (item.href !== '/patient' && path.startsWith(item.href));
            const tourId = `tour-nav-${item.href.split('/').pop()}`;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div id={tourId} style={{ ...s.navItem, ...(active ? s.navActive : {}) }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{item.label}</span>
                  {item.href === '/patient/habits' && (
                    <span style={{ marginLeft: 'auto', background: '#99DDC7', color: '#1B3A6B', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100 }}>HOY</span>
                  )}
                </div>
              </Link>
            );
          })}

          <div style={{ ...s.navLabel, marginTop: 20 }}>Cuenta</div>
          {BOTTOM.map(item => {
            const active = path.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  ...s.navItem,
                  ...(active ? s.navActive : {}),
                  ...('highlight' in item && item.highlight ? { background: 'rgba(153,221,199,0.15)', border: '1px solid rgba(153,221,199,0.3)', marginBottom: 4 } : {}),
                }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : ('highlight' in item && item.highlight ? 600 : 400), color: 'highlight' in item && item.highlight ? '#99DDC7' : undefined }}>{item.label}</span>
                </div>
              </Link>
            );
          })}
          <div style={{ ...s.navItem, cursor: 'pointer', marginTop: 4 }} onClick={() => { localStorage.removeItem('mdl_token'); localStorage.removeItem('mnx_user'); window.location.href = '/patient/login'; }}>
            <span style={{ fontSize: 16 }}>🚪</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Cerrar sesión</span>
          </div>
        </nav>

        <div style={{ padding: '16px 20px', fontSize: 10, color: 'rgba(255,255,255,0.25)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          MiNexoSalud · v2.0
        </div>
      </aside>

      <div className="mobile-bar" style={s.mobileBar}>
        {NAV.slice(0, 5).map(item => {
          const active = path === item.href || (item.href !== '/patient' && path.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 0' }}>
              <span style={{ fontSize: 20, opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: active ? '#3366CC' : '#7B8499' }}>{item.short}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  sidebar: { width: 240, minHeight: '100vh', background: '#1B3A6B', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 50, fontFamily: "'Sora',sans-serif" },
  brand: { padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  userBox: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 8px' },
  avatar: { width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 },
  levelBar: { padding: '0 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  navLabel: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, color: 'rgba(255,255,255,0.3)', padding: '0 8px', marginBottom: 4 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, color: 'rgba(255,255,255,0.65)', marginBottom: 2, cursor: 'pointer', transition: 'all .15s' },
  navActive: { background: 'rgba(255,255,255,0.12)', color: '#FFFFFF' },
  mobileBar: { display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFFFF', borderTop: '1px solid #EEF0F4', zIndex: 50, flexDirection: 'row' as const, fontFamily: "'Sora',sans-serif" },
};
