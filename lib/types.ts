export interface Patient {
  id: string; name: string; initials: string; age: number; dob: string;
  gender: 'masculino' | 'femenino' | 'otro' | 'prefiero-no-decir';
  email: string; phone: string; bgColor: string; textColor: string;
  condition: string; lastVisit: string; nextAppt: string;
  status: 'active' | 'pending' | 'inactive'; hasAlert?: boolean; alertType?: 'amber' | 'red';
}
export interface Treatment {
  id: number; descripcion: string; dosis: string; frecuencia: number;
  frecuencia_unidad: 'dia' | 'semana' | 'mes'; duracion: number;
  duracion_unidad: 'dias' | 'semanas' | 'meses' | 'indefinido';
  horas: string[]; notas: string; done: boolean;
}
export interface Appointment {
  time: string; duration: string; patientId: string; patientName: string;
  reason: string; type: 'confirmed' | 'pending' | 'urgent';
  badges: { label: string; color: string; textColor: string }[]; slot: number;
}
export interface WeekDay {
  label: string; isToday: boolean;
  citas: { time: string; name: string; type: string; color: string; alert: boolean; patientId: string }[];
}
export interface Notification {
  id: string; icon: string; iconBg: string; text: string;
  boldName: string; time: string; unread: boolean; patientId: string;
}
export interface Bloqueo { tipo: 'vacacion' | 'horario'; label: string; ini: string; fin: string; }
export interface ICDCode { code: string; desc: string; }
export interface AdherenciaItem { name: string; initials: string; bg: string; textColor: string; pct: number; detail: string; }
export interface PatientUser {
  id: string; nombre: string; apellido: string; email: string; telefono?: string;
  dob?: string; genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero-no-decir';
  ciudad?: string; tipo_sangre?: string; condiciones?: string; alergias?: string;
  medicamentos?: string; cirugias?: string;
  tabaco?: 'no_fuma' | 'fumador' | 'ex_fumador';
  alcohol?: 'no_consume' | 'ocasional' | 'frecuente';
  ejercicio?: 'sedentario' | 'moderado' | 'activo';
  horas_sueno?: number; objetivos_dani?: string; notas_dani?: string; google_id?: string;
}
export interface DoctorConnection {
  id: string; nombre: string; apellido: string; especialidad: string;
  nombre_clinica: string; fecha_asignacion: string; activa: boolean;
}
export interface TreatmentItem {
  indicacion_id: number; descripcion: string; dosis: string; hora: string;
  cumplida: boolean; frecuencia: number; frecuencia_unidad: string;
  duracion: number; duracion_unidad: string; notas: string;
}
export interface DailyLog {
  fecha: string; animo?: number; dolor?: number;
  calidad_sueno?: number; horas_dormidas?: number; sintoma_libre?: string;
}
export interface StreakData {
  racha_actual: number; racha_maxima: number;
  ultima_fecha_completa?: string; dias_semana: boolean[];
}
export interface Specialist {
  id: string; nombre: string; emoji: string;
  descripcion: string; color: string; locked: boolean;
}
export interface ChatMessage { role: 'user' | 'assistant'; content: string; timestamp?: string; }
export type ViewName = 'agenda' | 'paciente' | 'pacientes' | 'reportes' | 'config' | 'nueva-paciente';
export type PatientTab = 'resumen' | 'citas' | 'historia' | 'tratamiento' | 'examenes' | 'notas';
export type ConfigSection = 'perfil' | 'horarios' | 'notificaciones' | 'impresion' | 'cuenta' | 'suscripcion';
export type AgendaMode = 'dia' | 'semana';
