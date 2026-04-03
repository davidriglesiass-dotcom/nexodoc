// lib/plans.ts
// ─────────────────────────────────────────────
// Sistema de tiers: Free, Plus, Family
// ─────────────────────────────────────────────

export type PlanId = 'free' | 'plus' | 'family';

export interface Plan {
  id: PlanId;
  nombre: string;
  precio: string;
  precioNum: number;
  emoji: string;
  color: string;
  descripcion: string;
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    nombre: 'Free',
    precio: 'Gratis',
    precioNum: 0,
    emoji: '🌱',
    color: '#16A34A',
    descripcion: 'Todo lo esencial para conectar con tu médico',
    features: [
      'Doctores conectados ilimitados',
      'Ver y marcar indicaciones del tratamiento',
      'Diario básico: ánimo, dolor, sueño simple',
      'Chat con Dani (20 mensajes/día)',
      'Subir hasta 5 exámenes',
      'Notificaciones de citas e indicaciones',
      'Racha básica y puntos',
      'Minihábitо del día',
    ],
  },
  plus: {
    id: 'plus',
    nombre: 'Plus',
    precio: '$4.99/mes',
    precioNum: 4.99,
    emoji: '⭐',
    color: '#1B3A6B',
    descripcion: 'Conoce tu salud en profundidad',
    features: [
      'Todo lo de Free',
      'Dani ilimitado + 5 especialistas IA',
      'Diario avanzado por género',
      'Sueño detallado: hora acostarse, levantarse, veces despertado',
      'Exámenes ilimitados + historial completo',
      'Resumen mensual de salud (PDF) generado por Dani',
      'Gráficos de tendencias de síntomas',
      'Gamificación completa: retos y todos los niveles',
      'Lista de exámenes personalizada por género y edad',
    ],
  },
  family: {
    id: 'family',
    nombre: 'Family',
    precio: '$9.99/mes',
    precioNum: 9.99,
    emoji: '👨‍👩‍👧',
    color: '#7C3AED',
    descripcion: 'Cuida a toda tu familia desde un solo lugar',
    features: [
      'Todo lo de Plus',
      'Hasta 3 perfiles adicionales (hijos, padres, pareja)',
      'Vista unificada de la familia',
      'Resumen semanal por WhatsApp',
      'Exportar historia clínica completa en PDF',
      'Compartir historial con cualquier médico externo',
    ],
  },
};

// Feature gates — qué tier necesita cada feature
export const FEATURE_GATES: Record<string, PlanId> = {
  dani_unlimited:        'plus',
  especialistas_ia:      'plus',
  diario_avanzado:       'plus',
  sueno_detallado:       'plus',
  examenes_ilimitados:   'plus',
  resumen_mensual:       'plus',
  graficos_tendencias:   'plus',
  gamificacion_completa: 'plus',
  examenes_por_genero:   'plus',
  familia:               'family',
  resumen_semanal:       'family',
  exportar_pdf:          'family',
};

// Helper: ¿tiene acceso a esta feature?
export function hasAccess(userPlan: PlanId, feature: string): boolean {
  const required = FEATURE_GATES[feature];
  if (!required) return true; // feature sin gate = libre
  const order: PlanId[] = ['free', 'plus', 'family'];
  return order.indexOf(userPlan) >= order.indexOf(required);
}

// Mensajes de upgrade por feature
export const UPGRADE_MESSAGES: Record<string, { titulo: string; desc: string; plan: PlanId }> = {
  dani_unlimited: {
    titulo: 'Dani sin límites',
    desc: 'Con Plus, chatea con Dani y los 5 especialistas IA sin límite de mensajes al día.',
    plan: 'plus',
  },
  especialistas_ia: {
    titulo: 'Especialistas IA',
    desc: 'Accede a Marco (Nutrición), Luna (Salud Mental), Rio (Movimiento), Farma (Medicamentos) y Nox (Sueño).',
    plan: 'plus',
  },
  diario_avanzado: {
    titulo: 'Diario avanzado',
    desc: 'Registra síntomas específicos según tu género, energía, estrés e hidratación diaria.',
    plan: 'plus',
  },
  sueno_detallado: {
    titulo: 'Seguimiento de sueño',
    desc: 'Registra hora que te acostaste, que te levantaste y cuántas veces te despertaste. Dani analiza tu patrón.',
    plan: 'plus',
  },
  examenes_ilimitados: {
    titulo: 'Exámenes ilimitados',
    desc: 'Sube todos tus resultados sin límite y accede a tu historial completo.',
    plan: 'plus',
  },
  resumen_mensual: {
    titulo: 'Resumen mensual de Dani',
    desc: 'El 1 de cada mes recibes un PDF personalizado con tu evolución: sueño, dolor, adherencia y más.',
    plan: 'plus',
  },
  graficos_tendencias: {
    titulo: 'Gráficos de tendencias',
    desc: 'Ve cómo evolucionó tu dolor, sueño y bienestar en los últimos 30 y 90 días.',
    plan: 'plus',
  },
  familia: {
    titulo: 'Modo familia',
    desc: 'Agrega hasta 3 perfiles adicionales y cuida a tus hijos, padres o pareja desde un solo lugar.',
    plan: 'family',
  },
  resumen_semanal: {
    titulo: 'Resumen semanal por WhatsApp',
    desc: 'Recibe cada semana un resumen de tu salud directamente en WhatsApp.',
    plan: 'family',
  },
};
