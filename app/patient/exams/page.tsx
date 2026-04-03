'use client';
import { useState } from 'react';
import UpgradeModal from '@/components/patient/UpgradeModal';
import { hasAccess } from '@/lib/plans';

const USER_PLAN = 'free';
const USER_GENDER = 'femenino';
const USER_AGE = 38;

const EXAMS_MUJER = [
  { id:1,  nombre:'Hemograma Completo',           icono:'🩸', frecuencia:'Anual',            desc:'Análisis general de sangre' },
  { id:2,  nombre:'Perfil Lipídico',              icono:'💉', frecuencia:'Anual',            desc:'Colesterol HDL, LDL y triglicéridos' },
  { id:3,  nombre:'Glicemia en ayunas',           icono:'🍬', frecuencia:'Anual',            desc:'Control de azúcar en sangre' },
  { id:4,  nombre:'Perfil Tiroideo (TSH)',         icono:'🦋', frecuencia:'Anual',            desc:'Función de la glándula tiroides' },
  { id:5,  nombre:'Citología (Papanicolaou)',      icono:'🔬', frecuencia:'Anual',            desc:'Detección precoz de cáncer cervical' },
  { id:6,  nombre:'Mamografía',                   icono:'🩻', frecuencia:'Anual (40+)',      desc:'Detección de cáncer de mama', edadMin:40 },
  { id:7,  nombre:'Perfil Hormonal (FSH/LH/E2)',  icono:'⚗️', frecuencia:'Según indicación', desc:'Niveles hormonales — solicitado por tu ginecólogo' },
  { id:8,  nombre:'Densitometría Ósea',           icono:'🦴', frecuencia:'Cada 2 años (50+)',desc:'Prevención de osteoporosis', edadMin:50 },
  { id:9,  nombre:'Examen de Orina',              icono:'🧫', frecuencia:'Anual',            desc:'Análisis general de orina' },
];

const EXAMS_HOMBRE = [
  { id:1,  nombre:'Hemograma Completo',           icono:'🩸', frecuencia:'Anual',            desc:'Análisis general de sangre' },
  { id:2,  nombre:'Perfil Lipídico',              icono:'💉', frecuencia:'Anual',            desc:'Colesterol HDL, LDL y triglicéridos' },
  { id:3,  nombre:'Glicemia en ayunas',           icono:'🍬', frecuencia:'Anual',            desc:'Control de azúcar en sangre' },
  { id:4,  nombre:'Perfil Tiroideo (TSH)',         icono:'🦋', frecuencia:'Anual',            desc:'Función de la glándula tiroides' },
  { id:5,  nombre:'PSA — Antígeno Prostático',    icono:'🔵', frecuencia:'Anual (45+)',      desc:'Detección temprana de problemas de próstata', edadMin:45 },
  { id:6,  nombre:'Testosterona Total',           icono:'⚗️', frecuencia:'Según indicación', desc:'Niveles hormonales masculinos' },
  { id:7,  nombre:'Electrocardiograma (ECG)',     icono:'💓', frecuencia:'Anual (40+)',      desc:'Salud del corazón', edadMin:40 },
  { id:8,  nombre:'Examen de Orina',              icono:'🧫', frecuencia:'Anual',            desc:'Análisis general de orina' },
];

export default function ExamsPage() {
  const [upgradeFeature, setUpgradeFeature] = useState<string|null>(null);
  const [uploading, setUploading] = useState<number|null>(null);
  const [shared, setShared] = useState<number|null>(null);
  const [uploaded, setUploaded] = useState<{id:number;fecha:string;vencimiento:string;compartido:boolean}[]>([
    { id:1, fecha:'2026-02-15', vencimiento:'2027-02-15', compartido:true },
  ]);

  const EXAMS = USER_GENDER === 'femenino' ? EXAMS_MUJER : EXAMS_HOMBRE;
  const FREE_LIMIT = 5;
  const uploadedCount = uploaded.length;
  const canUploadFree = uploadedCount < FREE_LIMIT;

  function isUploaded(id:number) { return uploaded.find(u=>u.id===id); }
  function isExpired(v:string) { return new Date(v)<new Date(); }
  function isExpiring(v:string) { return Math.floor((new Date(v).getTime()-Date.now())/86400000)<30; }

  function handleUpload(exam:{id:number;nombre:string}) {
    if (!canUploadFree && !hasAccess(USER_PLAN as any,'examenes_ilimitados')) {
      setUpgradeFeature('examenes_ilimitados'); return;
    }
    setUploading(exam.id);
    setTimeout(()=>{
      const hoy = new Date().toISOString().split('T')[0];
      const ven = new Date(Date.now()+365*86400000).toISOString().split('T')[0];
      setUploaded(p=>[...p.filter(u=>u.id!==exam.id),{id:exam.id,fecha:hoy,vencimiento:ven,compartido:false}]);
      setUploading(null);
    },1200);
  }

  function handleShare(id:number) {
    setShared(id);
    setUploaded(p=>p.map(u=>u.id===id?{...u,compartido:true}:u));
    setTimeout(()=>setShared(null),2000);
  }

  const anyExpiring = uploaded.some(u=>isExpiring(u.vencimiento)||isExpired(u.vencimiento));

  return (
    <div style={s.page}>
      {upgradeFeature && <UpgradeModal feature={upgradeFeature} onClose={()=>setUpgradeFeature(null)} />}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}>
        <div>
          <h1 style={s.h1}>🧪 Mis Exámenes</h1>
          <p style={s.sub}>Lista personalizada para {USER_GENDER === 'femenino' ? 'mujeres' : 'hombres'} · {USER_AGE} años</p>
        </div>
        {!hasAccess(USER_PLAN as any,'examenes_ilimitados') && (
          <div style={{background:'#EBF1FB',borderRadius:10,padding:'8px 14px',textAlign:'center' as const}}>
            <div style={{fontSize:18,fontWeight:700,color:'#1B3A6B'}}>{uploadedCount}/{FREE_LIMIT}</div>
            <div style={{fontSize:10,color:'#7B8499'}}>archivos Free</div>
          </div>
        )}
      </div>

      {anyExpiring && (
        <div style={s.alertBox}>
          <span style={{fontSize:20}}>⚠️</span>
          <div>
            <b style={{fontSize:14}}>Tienes exámenes por renovar</b>
            <div style={{fontSize:12,opacity:.9}}>Pide cita con tu doctor para actualizarlos.</div>
          </div>
        </div>
      )}

      {/* Barra de progreso de exámenes */}
      <div style={s.progressCard}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
          <span style={{fontSize:13,fontWeight:600,color:'#1B3A6B'}}>Exámenes al día</span>
          <span style={{fontSize:13,fontWeight:700,color:'#0E8A7A'}}>{uploaded.filter(u=>!isExpired(u.vencimiento)).length}/{EXAMS.length}</span>
        </div>
        <div style={{height:8,background:'#EEF0F4',borderRadius:8,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(uploaded.filter(u=>!isExpired(u.vencimiento)).length/EXAMS.length)*100}%`,background:'linear-gradient(to right,#0E8A7A,#16A34A)',borderRadius:8,transition:'width .4s'}} />
        </div>
      </div>

      {/* Lista de exámenes */}
      <div style={s.sectionLabel}>Recomendados para ti</div>
      <div style={s.grid}>
        {EXAMS.map(exam => {
          const up = isUploaded(exam.id);
          const expired = up && isExpired(up.vencimiento);
          const expiring = up && !expired && isExpiring(up.vencimiento);
          const ageOk = !('edadMin' in exam) || USER_AGE >= (exam as any).edadMin;

          return (
            <div key={exam.id} style={{...s.examCard, borderColor:up?(expired?'#C0392B':expiring?'#D97706':'#0E8A7A'):'#EEF0F4', opacity:ageOk?1:0.6}}>
              <div style={{display:'flex',gap:12,marginBottom:10}}>
                <div style={{fontSize:26,flexShrink:0}}>{exam.icono}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:'#111827'}}>{exam.nombre}</div>
                  <div style={{fontSize:11,color:'#7B8499',marginTop:2}}>{exam.desc}</div>
                  <div style={{fontSize:10,color:'#7B8499',marginTop:2}}>
                    📅 {exam.frecuencia}
                    {'edadMin' in exam && USER_AGE < (exam as any).edadMin && ` · Desde los ${(exam as any).edadMin} años`}
                  </div>
                </div>
              </div>

              {up ? (
                <div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap' as const,marginBottom:8}}>
                    <span style={{...s.badge,background:expired?'#FDEAEA':expiring?'#FEF3C7':'#E0F5F2',color:expired?'#C0392B':expiring?'#92400E':'#0E8A7A'}}>
                      {expired?'❌ Vencido':expiring?'⚠️ Por vencer':'✓ Al día'}
                    </span>
                    <span style={{...s.badge,background:up.compartido?'#E0F5F2':'#EEF0F4',color:up.compartido?'#0E8A7A':'#7B8499'}}>
                      {up.compartido?'📤 Compartido':'🔒 Solo yo'}
                    </span>
                  </div>
                  <div style={{fontSize:11,color:'#7B8499',marginBottom:10}}>Subido el {up.fecha}</div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>handleUpload(exam)} style={s.btnSec} disabled={uploading===exam.id}>
                      {uploading===exam.id?'Subiendo...':'🔄 Renovar'}
                    </button>
                    {!up.compartido && (
                      <button onClick={()=>handleShare(exam.id)} style={s.btnPri}>
                        {shared===exam.id?'✓ Listo':'📤 Compartir'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button onClick={()=>handleUpload(exam)} disabled={uploading===exam.id||!ageOk}
                  style={{...s.btnUpload,opacity:ageOk?1:0.5}}>
                  {!ageOk ? `Disponible desde los ${(exam as any).edadMin} años` : uploading===exam.id ? '⏳ Subiendo...' : '⬆️ Subir resultado'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Subir manualmente */}
      <div style={s.sectionLabel}>Subir otro examen</div>
      <div style={s.uploadBox}>
        <div style={{fontSize:32,marginBottom:12}}>📎</div>
        <div style={{fontWeight:600,fontSize:14,color:'#1B3A6B',marginBottom:6}}>¿Tienes un examen que no está en la lista?</div>
        <p style={{fontSize:13,color:'#7B8499',marginBottom:16,lineHeight:1.5}}>PDF o imagen de cualquier resultado de laboratorio.</p>
        {canUploadFree || hasAccess(USER_PLAN as any,'examenes_ilimitados')
          ? <button style={s.btnPri}>Seleccionar archivo</button>
          : <button style={s.btnPri} onClick={()=>setUpgradeFeature('examenes_ilimitados')}>🔒 Activar Plus para subir más</button>}
        {!hasAccess(USER_PLAN as any,'examenes_ilimitados') && (
          <p style={{fontSize:11,color:'#7B8499',marginTop:10}}>{FREE_LIMIT-uploadedCount} espacios restantes en Free</p>
        )}
      </div>
    </div>
  );
}

const s: Record<string,React.CSSProperties> = {
  page: {padding:'28px 32px',maxWidth:900,fontFamily:"'Sora',sans-serif"},
  h1: {fontFamily:"'Lora',serif",fontSize:26,fontWeight:600,color:'#1B3A6B'},
  sub: {fontSize:13,color:'#7B8499',marginTop:4},
  alertBox: {background:'#FEF3C7',border:'1.5px solid #D97706',borderRadius:14,padding:'14px 18px',display:'flex',gap:12,alignItems:'flex-start',marginBottom:20,color:'#92400E'},
  progressCard: {background:'#fff',borderRadius:14,padding:'16px 18px',marginBottom:24,boxShadow:'0 1px 6px rgba(27,58,107,0.07)'},
  sectionLabel: {fontSize:11,fontWeight:700,textTransform:'uppercase' as const,letterSpacing:.5,color:'#7B8499',marginBottom:14},
  grid: {display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,marginBottom:32},
  examCard: {background:'#fff',borderRadius:14,padding:16,border:'1.5px solid',boxShadow:'0 1px 4px rgba(27,58,107,0.05)'},
  badge: {fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:100},
  btnUpload: {width:'100%',padding:'10px',background:'#EBF1FB',border:'1.5px dashed #2D5FA6',borderRadius:8,color:'#1B3A6B',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"},
  btnPri: {padding:'8px 14px',background:'#1B3A6B',color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'Sora',sans-serif"},
  btnSec: {padding:'8px 14px',background:'#EEF0F4',color:'#3D4457',border:'none',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"},
  uploadBox: {background:'#fff',borderRadius:16,padding:28,textAlign:'center' as const,border:'2px dashed #D5DAE4'},
};
