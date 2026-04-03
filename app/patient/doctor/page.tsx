'use client';
import { useState } from 'react';

const DOCTORS = [
  { id: '1', nombre: 'David', apellido: 'Iglesias', especialidad: 'Ginecología y Obstetricia', clinica: 'Clínica MiDocLink', initials: 'DI', online: true },
];

const TREATMENT = [
  { id: 1, desc: 'Amitriptilina 25mg', dosis: '1 pastilla', hora: '22:00', cumplida: false, notas: 'Antes de dormir' },
  { id: 2, desc: 'Angeliq', dosis: '1 pastilla', hora: '08:00', cumplida: true, notas: 'En ayunas' },
  { id: 3, desc: 'Eliminar cigarro', dosis: '—', hora: '', cumplida: false, notas: '' },
];

const DANI_RESPONSES: Record<string, string> = {
  default: 'Entiendo cómo te sientes. Antes de enviarlo a tu doctor, cuéntame un poco más: ¿desde cuándo tienes este síntoma? ¿Es constante o va y viene?',
  dolor: 'El dolor que describes merece atención. Si es mayor a 7/10 o dura más de 24 horas, te recomiendo enviárselo a tu doctor de inmediato. ¿Quieres que lo haga?',
  nausea: 'Las náuseas pueden tener varias causas. Si están relacionadas con un medicamento nuevo o llevan más de 2 días, es importante que tu doctor lo sepa. ¿Envío el reporte?',
  cabeza: 'El dolor de cabeza frecuente puede estar relacionado con tu tratamiento actual. ¿Has tomado tus medicamentos hoy según lo indicado? Si el dolor es severo, debo notificar a tu doctor.',
  cansancio: 'El cansancio puede ser parte de tu proceso de tratamiento. ¿Cómo has dormido últimamente? Si el cansancio es extremo o nuevo, deberíamos informar a tu doctor.',
};

function getDaniResponse(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('dolor')) return DANI_RESPONSES.dolor;
  if (t.includes('náusea') || t.includes('nausea') || t.includes('vómito')) return DANI_RESPONSES.nausea;
  if (t.includes('cabeza')) return DANI_RESPONSES.cabeza;
  if (t.includes('cansancio') || t.includes('cansado') || t.includes('fatiga')) return DANI_RESPONSES.cansancio;
  return DANI_RESPONSES.default;
}

export default function DoctorPage() {
  const [activeDoc, setActiveDoc] = useState(DOCTORS[0].id);
  const [treatment, setTreatment] = useState(TREATMENT);
  const [sintoma, setSintoma] = useState('');
  const [daniResp, setDaniResp] = useState('');
  const [showDani, setShowDani] = useState(false);
  const [sentToDoctor, setSentToDoctor] = useState(false);
  const [loading, setLoading] = useState(false);

  const doc = DOCTORS.find(d => d.id === activeDoc)!;
  const done = treatment.filter(t => t.cumplida).length;

  function mark(id: number) {
    setTreatment(p => p.map(t => t.id === id ? { ...t, cumplida: true } : t));
  }

  async function askDani() {
    if (!sintoma.trim()) return;
    setLoading(true);
    setShowDani(false);
    // Simular Dani — René conecta con /api/ai/chat
    setTimeout(() => {
      setDaniResp(getDaniResponse(sintoma));
      setShowDani(true);
      setLoading(false);
    }, 1000);
  }

  async function sendToDoctor() {
    setSentToDoctor(true);
    setSintoma('');
    setShowDani(false);
    // René: POST /api/patient/report-symptom { doctor_id: activeDoc, contenido: sintoma }
  }

  return (
    <div style={s.page}>
      <h1 style={s.h1}>🩺 Mi Doctor</h1>
      <p style={s.sub}>Tratamiento activo y comunicación con tu especialista</p>

      {/* Selector de doctores */}
      {DOCTORS.length > 1 && (
        <div style={s.docTabs}>
          {DOCTORS.map(d => (
            <button key={d.id} onClick={() => setActiveDoc(d.id)}
              style={{ ...s.docTab, ...(activeDoc === d.id ? s.docTabActive : {}) }}>
              <div style={{ ...s.docAv, width: 28, height: 28, fontSize: 11 }}>{d.initials}</div>
              Dr. {d.apellido}
            </button>
          ))}
        </div>
      )}

      <div style={s.twoCol}>
        {/* Columna izquierda */}
        <div>
          {/* Doctor card */}
          <div style={s.docCard}>
            <div style={s.docAv}>{doc.initials}</div>
            <div>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 600, color: '#1B3A6B' }}>Dr. {doc.nombre} {doc.apellido}</div>
              <div style={{ fontSize: 12, color: '#7B8499' }}>{doc.especialidad}</div>
              <div style={{ fontSize: 12, color: '#7B8499' }}>{doc.clinica}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: doc.online ? '#16A34A' : '#D5DAE4' }} />
                <span style={{ fontSize: 11, color: doc.online ? '#16A34A' : '#7B8499', fontWeight: 600 }}>
                  {doc.online ? 'En línea' : 'No disponible'}
                </span>
              </div>
            </div>
          </div>

          {/* Tratamiento */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={s.cardLabel}>💊 Tratamiento activo</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0E8A7A' }}>{done}/{treatment.length} hoy</span>
            </div>
            {/* Progress */}
            <div style={{ height: 6, background: '#EEF0F4', borderRadius: 6, marginBottom: 14, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(done / treatment.length) * 100}%`, background: 'linear-gradient(to right,#0E8A7A,#16A34A)', borderRadius: 6, transition: 'width .3s' }} />
            </div>
            {treatment.map(t => (
              <div key={t.id} style={{ ...s.treatItem, background: t.cumplida ? '#E0F5F2' : '#fff' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: t.cumplida ? '#7B8499' : '#111827', textDecoration: t.cumplida ? 'line-through' : 'none' }}>{t.desc}</div>
                  <div style={{ fontSize: 11, color: '#7B8499', marginTop: 2 }}>
                    {t.dosis !== '—' && `${t.dosis}`}{t.hora && ` · ${t.hora}`}{t.notas && ` · ${t.notas}`}
                  </div>
                </div>
                {t.cumplida
                  ? <span style={s.doneBadge}>✓ Listo</span>
                  : <button style={s.markBtn} onClick={() => mark(t.id)}>Marcar</button>}
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha — síntomas + Dani */}
        <div>
          <div style={s.card}>
            <div style={s.cardLabel}>🤒 Reportar síntoma o reacción</div>
            <p style={{ fontSize: 13, color: '#7B8499', marginBottom: 14, lineHeight: 1.5 }}>
              Describe cómo te sientes. <b style={{ color: '#0E8A7A' }}>Dani</b> te dará un primer apoyo y, si es necesario, notificará a tu doctor.
            </p>

            <textarea
              style={s.ta}
              placeholder="Ej: Tengo dolor de cabeza desde esta mañana, también siento náuseas..."
              value={sintoma}
              onChange={e => setSintoma(e.target.value)}
              rows={4}
            />

            <button onClick={askDani} disabled={!sintoma.trim() || loading}
              style={{ ...s.markBtn, width: '100%', padding: '12px', marginTop: 10, background: sintoma.trim() ? 'linear-gradient(135deg,#0E8A7A,#16A34A)' : '#D5DAE4', borderRadius: 10, fontSize: 14 }}>
              {loading ? '✨ Dani está pensando...' : '✨ Consultar con Dani primero'}
            </button>

            {/* Respuesta de Dani */}
            {showDani && daniResp && (
              <div style={s.daniBox}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0E8A7A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</div>
                  <b style={{ fontSize: 13, color: '#0E8A7A' }}>Dani</b>
                </div>
                <p style={{ fontSize: 14, color: '#111827', lineHeight: 1.6, marginBottom: 16 }}>{daniResp}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  <button onClick={sendToDoctor}
                    style={{ padding: '10px 16px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                    📤 Enviar al Dr. {doc.apellido}
                  </button>
                  <button onClick={() => setShowDani(false)}
                    style={{ padding: '10px 16px', background: '#EEF0F4', color: '#3D4457', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                    Está bien, no es urgente
                  </button>
                </div>
              </div>
            )}

            {sentToDoctor && (
              <div style={{ background: '#DCFCE7', border: '1px solid #16A34A', borderRadius: 10, padding: '12px 16px', marginTop: 12, fontSize: 13, fontWeight: 600, color: '#166534', textAlign: 'center' as const }}>
                ✓ El Dr. {doc.apellido} recibió tu reporte. Te contactará pronto.
              </div>
            )}
          </div>

          {/* Próxima cita */}
          <div style={{ ...s.card, background: 'linear-gradient(135deg,#1B3A6B,#2D5FA6)', color: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: .5, opacity: .7, marginBottom: 8 }}>Próxima cita</div>
            <div style={{ fontFamily: "'Lora',serif", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Miércoles 9 de Abril</div>
            <div style={{ fontSize: 13, opacity: .8 }}>9:00 AM · 45 min · Seguimiento</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>Confirmar</button>
              <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>Reagendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '28px 32px', maxWidth: 1000, fontFamily: "'Sora',sans-serif" },
  h1: { fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 600, color: '#1B3A6B', marginBottom: 4 },
  sub: { fontSize: 13, color: '#7B8499', marginBottom: 24 },
  docTabs: { display: 'flex', gap: 8, marginBottom: 20 },
  docTab: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #EEF0F4', background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Sora',sans-serif", color: '#3D4457' },
  docTabActive: { background: '#EBF1FB', borderColor: '#1B3A6B', color: '#1B3A6B', fontWeight: 700 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' },
  docCard: { background: '#fff', borderRadius: 16, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16, boxShadow: '0 1px 6px rgba(27,58,107,0.07)' },
  docAv: { width: 48, height: 48, borderRadius: '50%', background: '#1B3A6B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0, fontFamily: "'Lora',serif" },
  card: { background: '#fff', borderRadius: 16, padding: '18px 20px', marginBottom: 16, boxShadow: '0 1px 6px rgba(27,58,107,0.07)' },
  cardLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: .5, color: '#7B8499', marginBottom: 0 },
  treatItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 10, marginBottom: 8, border: '1px solid #EEF0F4' },
  doneBadge: { padding: '5px 10px', background: '#E0F5F2', color: '#0E8A7A', borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' as const },
  markBtn: { padding: '8px 14px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif", whiteSpace: 'nowrap' as const },
  ta: { width: '100%', padding: '12px', border: '2px solid #EEF0F4', borderRadius: 10, fontSize: 13, fontFamily: "'Sora',sans-serif", color: '#111827', background: '#F8F9FB', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  daniBox: { background: '#E0F5F2', border: '1.5px solid #0E8A7A', borderRadius: 14, padding: '16px', marginTop: 14 },
};
