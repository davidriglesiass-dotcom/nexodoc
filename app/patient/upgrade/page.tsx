'use client';
import { useState } from 'react';
import { PLANS, PlanId } from '@/lib/plans';

export default function UpgradePage() {
  const [selected, setSelected] = useState<PlanId>('free');
  const current: string = 'free';

  return (
    <div style={s.page}>
      {/* Banner mensaje principal */}
      <div style={s.banner}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontFamily: "'Lora',serif", fontSize: 24, fontWeight: 600, color: '#1B3A6B', marginBottom: 8 }}>
          Estás disfrutando acceso completo
        </h1>
        <p style={{ fontSize: 14, color: '#7B8499', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
          Durante nuestro período de lanzamiento todos los pacientes tienen acceso gratuito a todas las funciones. Pronto habrá planes adicionales con beneficios extra.
        </p>
      </div>

      <div style={{ textAlign: 'center' as const, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: '#7B8499' }}>Así es como se verán los planes próximamente:</p>
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
              opacity: plan.id === 'free' ? 1 : 0.75,
            }}>
            {plan.id === 'plus' && (
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#1B3A6B', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 100, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
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
            {plan.id === 'free' ? (
              <div style={{ marginTop: 20, padding: '10px', background: '#DCFCE7', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#16A34A', textAlign: 'center' as const }}>
                ✓ Tu plan actual
              </div>
            ) : (
              <div style={{ marginTop: 20, padding: '10px', background: '#F8F9FB', border: '1px solid #EEF0F4', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#7B8499', textAlign: 'center' as const }}>
                🔒 Próximamente
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' as const, marginTop: 32, fontSize: 12, color: '#7B8499', lineHeight: 1.6 }}>
        Sin contratos · Sin tarjeta de crédito · Siempre transparente<br />
        ¿Preguntas? Escríbenos a soporte@minexosalud.com
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { padding: '28px 32px', maxWidth: 900, margin: '0 auto', fontFamily: "'Sora',sans-serif" },
  banner: { background: 'linear-gradient(135deg, #EBF1FB, #E0F5F2)', borderRadius: 20, padding: '32px 24px', textAlign: 'center' as const, marginBottom: 32, border: '1px solid #D5DAE4' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 },
  card: { background: '#fff', borderRadius: 20, padding: '28px 24px', border: '2px solid', cursor: 'pointer', transition: 'all .2s' },
};
