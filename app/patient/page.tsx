'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MOCK_HABIT = { text: 'Toma un vaso de agua ahora 💧', pts: 5 };
const MOCK_STREAK = 7;
const MOCK_PENDING = 2;
const MOCK_PUNTOS = 120;

export default function PatientHome() {
  const [greeting, setGreeting] = useState('Buenos días');
  const [habitDone, setHabitDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches');
  }, []);

  async function doHabit() {
    setHabitDone(true);
    setShowConfetti(true);
    try {
      const c = (await import('canvas-confetti')).default;
      c({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ['#0E8A7A', '#7DD3C8', '#1B3A6B'] });
    } catch {}
    setTimeout(() => setShowConfetti(false), 2000);
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.hdr}>
        <div>
          <h1 style={s.h1}>{greeting} 👋</h1>
          <p style={s.date}>{new Date().toLocaleDateString('es-PA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div style={s.puntosBox}>
          <div style={{ fontSize: 10, color: '#7B8499', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>Puntos</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1B3A6B' }}>{MOCK_PUNTOS}</div>
          <div style={{ fontSize: 11, color: '#0E8A7A' }}>🌱 Brote</div>
        </div>
      </div>

      {/* Minihábitо del día */}
      <div style={{ ...s.habitCard, background: habitDone ? 'linear-gradient(135deg,#0E8A7A,#16A34A)' : 'linear-gradient(135deg,#1B3A6B,#2D5FA6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.6)' }}>🌱 Minihábitо del día</div>
        </div>
        {habitDone ? (
          <div style={{ textAlign: 'center' as const, color: '#fff' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>¡Hábito completado!</div>
            <div style={{ fontSize: 13, opacity: .8 }}>+{MOCK_HABIT.pts} puntos ganados</div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>{MOCK_HABIT.text}</p>
            <button onClick={doHabit} style={s.habitBtn}>
              ¡Lo hice! +{MOCK_HABIT.pts} pts
            </button>
          </>
        )}
      </div>

      {/* Banner indicaciones */}
      {MOCK_PENDING > 0 && (
        <Link href="/patient/diary" style={{ textDecoration: 'none' }}>
          <div style={s.pendingBanner}>
            <span style={{ fontSize: 20 }}>💊</span>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 14 }}>{MOCK_PENDING} indicaciones pendientes hoy</b>
              <div style={{ fontSize: 12, opacity: .8 }}>Toca para ver tu checklist</div>
            </div>
            <span>→</span>
          </div>
        </Link>
      )}

      {/* Stats row */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={{ fontSize: 28 }}>🔥</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1B3A6B' }}>{MOCK_STREAK}</div>
          <div style={{ fontSize: 11, color: '#7B8499' }}>días de racha</div>
        </div>
        <div style={s.statCard}>
          <div style={{ fontSize: 28 }}>💊</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1B3A6B' }}>78%</div>
          <div style={{ fontSize: 11, color: '#7B8499' }}>adherencia</div>
        </div>
        <div style={s.statCard}>
          <div style={{ fontSize: 28 }}>⭐</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1B3A6B' }}>{MOCK_PUNTOS}</div>
          <div style={{ fontSize: 11, color: '#7B8499' }}>puntos</div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={s.sectionTitle}>Acciones rápidas</div>
      <div style={s.quickGrid}>
        {[
          { href: '/patient/chat',   emoji: '💬', title: 'Hablar con Dani',  sub: 'IA 24/7' },
          { href: '/patient/diary',  emoji: '📅', title: 'Registrar hoy',    sub: 'Diario + síntomas' },
          { href: '/patient/exams',  emoji: '🧪', title: 'Mis exámenes',     sub: 'Subir resultados' },
          { href: '/patient/doctor', emoji: '🩺', title: 'Mi doctor',        sub: 'Tratamiento activo' },
        ].map(c => (
          <Link key={c.href} href={c.href} style={{ textDecoration: 'none' }}>
            <div style={s.quickCard}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1B3A6B', marginBottom: 2 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: '#7B8499' }}>{c.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Upgrade nudge */}
      <Link href="/patient/upgrade" style={{ textDecoration: 'none' }}>
        <div style={s.upgradeNudge}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1B3A6B', marginBottom: 2 }}>
              ⭐ Desbloquea el resumen mensual de Dani
            </div>
            <div style={{ fontSize: 12, color: '#7B8499' }}>
              Diario avanzado · Especialistas IA · Gráficos de tendencias
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>$4.99 →</div>
        </div>
      </Link>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '28px 32px', maxWidth: 720, fontFamily: "'Sora',sans-serif" },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  h1: { fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 600, color: '#1B3A6B' },
  date: { fontSize: 12, color: '#7B8499', marginTop: 4, textTransform: 'capitalize' },
  puntosBox: { background: '#fff', borderRadius: 14, padding: '12px 18px', textAlign: 'center', boxShadow: '0 1px 8px rgba(27,58,107,0.08)' },
  habitCard: { borderRadius: 18, padding: '20px 24px', marginBottom: 16, minHeight: 120 },
  habitBtn: { background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10, padding: '10px 20px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
  pendingBanner: { background: '#FEF3C7', border: '1.5px solid #D97706', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, color: '#92400E', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 },
  statCard: { background: '#fff', borderRadius: 14, padding: '16px 12px', textAlign: 'center', boxShadow: '0 1px 6px rgba(27,58,107,0.06)' },
  sectionTitle: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: '#7B8499', marginBottom: 12 },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  quickCard: { background: '#fff', borderRadius: 16, padding: '20px 18px', border: '1.5px solid #EEF0F4', cursor: 'pointer', transition: 'border-color .15s' },
  upgradeNudge: { background: '#EBF1FB', border: '1.5px solid #2D5FA6', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, cursor: 'pointer' },
};
