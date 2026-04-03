'use client';
import { PLANS, UPGRADE_MESSAGES, PlanId } from '@/lib/plans';

interface Props {
  feature: string;
  onClose: () => void;
}

export default function UpgradeModal({ feature, onClose }: Props) {
  const msg = UPGRADE_MESSAGES[feature];
  if (!msg) return null;
  const plan = PLANS[msg.plan];

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ ...s.hdr, background: plan.id === 'plus' ? 'linear-gradient(135deg,#1B3A6B,#2D5FA6)' : 'linear-gradient(135deg,#7C3AED,#4F46E5)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{plan.emoji}</div>
          <div style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{msg.titulo}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{msg.desc}</div>
        </div>

        {/* Plan info */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>Plan {plan.nombre}</div>
              <div style={{ fontSize: 13, color: '#7B8499' }}>{plan.descripcion}</div>
            </div>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontFamily: "'Lora',serif", fontSize: 22, fontWeight: 700, color: plan.color }}>{plan.precio}</div>
              <div style={{ fontSize: 11, color: '#7B8499' }}>por mes</div>
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: 20 }}>
            {plan.features.slice(1).map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: i < plan.features.length - 2 ? '1px solid #EEF0F4' : 'none' }}>
                <span style={{ color: plan.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: '#3D4457' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button style={{ ...s.cta, background: plan.id === 'plus' ? '#1B3A6B' : '#7C3AED' }}
            onClick={() => alert('Pasarela de pago — próximamente. Por ahora disfruta el demo gratuito.')}>
            Activar {plan.nombre} — {plan.precio}
          </button>
          <button style={s.skip} onClick={onClose}>Continuar con Free</button>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' },
  modal: { background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto' as const, fontFamily: "'Sora',sans-serif" },
  hdr: { padding: '28px 24px 24px', textAlign: 'center' as const },
  cta: { width: '100%', padding: '14px', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif", marginBottom: 10 },
  skip: { width: '100%', padding: '12px', border: 'none', borderRadius: 12, background: '#F8F9FB', color: '#7B8499', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
};
