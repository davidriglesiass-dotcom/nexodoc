'use client';
import { useState, useEffect, useCallback } from 'react';

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
    targetId: 'tour-nav-doctor',
    title: '🩺 Mi Doctor',
    text: 'Aquí ves tu tratamiento activo. Marca las indicaciones que cumpliste — tu doctor lo ve al instante.',
  },
  {
    targetId: 'tour-nav-diary',
    title: '📅 Mi Diario',
    text: 'Registra cómo te sientes cada día. Dani aprende de ti y personaliza sus consejos.',
  },
  {
    targetId: 'tour-nav-chat',
    title: '💬 Dani IA',
    text: 'Chatea conmigo cuando quieras. Estoy aquí 24/7 entre consultas.',
  },
  {
    targetId: 'tour-nav-exams',
    title: '🧪 Mis Exámenes',
    text: 'Sube tus resultados y compártelos con tu doctor al instante desde el celular.',
  },
  {
    targetId: 'tour-nav-habits',
    title: '🌱 Minihábitо del día',
    text: 'Cada día un pequeño hábito de salud. Completarlo suma puntos y construye tu racha.',
  },
];

type Phase = 'welcome' | 'tour' | 'mood';

export default function Onboarding({ nombre = 'Paciente' }: Props) {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [visible, setVisible] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 200, left: 260 });
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('nexodoc_tour_done');
    if (!done) setTimeout(() => setVisible(true), 700);
  }, []);

  const positionTooltip = useCallback((idx: number) => {
    const step = TOUR_STEPS[idx];
    const el = document.getElementById(step.targetId);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTooltipPos({
      top: Math.min(rect.top + rect.height / 2 - 90, window.innerHeight - 220),
      left: rect.right + 20,
    });
    document.querySelectorAll('.tour-hl').forEach(e => e.classList.remove('tour-hl'));
    el.classList.add('tour-hl');
  }, []);

  useEffect(() => {
    if (phase === 'tour') positionTooltip(tourStep);
  }, [phase, tourStep, positionTooltip]);

  function startTour() {
    setPhase('tour');
    setTourStep(0);
  }

  function nextStep() {
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(s => s + 1);
    } else {
      document.querySelectorAll('.tour-hl').forEach(e => e.classList.remove('tour-hl'));
      setPhase('mood');
    }
  }

  function finish() {
    document.querySelectorAll('.tour-hl').forEach(e => e.classList.remove('tour-hl'));
    localStorage.setItem('nexodoc_tour_done', '1');
    setVisible(false);
  }

  function saveMood() {
    if (!selectedMood) return;
    setMoodSaved(true);
    setTimeout(() => finish(), 2000);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`.tour-hl { outline: 2.5px solid #7DD3C8 !important; outline-offset: 3px; border-radius: 8px !important; position: relative; z-index: 60; }`}</style>

      {/* Overlay — full for welcome/mood, lighter for tour */}
      <div style={{
        ...s.overlay,
        background: phase === 'tour' ? 'rgba(0,0,0,0.25)' : 'rgba(17,24,39,0.72)',
        pointerEvents: phase === 'tour' ? 'none' : 'auto',
      }} />

      {/* ── WELCOME ── */}
      {phase === 'welcome' && (
        <div style={s.sheet}>
          <div style={{ ...s.hero, background: 'linear-gradient(135deg,#1B3A6B,#2D5FA6)' }}>
            <div style={s.dani}>✨</div>
            <div style={s.heroTitle}>¡Hola, {nombre}! 👋</div>
            <div style={s.heroSub}>Soy <strong style={{ color: '#7DD3C8' }}>Dani</strong>, tu guía de salud. Te muestro NexoDoc en 30 segundos.</div>
          </div>
          <div style={s.body}>
            <div style={s.grid}>
              {[
                ['🩺','Mi Doctor','#EBF1FB','#1B3A6B'],
                ['📅','Mi Diario','#E0F5F2','#0E8A7A'],
                ['💬','Dani IA','#F5F3FF','#7C3AED'],
                ['🧪','Exámenes','#FEF3C7','#D97706'],
                ['🌱','Minihábitо','#DCFCE7','#16A34A'],
                ['⭐','Gamificación','#EBF1FB','#1B3A6B'],
              ].map(([icon,label,bg,color]) => (
                <div key={label as string} style={{ ...s.featItem, background: bg as string }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: color as string }}>{label}</span>
                </div>
              ))}
            </div>
            <button style={s.btnPrim} onClick={startTour}>Ver el tour →</button>
            <button style={s.btnSkip} onClick={finish}>Saltar — explorar solo</button>
          </div>
        </div>
      )}

      {/* ── TOUR TOOLTIP ── */}
      {phase === 'tour' && (
        <div style={{ ...s.tooltip, top: tooltipPos.top, left: tooltipPos.left, pointerEvents: 'auto' }}>
          <div style={s.arrow} />
          <div style={s.ttStep}>{tourStep + 1} / {TOUR_STEPS.length}</div>
          <div style={s.ttTitle}>{TOUR_STEPS[tourStep].title}</div>
          <div style={s.ttText}>{TOUR_STEPS[tourStep].text}</div>
          <div style={s.ttDots}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{
                height: 6, borderRadius: 3,
                transition: 'all .2s',
                width: i === tourStep ? 20 : 6,
                background: i === tourStep ? '#7DD3C8' : i < tourStep ? 'rgba(125,211,200,0.4)' : 'rgba(255,255,255,0.2)',
              }} />
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 12 }}>
            <button style={s.ttSkip} onClick={() => {
              document.querySelectorAll('.tour-hl').forEach(e => e.classList.remove('tour-hl'));
              setPhase('mood');
            }}>Saltar</button>
            <button style={s.ttNext} onClick={nextStep}>
              {tourStep < TOUR_STEPS.length - 1 ? 'Siguiente →' : 'Finalizar →'}
            </button>
          </div>
        </div>
      )}

      {/* ── MOOD ── */}
      {phase === 'mood' && (
        <div style={s.sheet}>
          <div style={{ ...s.hero, background: 'linear-gradient(135deg,#0E8A7A,#16A34A)' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>{moodSaved ? '🎉' : '💚'}</div>
            <div style={s.heroTitle}>{moodSaved ? '¡Perfecto! +15 puntos 🌱' : '¿Cómo te sientes hoy?'}</div>
            <div style={s.heroSub}>{moodSaved ? 'Ya tienes tu primer registro. ¡Sigue así!' : 'Tu primer registro del diario. Solo un segundo.'}</div>
          </div>
          <div style={s.body}>
            {!moodSaved ? (
              <>
                <div style={s.moodRow}>
                  {ANIMO_EMOJIS.map((a, i) => (
                    <button key={i} onClick={() => setSelectedMood(i+1)} style={{
                      ...s.moodBtn,
                      borderColor: selectedMood === i+1 ? '#0E8A7A' : '#EEF0F4',
                      background: selectedMood === i+1 ? '#E0F5F2' : '#F8F9FB',
                      transform: selectedMood === i+1 ? 'scale(1.1)' : 'scale(1)',
                    }}>
                      <span style={{ fontSize: 28 }}>{a.emoji}</span>
                      <span style={{ fontSize: 10, color: selectedMood === i+1 ? '#0E8A7A' : '#9CA3AF', fontWeight: 600 }}>{a.label}</span>
                    </button>
                  ))}
                </div>
                <button style={{ ...s.btnPrim, background: selectedMood ? '#0E8A7A' : '#D1D5DB', cursor: selectedMood ? 'pointer' : 'not-allowed' }} onClick={saveMood} disabled={!selectedMood}>
                  Guardar y ganar 15 puntos 🌱
                </button>
                <button style={s.btnSkip} onClick={finish}>Ahora no</button>
              </>
            ) : (
              <div style={{ textAlign:'center' as const, padding:'8px 0' }}>
                <div style={{ width:56,height:56,background:'#E0F5F2',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 16px',color:'#0E8A7A',fontWeight:700 }}>✓</div>
                <p style={{ fontSize:13,color:'#4B5563',lineHeight:1.7,marginBottom:16 }}>Vuelve mañana y Dani empezará a<br />conocer tu patrón de salud.</p>
                <div style={{ background:'#DCFCE7',borderRadius:10,padding:'10px 16px',fontSize:13,fontWeight:700,color:'#16A34A' }}>
                  🌱 Semilla · 15 pts ganados
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const s: Record<string,React.CSSProperties> = {
  overlay: { position:'fixed',inset:0,zIndex:55 },
  sheet: { position:'fixed',bottom:0,left:0,right:0,background:'#fff',borderRadius:'20px 20px 0 0',maxWidth:480,margin:'0 auto',zIndex:100,overflow:'hidden',boxShadow:'0 -8px 40px rgba(27,58,107,0.2)',fontFamily:"'Sora',sans-serif",maxHeight:'90vh',overflowY:'auto' as const },
  hero: { padding:'28px 24px 24px',textAlign:'center' as const },
  dani: { width:52,height:52,background:'rgba(255,255,255,0.15)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 14px' },
  heroTitle: { fontFamily:"'Lora',serif",fontSize:20,fontWeight:600,color:'#fff',marginBottom:8 },
  heroSub: { fontSize:13,color:'rgba(255,255,255,0.75)',lineHeight:1.6 },
  body: { padding:'20px 24px 32px' },
  grid: { display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:20 },
  featItem: { borderRadius:10,padding:'10px 8px',display:'flex',flexDirection:'column' as const,alignItems:'center',gap:6 },
  btnPrim: { width:'100%',padding:'13px',background:'#1B3A6B',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Sora',sans-serif",marginBottom:10 },
  btnSkip: { width:'100%',padding:'8px',background:'none',border:'none',color:'#9CA3AF',fontSize:12,cursor:'pointer',fontFamily:"'Sora',sans-serif" },
  tooltip: { position:'fixed',zIndex:200,background:'#1B3A6B',color:'#fff',borderRadius:14,padding:'16px 18px',width:260,fontFamily:"'Sora',sans-serif",boxShadow:'0 12px 40px rgba(27,58,107,0.4)' },
  arrow: { position:'absolute',left:-7,top:24,width:14,height:14,background:'#1B3A6B',transform:'rotate(45deg)',borderRadius:2 },
  ttStep: { fontSize:9,fontWeight:700,textTransform:'uppercase' as const,letterSpacing:1.5,color:'rgba(125,211,200,0.8)',marginBottom:6 },
  ttTitle: { fontSize:14,fontWeight:700,marginBottom:6,lineHeight:1.3 },
  ttText: { fontSize:12,color:'rgba(255,255,255,0.78)',lineHeight:1.5 },
  ttDots: { display:'flex',gap:5,marginTop:12,alignItems:'center' },
  ttSkip: { fontSize:11,color:'rgba(255,255,255,0.45)',background:'none',border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif",padding:0 },
  ttNext: { padding:'7px 16px',background:'rgba(125,211,200,0.2)',border:'1px solid rgba(125,211,200,0.4)',borderRadius:8,color:'#7DD3C8',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'Sora',sans-serif" },
  moodRow: { display:'flex',gap:6,justifyContent:'space-between',marginBottom:20 },
  moodBtn: { flex:1,padding:'10px 2px',borderRadius:12,border:'2px solid',cursor:'pointer',display:'flex',flexDirection:'column' as const,alignItems:'center',gap:5,fontFamily:"'Sora',sans-serif",transition:'all .15s' },
};
