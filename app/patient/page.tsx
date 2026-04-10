'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Onboarding from '@/components/patient/Onboarding';

// Banco de 30 minihábitos inspirados en Tiny Habits
const HABITS_POOL = [
  { text: 'Toma un vaso de agua ahora 💧', pts: 5 },
  { text: 'Respira profundo 3 veces, lento y pausado 🌬️', pts: 5 },
  { text: 'Anota una cosa por la que estés agradecido hoy 🙏', pts: 5 },
  { text: 'Estira el cuello y los hombros por 30 segundos 🤸', pts: 5 },
  { text: 'Sal a caminar 5 minutos afuera 🚶', pts: 10 },
  { text: 'Come una fruta o vegetal hoy 🍎', pts: 10 },
  { text: 'Aleja el teléfono 10 minutos y descansa los ojos 👁️', pts: 5 },
  { text: 'Escríbele a alguien que no hayas visto en mucho tiempo 💌', pts: 10 },
  { text: 'Después de almorzar, camina 2 minutos 🚶', pts: 5 },
  { text: 'Antes de dormir, apaga las pantallas 30 minutos 🌙', pts: 10 },
  { text: 'Toma tu medicamento a la hora indicada ⏰', pts: 10 },
  { text: 'Haz 5 respiraciones profundas antes de levantarte 🛏️', pts: 5 },
  { text: 'Después de desayunar, anota cómo amaneciste 📝', pts: 5 },
  { text: 'Bebe un vaso de agua antes de cada comida 💧', pts: 5 },
  { text: 'Párate y estírate por 1 minuto cada hora ⏱️', pts: 5 },
  { text: 'Escucha una canción que te dé energía 🎵', pts: 5 },
  { text: 'Ordena un espacio pequeño de tu casa 🏠', pts: 5 },
  { text: 'Sal afuera y recibe sol por 5 minutos ☀️', pts: 10 },
  { text: 'Escribe 3 cosas que salieron bien hoy ✨', pts: 5 },
  { text: 'Después de cenar, no comas más por 2 horas 🕐', pts: 10 },
  { text: 'Llama a alguien que quieras y salúdalo 📞', pts: 10 },
  { text: 'Haz 10 pasos en tu lugar ahora mismo 🦵', pts: 5 },
  { text: 'Prepara tu ropa para mañana antes de dormir 👔', pts: 5 },
  { text: 'Toma agua al despertar, antes del café ☕', pts: 5 },
  { text: 'Haz una pausa de 2 minutos y no pienses en nada 🧘', pts: 5 },
  { text: 'Revisa tus indicaciones médicas de hoy 💊', pts: 10 },
  { text: 'Come despacio y sin pantallas en una comida 🍽️', pts: 10 },
  { text: 'Escribe cómo te sientes físicamente hoy 📋', pts: 5 },
  { text: 'Antes de dormir, agradece algo de tu día 🌟', pts: 5 },
  { text: 'Mueve los tobillos y muñecas por 30 segundos 🔄', pts: 5 },
];

function getTodayHabit() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return HABITS_POOL[dayIndex % HABITS_POOL.length];
}

function addPoints(pts: number) {
  const stored = localStorage.getItem('mnx_user');
  const user = stored ? JSON.parse(stored) : { puntos: 0 };
  user.puntos = (user.puntos || 0) + pts;
  localStorage.setItem('mnx_user', JSON.stringify(user));
  window.dispatchEvent(new Event('mnx_update'));
  return user.puntos;
}

const MOCK_STREAK = 7;
const MOCK_PENDING = 2;

export default function PatientHome() {
  const [greeting, setGreeting] = useState('Buenos días');
  const [habitDone, setHabitDone] = useState(false);
  const [nombre, setNombre] = useState('');
  const [puntos, setPuntos] = useState(0);
  const habit = getTodayHabit();

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches');

    const stored = localStorage.getItem('mnx_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.nombre) setNombre(user.nombre.split(' ')[0]);
      if (user.puntos !== undefined) setPuntos(user.puntos);
      // Verificar si el hábito de hoy ya fue completado
      const todayKey = `habit_${Math.floor(Date.now() / 86400000)}`;
      if (user[todayKey]) setHabitDone(true);
    }
  }, []);

  async function doHabit() {
    const todayKey = `habit_${Math.floor(Date.now() / 86400000)}`;
    const stored = localStorage.getItem('mnx_user');
    const user = stored ? JSON.parse(stored) : { puntos: 0 };
    if (user[todayKey]) return; // Ya completado hoy
    user[todayKey] = true;
    user.puntos = (user.puntos || 0) + habit.pts;
    localStorage.setItem('mnx_user', JSON.stringify(user));
    window.dispatchEvent(new Event('mnx_update'));
    setPuntos(user.puntos);
    setHabitDone(true);
    try {
      const c = (await import('canvas-confetti')).default;
      c({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ['#0E8A7A', '#7DD3C8', '#1B3A6B'] });
    } catch {}
  }

  const level = puntos >= 1500 ? 'Guardián 🛡️' : puntos >= 700 ? 'Comprometido 🎯' : puntos >= 300 ? 'Activo ⚡' : puntos >= 100 ? 'Consciente 👁️' : 'Aprendiz 📖';

  return (
    <div style={s.page}>
      <Onboarding nombre={nombre || 'Paciente'} />
      <div style={s.hdr}>
        <div>
          <h1 style={s.h1}>{greeting}{nombre ? `, ${nombre}` : ''} 👋</h1>
          <p style={s.date}>{new Date().toLocaleDateString('es-PA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div style={s.puntosBox}>
          <div style={{ fontSize: 10, color: '#7B8499', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>Puntos</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1B3A6B' }}>{puntos}</div>
          <div style={{ fontSize: 11, color: '#0E8A7A' }}>{level}</div>
        </div>
      </div>

      <div style={{ ...s.habitCard, background: habitDone ? 'linear-gradient(135deg,#0E8A7A,#16A34A)' : 'linear-gradient(135deg,#1B3A6B,#2D5FA6)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>⚡ Minihábito del día</div>
        {habitDone ? (
          <div style={{ textAlign: 'center' as const, color: '#fff' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>¡Hábito completado!</div>
            <div style={{ fontSize: 13, opacity: .8 }}>+{habit.pts} puntos ganados · Total: {puntos} pts</div>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>{habit.text}</p>
            <button onClick={doHabit} style={s.habitBtn}>¡Lo hice! +{habit.pts} pts</button>
          </>
        )}
      </div>

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
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1B3A6B' }}>{puntos}</div>
          <div style={{ fontSize: 11, color: '#7B8499' }}>puntos</div>
        </div>
      </div>

      <div style={s.sectionTitle}>Acciones rápidas</div>
      <div style={s.quickGrid}>
        {[
          { href: '/patient/chat',   emoji: '💬', title: 'Hablar con Dani',  sub: 'IA 24/7' },
          { href: '/patient/diary',  emoji: '📅', title: 'Registrar hoy',    sub: 'Diario + síntomas' },
          { href: '/patient/exams',  emoji: '🧪', title: 'Mis exámenes',     sub: 'Subir resultados' },
          { href: '/patient/doctor', emoji: '🥼', title: 'Mis doctores',        sub: 'Tratamiento activo' },
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

      <Link href="/patient/upgrade" style={{ textDecoration: 'none' }}>
        <div style={s.upgradeNudge}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1B3A6B', marginBottom: 2 }}>⭐ Desbloquea el resumen mensual de Dani</div>
            <div style={{ fontSize: 12, color: '#7B8499' }}>Diario avanzado · Especialistas IA · Gráficos de tendencias</div>
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
  date: { fontSize: 12, color: '#7B8499', marginTop: 4, textTransform: 'capitalize' as const },
  puntosBox: { background: '#fff', borderRadius: 14, padding: '12px 18px', textAlign: 'center' as const, boxShadow: '0 1px 8px rgba(27,58,107,0.08)' },
  habitCard: { borderRadius: 18, padding: '20px 24px', marginBottom: 16, minHeight: 120 },
  habitBtn: { background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10, padding: '10px 20px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
  pendingBanner: { background: '#FEF3C7', border: '1.5px solid #D97706', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, color: '#92400E', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 },
  statCard: { background: '#fff', borderRadius: 14, padding: '16px 12px', textAlign: 'center' as const, boxShadow: '0 1px 6px rgba(27,58,107,0.06)' },
  sectionTitle: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: .5, color: '#7B8499', marginBottom: 12 },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  quickCard: { background: '#fff', borderRadius: 16, padding: '20px 18px', border: '1.5px solid #EEF0F4', cursor: 'pointer' },
  upgradeNudge: { background: '#EBF1FB', border: '1.5px solid #2D5FA6', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, cursor: 'pointer' },
};
