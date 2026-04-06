'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  nombre?: string;
}

const ANIMO_EMOJIS = [
  { emoji: '😢', label: 'Mal' },
  { emoji: '😕', label: 'Regular' },
  { emoji: '😐', label: 'Normal' },
  { emoji: '🙂', label: 'Bien' },
  { emoji: '😄', label: '¡Excelente!' },
];

const TOUR_STEPS = [
  {
    icon: '🩺',
    title: 'Mi Doctor',
    text: 'Aquí ves tu tratamiento activo. Marca las indicaciones que cumpliste y tu doctor lo ve al instante.',
    color: '#1B3A6B',
    bg: '#EBF1FB',
    href: '/patient/doctor',
  },
  {
    icon: '📅',
    title: 'Mi Diario',
    text: 'Registra cómo te sientes cada día — ánimo, dolor, sueño. Dani aprende de ti y mejora sus consejos.',
    color: '#0E8A7A',
    bg: '#E0F5F2',
    href: '/patient/diary',
  },
  {
    icon: '💬',
    title: 'Dani IA',
    text: 'Chatea conmigo cuando quieras. Estoy aquí 24/7 para acompañarte entre consultas.',
    color: '#7C3AED',
    bg: '#F5F3FF',
    href: '/patient/chat',
  },
  {
    icon: '🧪',
    title: 'Mis Exámenes',
    text: 'Sube tus resultados de laboratorio y compártelos con tu doctor al instante desde el celular.',
    color: '#D97706',
    bg: '#FEF3C7',
    href: '/patient/exams',
  },
];

export default function Onboarding({ nombre = 'Paciente' }: Props) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<'welcome' | 'tour' | 'mood'>('welcome');
  const [tourIdx, setTourIdx] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('nexodoc_onboarding_done');
    if (!done) {
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  function finish() {
    localStorage.setItem('nexodoc_onboarding_done', '1');
    setVisible(false);
  }

  function skipAll() {
    localStorage.setItem('nexodoc_onboarding_done', '1');
    setVisible(false);
  }

  function startTour() {
    setStep('tour');
    setTourIdx(0);
  }

  function nextTour() {
    if (tourIdx < TOUR_STEPS.length - 1) {
      setTourIdx(i => i + 1);
    } else {
      setStep('mood');
    }
  }

  function saveMood() {
    if (selectedMood === null) return;
    setMoodSaved(true);
    setTimeout(() => finish(), 1800);
  }

  if (!visible) return null;

  const currentStep = TOUR_STEPS[tourIdx];

  return (
    <div style={s.overlay}>

      {/* ── BIENVENIDA ── */}
      {step === 'welcome' && (
        <div style={s.card}>
          {/* Hero */}
          <div style={s.hero}>
            <div style={s.daniAvatar}>✨</div>
            <div style={s.heroTitle}>
              ¡Hola, {nombre}! 👋
            </div>
            <div style={s.heroSub}>
              Soy <strong style={{ color: '#7DD3C8' }}>Dani</strong>, tu guía de salud personal.<br />
              Te muestro NexoDoc en 30 segundos.
            </div>
          </div>

          {/* Features grid */}
          <div style={s.body}>
            <div style={s.featGrid}>
              {TOUR_STEPS.map(t => (
                <div key={t.title} style={{ ...s.featItem, background: t.bg }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: t.color }}>{t.title}</span>
                </div>
              ))}
            </div>

            <button style={s.btnPrimary} onClick={startTour}>
              Ver el tour rápido →
            </button>
            <button style={s.btnSkip} onClick={skipAll}>
              Saltar — explorar solo
            </button>
          </div>
        </div>
      )}

      {/* ── TOUR ── */}
      {step === 'tour' && (
        <div style={s.card}>
          {/* Progress dots */}
          <div style={s.dots}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{
                ...s.dot,
                background: i === tourIdx ? '#1B3A6B' : i < tourIdx ? '#7DD3C8' : '#EEF0F4',
                width: i === tourIdx ? 24 : 8,
              }} />
            ))}
          </div>

          {/* Step hero */}
          <div style={{ ...s.tourHero, background: `linear-gradient(135deg, ${currentStep.color}, ${currentStep.color}CC)` }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{currentStep.icon}</div>
            <div style={s.tourTitle}>{currentStep.title}</div>
          </div>

          <div style={s.body}>
            <p style={s.tourText}>{currentStep.text}</p>

            <div style={s.tourActions}>
              <button
                style={s.btnSecondary}
                onClick={() => router.push(currentStep.href)}>
                Ver {currentStep.title}
              </button>
              <button
                style={{ ...s.btnPrimary, flex: 1 }}
                onClick={nextTour}>
                {tourIdx < TOUR_STEPS.length - 1 ? 'Siguiente →' : 'Continuar →'}
              </button>
            </div>

            <button style={s.btnSkip} onClick={() => setStep('mood')}>
              Saltar tour
            </button>
          </div>
        </div>
      )}

      {/* ── PRIMER ESTADO DE ÁNIMO ── */}
      {step === 'mood' && (
        <div style={s.card}>
          <div style={{ ...s.hero, background: 'linear-gradient(135deg, #0E8A7A, #16A34A)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {moodSaved ? '🎉' : '💚'}
            </div>
            <div style={s.heroTitle}>
              {moodSaved ? '¡Perfecto! +15 puntos' : '¿Cómo te sientes hoy?'}
            </div>
            <div style={s.heroSub}>
              {moodSaved
                ? 'Ya registraste tu primer día. ¡Sigue así!'
                : 'Tu primer registro del diario. Es solo un segundo.'}
            </div>
          </div>

          <div style={s.body}>
            {!moodSaved ? (
              <>
                <div style={s.moodGrid}>
                  {ANIMO_EMOJIS.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedMood(i + 1)}
                      style={{
                        ...s.moodBtn,
                        borderColor: selectedMood === i + 1 ? '#0E8A7A' : '#EEF0F4',
                        background: selectedMood === i + 1 ? '#E0F5F2' : '#F8F9FB',
                        transform: selectedMood === i + 1 ? 'scale(1.08)' : 'scale(1)',
                      }}>
                      <span style={{ fontSize: 32 }}>{a.emoji}</span>
                      <span style={{ fontSize: 10, color: selectedMood === i + 1 ? '#0E8A7A' : '#9CA3AF', fontWeight: 600 }}>
                        {a.label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  style={{
                    ...s.btnPrimary,
                    background: selectedMood ? '#0E8A7A' : '#D1D5DB',
                    cursor: selectedMood ? 'pointer' : 'default',
                  }}
                  onClick={saveMood}
                  disabled={!selectedMood}>
                  Guardar y ganar 15 pts 🌱
                </button>

                <button style={s.btnSkip} onClick={finish}>
                  Ahora no
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center' as const, padding: '8px 0' }}>
                <div style={{
                  width: 64, height: 64,
                  background: '#E0F5F2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  margin: '0 auto 16px',
                }}>
                  ✓
                </div>
                <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 20 }}>
                  Ya tienes tu primer registro. Vuelve mañana<br />y Dani empezará a conocer tu patrón de salud.
                </p>
                <div style={{
                  background: '#DCFCE7',
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#16A34A',
                }}>
                  🌱 Semilla → 15 pts ganados
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(17,24,39,0.75)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backdropFilter: 'blur(6px)',
    fontFamily: "'Sora',sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: '20px 20px 0 0',
    width: '100%',
    maxWidth: 480,
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 -8px 40px rgba(27,58,107,0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  hero: {
    background: 'linear-gradient(135deg, #1B3A6B, #2D5FA6)',
    padding: '32px 28px 28px',
    textAlign: 'center',
    flexShrink: 0,
  },
  daniAvatar: {
    width: 56,
    height: 56,
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    margin: '0 auto 16px',
  },
  heroTitle: {
    fontFamily: "'Lora',serif",
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.6,
  },
  body: {
    padding: '20px 24px 28px',
    overflowY: 'auto',
    flex: 1,
  },
  featGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 20,
  },
  featItem: {
    borderRadius: 10,
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  btnPrimary: {
    width: '100%',
    padding: '13px',
    background: '#1B3A6B',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
    marginBottom: 10,
    transition: 'opacity .15s',
  },
  btnSecondary: {
    flex: 1,
    padding: '12px',
    background: '#F8F9FB',
    border: '1.5px solid #EEF0F4',
    borderRadius: 10,
    color: '#3D4457',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  btnSkip: {
    width: '100%',
    padding: '10px',
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: "'Sora',sans-serif",
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '16px 0 0',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'all .2s',
  },
  tourHero: {
    padding: '28px 24px 24px',
    textAlign: 'center',
    flexShrink: 0,
  },
  tourTitle: {
    fontFamily: "'Lora',serif",
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
  },
  tourText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 1.7,
    marginBottom: 20,
    textAlign: 'center',
  },
  tourActions: {
    display: 'flex',
    gap: 10,
    marginBottom: 10,
  },
  moodGrid: {
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodBtn: {
    flex: 1,
    padding: '10px 4px',
    borderRadius: 12,
    border: '2px solid',
    background: '#F8F9FB',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
    fontFamily: "'Sora',sans-serif",
    transition: 'all .15s',
  },
};

