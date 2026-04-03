'use client';
import { useState } from 'react';
import { PatientUser } from '@/lib/types';

const BT = ['No sabe','A+','A-','B+','B-','AB+','AB-','O+','O-'];
const SECS = ['Personal','Médico','Hábitos','Para Dani'];
const MOCK: Partial<PatientUser> = { nombre:'Alejandra', apellido:'Melo', email:'alejandra@melo.com', telefono:'+507 6XXX-XXXX', ciudad:'Ciudad de Panamá', genero:'femenino', dob:'1988-06-15', tipo_sangre:'O+' };

export default function ProfilePage() {
  const [sec, setSec] = useState(0);
  const [p, setP] = useState<Partial<PatientUser>>(MOCK);
  const [saved, setSaved] = useState(false);

  const upd = (k:keyof PatientUser,v:string) => setP(prev=>({...prev,[k]:v}));

  async function save() {
    setSaved(true);
    // fetch('/api/patient/profile',{method:'PUT',body:JSON.stringify(p)})
    setTimeout(()=>setSaved(false),2500);
  }

  const inp: React.CSSProperties = {width:'100%',padding:'11px 14px',border:'2px solid #EEF0F4',borderRadius:10,fontSize:14,fontFamily:"'Sora',sans-serif",color:'#111827',background:'#F8F9FB',outline:'none',boxSizing:'border-box' as const};
  const lbl: React.CSSProperties = {display:'block',fontSize:11,fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'.4px',color:'#3D4457',marginBottom:6};
  const fd: React.CSSProperties = {marginBottom:16};
  const g2: React.CSSProperties = {display:'grid',gridTemplateColumns:'1fr 1fr',gap:12};

  return (
    <div style={{minHeight:'100vh',background:'#F8F9FB',maxWidth:480,margin:'0 auto',fontFamily:"'Sora',sans-serif"}}>
      <div style={{background:'linear-gradient(135deg,#1B3A6B,#2D5FA6)',padding:'28px 20px 20px',textAlign:'center' as const}}>
        <a href="/patient" style={{fontSize:13,color:'rgba(255,255,255,0.7)',textDecoration:'none',display:'block',marginBottom:16,textAlign:'left' as const}}>← Inicio</a>
        <div style={{width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,0.2)',color:'#fff',fontSize:28,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontFamily:"'Lora',serif"}}>
          {p.nombre?.[0]}{p.apellido?.[0]}
        </div>
        <b style={{fontFamily:"'Lora',serif",fontSize:20,color:'#fff'}}>{p.nombre} {p.apellido}</b>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',marginTop:4}}>{p.email}</div>
      </div>

      <div style={{display:'flex',background:'#fff',borderBottom:'1px solid #EEF0F4'}}>
        {SECS.map((sec_name,i)=>(
          <button key={sec_name} onClick={()=>setSec(i)} style={{flex:1,padding:'12px 4px',border:'none',background:'transparent',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif",color:sec===i?'#1B3A6B':'#7B8499',borderBottom:sec===i?'2px solid #1B3A6B':'2px solid transparent'}}>
            {sec_name}
          </button>
        ))}
      </div>

      <div style={{padding:'24px 20px'}}>
        {sec===0 && <>
          <div style={g2}>
            <div style={fd}><label style={lbl}>Nombre</label><input style={inp} value={p.nombre??''} onChange={e=>upd('nombre',e.target.value)} /></div>
            <div style={fd}><label style={lbl}>Apellido</label><input style={inp} value={p.apellido??''} onChange={e=>upd('apellido',e.target.value)} /></div>
          </div>
          <div style={fd}><label style={lbl}>Correo electrónico</label><input style={inp} type="email" value={p.email??''} onChange={e=>upd('email',e.target.value)} /></div>
          <div style={fd}><label style={lbl}>Teléfono / WhatsApp</label><input style={inp} type="tel" value={p.telefono??''} onChange={e=>upd('telefono',e.target.value)} placeholder="+507 6XXX-XXXX" /></div>
          <div style={g2}>
            <div style={fd}><label style={lbl}>Fecha de nacimiento</label><input style={inp} type="date" value={p.dob??''} onChange={e=>upd('dob',e.target.value)} /></div>
            <div style={fd}><label style={lbl}>Género</label>
              <select style={{...inp,cursor:'pointer'}} value={p.genero??''} onChange={e=>upd('genero',e.target.value)}>
                <option value="">Seleccionar...</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
                <option value="prefiero-no-decir">Prefiero no decir</option>
              </select>
            </div>
          </div>
          <div style={fd}><label style={lbl}>Ciudad / País</label><input style={inp} value={p.ciudad??''} onChange={e=>upd('ciudad',e.target.value)} placeholder="Ciudad de Panamá" /></div>
        </>}

        {sec===1 && <>
          <div style={fd}><label style={lbl}>Condiciones crónicas</label><input style={inp} value={p.condiciones??''} onChange={e=>upd('condiciones',e.target.value)} placeholder="Ej: Diabetes, hipertensión..." /></div>
          <div style={fd}><label style={lbl}>Alergias</label><input style={inp} value={p.alergias??''} onChange={e=>upd('alergias',e.target.value)} placeholder="Ej: Penicilina..." /></div>
          <div style={g2}>
            <div style={fd}><label style={lbl}>Tipo de sangre</label>
              <select style={{...inp,cursor:'pointer'}} value={p.tipo_sangre??'No sabe'} onChange={e=>upd('tipo_sangre',e.target.value)}>
                {BT.map(bt=><option key={bt}>{bt}</option>)}
              </select>
            </div>
            <div style={fd}><label style={lbl}>Horas de sueño</label><input style={inp} type="number" min={0} max={24} step={0.5} value={p.horas_sueno??''} onChange={e=>upd('horas_sueno',e.target.value)} placeholder="7.5" /></div>
          </div>
          <div style={fd}><label style={lbl}>Medicamentos actuales</label><input style={inp} value={p.medicamentos??''} onChange={e=>upd('medicamentos',e.target.value)} placeholder="Ej: Metformina 500mg..." /></div>
          <div style={fd}><label style={lbl}>Cirugías previas</label><input style={inp} value={p.cirugias??''} onChange={e=>upd('cirugias',e.target.value)} placeholder="Ej: Cesárea 2018..." /></div>
        </>}

        {sec===2 && <>
          <div style={fd}><label style={lbl}>Tabaco</label>
            <select style={{...inp,cursor:'pointer'}} value={p.tabaco??'no_fuma'} onChange={e=>upd('tabaco',e.target.value)}>
              <option value="no_fuma">No fumo</option>
              <option value="fumador">Fumador/a</option>
              <option value="ex_fumador">Ex-fumador/a</option>
            </select>
          </div>
          <div style={fd}><label style={lbl}>Alcohol</label>
            <select style={{...inp,cursor:'pointer'}} value={p.alcohol??'no_consume'} onChange={e=>upd('alcohol',e.target.value)}>
              <option value="no_consume">No consumo</option>
              <option value="ocasional">Ocasional</option>
              <option value="frecuente">Frecuente</option>
            </select>
          </div>
          <div style={fd}><label style={lbl}>Ejercicio</label>
            <select style={{...inp,cursor:'pointer'}} value={p.ejercicio??'moderado'} onChange={e=>upd('ejercicio',e.target.value)}>
              <option value="sedentario">Sedentario/a</option>
              <option value="moderado">Moderado (1-3x/semana)</option>
              <option value="activo">Activo/a (4+x/semana)</option>
            </select>
          </div>
        </>}

        {sec===3 && <>
          <div style={{background:'#E0F5F2',border:'1px solid #0E8A7A',borderRadius:12,padding:'12px 16px',marginBottom:20,fontSize:13,color:'#0E8A7A',lineHeight:1.5}}>
            💡 Dani usa esta información para personalizar sus respuestas y consejos.
          </div>
          <div style={fd}><label style={lbl}>¿Qué quieres lograr con tu salud?</label>
            <textarea style={{...inp,resize:'vertical' as const,minHeight:80}} value={p.objetivos_dani??''} onChange={e=>upd('objetivos_dani',e.target.value)} placeholder="Ej: Mejorar el sueño, controlar mi ansiedad..." />
          </div>
          <div style={fd}><label style={lbl}>Notas adicionales para Dani</label>
            <textarea style={{...inp,resize:'vertical' as const,minHeight:100}} value={p.notas_dani??''} onChange={e=>upd('notas_dani',e.target.value)} placeholder="Cualquier cosa que Dani deba saber..." />
          </div>
        </>}

        <button onClick={save} style={{width:'100%',padding:'14px',background:saved?'#16A34A':'#1B3A6B',color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'background .2s',marginTop:8}}>
          {saved?'✓ Guardado':'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
