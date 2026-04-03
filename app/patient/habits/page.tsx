'use client';
import { useState } from 'react';

const HABITS_POOL = [
  { text: 'Toma un vaso de agua ahora 💧', categoria: 'hidratación', pts: 5 },
  { text: 'Respira profundo 3 veces, lento y pausado 🌬️', categoria: 'bienestar', pts: 5 },
  { text: 'Anota una cosa por la que estés agradecido hoy 🙏', categoria: 'mental', pts: 5 },
  { text: 'Estira el cuello y los hombros por 30 segundos 🤸', categoria: 'movimiento', pts: 5 },
  { text: 'Sal a caminar 5 minutos afuera 🚶', categoria: 'movimiento', pts: 10 },
  { text: 'Come una fruta o vegetal hoy 🍎', categoria: 'nutrición', pts: 10 },
  { text: 'Aleja el teléfono 10 minutos y descansa los ojos 👁️', categoria: 'bienestar', pts: 5 },
  { text: 'Escríbele a alguien que no hayas visto en mucho tiempo 💌', categoria: 'social', pts: 10 },
];

const WEEK_CHALLENGE = {
  titulo: 'Reto de la semana',
  descripcion: 'Completa todas tus indicaciones médicas 5 días seguidos',
  progreso: 3,
  meta: 5,
  pts: 100,
  emoji: '💊',
};

const LEVELS = [
  { min: 0,    label: 'Semilla',  emoji: '🌰', color: '#92400E', bg: '#FEF3C7' },
  { min: 100,  label: 'Brote',    emoji: '🌱', color: '#16A34A', bg: '#DCFCE7' },
  { min: 300,  label: 'Planta',   emoji: '🪴', color: '#0E8A7A', bg: '#E0F5F2' },
  { min: 700,  label: 'Árbol',    emoji: '🌳', color: '#1B3A6B', bg: '#EBF1FB' },
  { min: 1500, label: 'Bosque',   emoji: '🌲', color: '#065F52', bg: '#D1FAE5' },
];

const HISTORY = [
  { emoji: '💧', texto: 'Vaso de agua', pts: 5, hora: 'Hoy 9:00' },
  { emoji: '💊', texto: 'Indicaciones completadas', pts: 15, hora: 'Hoy 8:30' },
  { emoji: '📅', texto: 'Diario registrado', pts: 15, hora: 'Ayer' },
  { emoji: '🔥', texto: 'Racha de 7 días', pts: 50, hora: 'Hace 2 días' },
];

export default function HabitsPage() {
  const [puntos, setPuntos] = useState(120);
  const [habitIdx] = useState(Math.floor(Date.now() / 86400000) % HABITS_POOL.length);
  const [habitDone, setHabitDone] = useState(false);
  const [animating, setAnimating] = useState(false);

  const habit = HABITS_POOL[habitIdx];
  const level = [...LEVELS].reverse().find(l => puntos >= l.min) ?? LEVELS[0];
  const nextLevel = LEVELS[LEVELS.findIndex(l => l.label === level.label) + 1];
  const progress = nextLevel ? Math.round(((puntos - level.min) / (nextLevel.min - level.min)) * 100) : 100;

  async function doHabit() {
    setAnimating(true);
    try {
      const c = (await import('canvas-confetti')).default;
      c({ particleCount: 100, spread: 70, origin: { y: 0.5 }, colors: ['#0E8A7A', '#7DD3C8', '#16A34A'] });
    } catch {}
    setTimeout(() => {
      setHabitDone(true);
      setPuntos(p => p + habit.pts);
      setAnimating(false);
    }, 400);
  }

  return (
    <div style={s.page}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={s.h1}>🌱 Minihábitо & Gamificación</h1>
        <p style={s.sub}>Pequeñas acciones que construyen grandes cambios</p>
      </div>

      <div style={s.twoCol}>
        {/* Columna izquierda */}
        <div>
          {/* Nivel actual */}
          <div style={{ ...s.levelCard, background: `linear-gradient(135deg, ${level.color}, ${level.color}CC)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 52 }}>{level.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Tu nivel</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: 28, fontWeight: 600, color: '#fff' }}>{level.label}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{puntos} puntos totales</div>
              </div>
            </div>
            {nextLevel && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                  <span>Progreso a {nextLevel.emoji} {nextLevel.label}</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 6 }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#7DD3C8', borderRadius: 6, transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                  {nextLevel.min - puntos} pts para subir de nivel
                </div>
              </div>
            )}
          </div>

          {/* Minihábitо del día */}
          <div style={s.card}>
            <div style={s.cardLabel}>✨ Minihábitо de hoy</div>
            {habitDone ? (
              <div style={{ textAlign: 'center' as const, padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <div style={{ fontFamily: "'Lora',serif", fontSize: 20, fontWeight: 600, color: '#0E8A7A', marginBottom: 6 }}>¡Excelente!</div>
                <div style={{ fontSize: 14, color: '#7B8499' }}>+{habit.pts} puntos ganados hoy</div>
                <div style={{ marginTop: 16, padding: '10px 16px', background: '#E0F5F2', borderRadius: 10, fontSize: 13, color: '#0E8A7A', fontWeight: 600 }}>
                  Nuevo total: {puntos} puntos
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: '#7B8499', marginBottom: 4 }}>Categoría: {habit.categoria}</div>
                <p style={{ fontSize: 17, fontWeight: 600, color: '#111827', lineHeight: 1.5, margin: '12px 0 20px' }}>
                  {habit.text}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#7B8499' }}>Recompensa: <b style={{ color: '#0E8A7A' }}>+{habit.pts} pts</b></span>
                  <button onClick={doHabit} disabled={animating}
                    style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#1B3A6B,#2D5FA6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                    {animating ? '✨ ...' : '¡Lo hice!'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Reto semanal */}
          <div style={s.card}>
            <div style={s.cardLabel}>🏆 Reto de la semana</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '10px 0 6px' }}>{WEEK_CHALLENGE.descripcion}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#7B8499', marginBottom: 8 }}>
              <span>Progreso: {WEEK_CHALLENGE.progreso}/{WEEK_CHALLENGE.meta} días</span>
              <span>+{WEEK_CHALLENGE.pts} pts al completar</span>
            </div>
            <div style={{ height: 10, background: '#EEF0F4', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(WEEK_CHALLENGE.progreso / WEEK_CHALLENGE.meta) * 100}%`, background: 'linear-gradient(to right,#1B3A6B,#0E8A7A)', borderRadius: 10, transition: 'width .4s' }} />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {Array.from({ length: WEEK_CHALLENGE.meta }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < WEEK_CHALLENGE.progreso ? '#0E8A7A' : '#EEF0F4' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div>
          {/* Todos los niveles */}
          <div style={s.card}>
            <div style={s.cardLabel}>🌿 Todos los niveles</div>
            {LEVELS.map((lv, i) => (
              <div key={lv.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < LEVELS.length - 1 ? '1px solid #EEF0F4' : 'none', opacity: puntos >= lv.min ? 1 : 0.4 }}>
                <div style={{ fontSize: 28 }}>{lv.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: lv.color }}>{lv.label}</div>
                  <div style={{ fontSize: 11, color: '#7B8499' }}>{lv.min} pts{LEVELS[i + 1] ? ` — ${LEVELS[i + 1].min - 1} pts` : '+'}</div>
                </div>
                {puntos >= lv.min ? (
                  level.label === lv.label ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: lv.color, background: lv.bg, padding: '3px 10px', borderRadius: 100 }}>Actual</span>
                  ) : (
                    <span style={{ fontSize: 16 }}>✅</span>
                  )
                ) : (
                  <span style={{ fontSize: 11, color: '#7B8499' }}>Bloqueado</span>
                )}
              </div>
            ))}
          </div>

          {/* Historial de puntos */}
          <div style={s.card}>
            <div style={s.cardLabel}>📊 Últimas ganancias</div>
            {HISTORY.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < HISTORY.length - 1 ? '1px solid #EEF0F4' : 'none' }}>
                <div style={{ fontSize: 20 }}>{h.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{h.texto}</div>
                  <div style={{ fontSize: 11, color: '#7B8499' }}>{h.hora}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0E8A7A' }}>+{h.pts}</span>
              </div>
            ))}
          </div>

          {/* Puntos por acción */}
          <div style={s.card}>
            <div style={s.cardLabel}>💡 ¿Cómo ganar puntos?</div>
            {[
              { emoji: '💊', accion: 'Marcar indicación cumplida', pts: '+10' },
              { emoji: '📅', accion: 'Completar diario de salud', pts: '+15' },
              { emoji: '🧪', accion: 'Subir examen de laboratorio', pts: '+25' },
              { emoji: '🌱', accion: 'Completar minihábitо del día', pts: '+5' },
              { emoji: '🔥', accion: 'Racha de 7 días', pts: '+50' },
              { emoji: '🏆', accion: 'Completar reto semanal', pts: '+100' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 5 ? '1px solid #EEF0F4' : 'none' }}>
                <span style={{ fontSize: 18 }}>{item.emoji}</span>
                <span style={{ flex: 1, fontSize: 12, color: '#3D4457' }}>{item.accion}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0E8A7A' }}>{item.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '28px 32px', maxWidth: 1000, fontFamily: "'Sora',sans-serif" },
  h1: { fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 600, color: '#1B3A6B' },
  sub: { fontSize: 13, color: '#7B8499', marginTop: 4 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' },
  levelCard: { borderRadius: 18, padding: '24px', marginBottom: 16, color: '#fff' },
  card: { background: '#fff', borderRadius: 16, padding: '18px 20px', marginBottom: 16, boxShadow: '0 1px 6px rgba(27,58,107,0.07)' },
  cardLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: .5, color: '#7B8499', marginBottom: 12 },
};
