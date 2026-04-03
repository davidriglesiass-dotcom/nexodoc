'use client';
import { useState } from 'react';
import { PLANS, PlanId } from '@/lib/plans';

export default function UpgradePage() {
  const [selected, setSelected] = useState<PlanId>('plus');
  const current: PlanId = 'free'; // Mock — René reemplaza con plan real del usuario

  return (
    <div style={s.page}>
      <div style={{ textAlign: 'center' as const, marginBottom: 32 }}>
        <h1 style={s.h1}>Elige tu plan</h1>
        <p style={s.sub}>Empieza gratis. Mejora cuando quieras.</p>
      </div>

      <div style={s.grid}>
        {(Object.values(PLANS) as typeof PLANS[PlanId][]).map(plan => (
          <div key={plan.id}
            onClick={() => setSelected(plan.id)}
            style={{
              ...s.card,
              borderColor: selected === plan.id ? plan.color : '#EEF0F4',
              boxShadow: selected === plan.id ? `0 0 0 2px ${plan.color}` : 'none',
              position: 'relative',
            }}>
            {plan.id === 'plus' && (
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#1B3A6B', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1 }}>
                Más popular
              </div>
            )}
            <div style={{ fontSize: 32, marginBottom: 8 }}>{plan.emoji}</div>
            <div style={{ fontFamily: "'Lora',serif", fontSize: 20, fontWeight: 600, color: '#1B3A6B', marginBottom: 4 }}>{plan.nombre}</div>
            <div style={{ fontFamily: "'Lora',serif", fontSize: 26, fontWeight: 700, color: plan.color, marginBottom: 4 }}>{plan.precio}</div>
            <div style={{ fontSize: 12, color: '#7B8499', marginBottom: 20, lineHeight: 1.4 }}>{plan.descripcion}</div>
            <div style={{ borderTop: '1px solid #EEF0F4', paddingTop: 16 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', fontSize: 12, color: '#3D4457' }}>
                  <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            {current === plan.id ? (
              <div style={{ marginTop: 20, padding: '10px', background: '#EEF0F4', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#7B8499', textAlign: 'center' as const }}>
                Plan actual
              </div>
            ) : plan.id === 'free' ? (
              <div style={{ marginTop: 20, padding: '10px', background: '#DCFCE7', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#16A34A', textAlign: 'center' as const }}>
                ✓ Siempre gratis
              </div>
            ) : (
              <button
                onClick={() => alert('Pasarela de pago — próximamente')}
                style={{ marginTop: 20, width: '100%', padding: '12px', background: plan.id === 'plus' ? '#1B3A6B' : '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                Activar {plan.nombre}
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' as const, marginTop: 32, fontSize: 12, color: '#7B8499', lineHeight: 1.6 }}>
        Cancela cuando quieras · Sin contratos · Pago mensual<br />
        ¿Preguntas? Escríbenos a soporte@midoclink.com
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '28px 32px', maxWidth: 900, margin: '0 auto', fontFamily: "'Sora',sans-serif" },
  h1: { fontFamily: "'Lora',serif", fontSize: 30, fontWeight: 600, color: '#1B3A6B' },
  sub: { fontSize: 14, color: '#7B8499', marginTop: 8 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 },
  card: { background: '#fff', borderRadius: 20, padding: '28px 24px', border: '2px solid', cursor: 'pointer', transition: 'all .2s' },
};
