'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ indicaciones: true, citas: true, examenes: true, habito: true, dani: false });
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const Toggle = ({ k }: { k: keyof typeof notifs }) => (
    <div onClick={() => setNotifs(p => ({ ...p, [k]: !p[k] }))}
      style={{ width: 44, height: 24, borderRadius: 12, background: notifs[k] ? '#0E8A7A' : '#D5DAE4', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: notifs[k] ? 23 : 3, transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  );

  return (
    <div style={s.page}>
      <h1 style={s.h1}>⚙️ Configuración</h1>

      <div style={s.card}>
        <div style={s.cardTitle}>🔔 Notificaciones</div>
        {[
          { k: 'indicaciones', label: 'Recordatorios de medicamentos', desc: 'Te avisamos cuando es hora de tomar tus indicaciones' },
          { k: 'citas',        label: 'Recordatorios de citas',       desc: '24h y 2h antes de cada cita con tu doctor' },
          { k: 'examenes',     label: 'Renovación de exámenes',       desc: 'Cuando un examen está por vencer' },
          { k: 'habito',       label: 'Minihábitо diario',            desc: 'Recordatorio del hábito del día a las 9:00 AM' },
          { k: 'dani',         label: 'Mensajes de Dani',             desc: 'Mensajes motivacionales de tu guía de bienestar' },
        ].map(item => (
          <div key={item.k} style={s.notifRow}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#7B8499', marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle k={item.k as keyof typeof notifs} />
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>🔒 Privacidad</div>
        {[
          { label: 'Compartir datos con mi doctor', desc: 'Tu doctor puede ver tu diario de bienestar y síntomas', on: true },
          { label: 'Mostrar mi nivel en DocMonitor', desc: 'El doctor ve tu nivel de gamificación como indicador de engagement', on: true },
        ].map((item, i) => (
          <div key={i} style={s.notifRow}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: '#7B8499', marginTop: 2 }}>{item.desc}</div>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: item.on ? '#0E8A7A' : '#D5DAE4', cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: item.on ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>👤 Cuenta</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={s.btnSecondary}>Cambiar contraseña</button>
          <button style={s.btnSecondary}>Cambiar correo electrónico</button>
          <button style={{ ...s.btnSecondary, color: '#C0392B', borderColor: '#C0392B' }}>Eliminar mi cuenta</button>
        </div>
      </div>

      <button onClick={save} style={{ ...s.btnPrimary, minWidth: 180 }}>
        {saved ? '✓ Guardado' : 'Guardar cambios'}
      </button>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '28px 32px', maxWidth: 600, fontFamily: "'Sora',sans-serif" },
  h1: { fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 600, color: '#1B3A6B', marginBottom: 24 },
  card: { background: '#fff', borderRadius: 16, padding: '18px 20px', marginBottom: 16, boxShadow: '0 1px 6px rgba(27,58,107,0.07)' },
  cardTitle: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: .5, color: '#7B8499', marginBottom: 16 },
  notifRow: { display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid #EEF0F4' },
  btnPrimary: { padding: '13px 24px', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
  btnSecondary: { padding: '11px 20px', background: '#fff', color: '#3D4457', border: '1.5px solid #D5DAE4', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif", textAlign: 'left' as const },
};
