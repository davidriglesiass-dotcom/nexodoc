'use client';
import { useState, useRef, useEffect } from 'react';
import { SPECIALISTS } from '@/lib/specialists';
import type { ChatMessage, Specialist } from '@/lib/types';

const CTX = { nombre: 'Alejandra', edad: 38, condiciones: 'Perimenopausia', medicamentos: 'Amitriptilina, Angeliq', indicaciones: 'Amitriptilina 22:00, Angeliq 08:00' };

const WELCOME: Record<string, string> = {
  dani: '¡Hola! Soy Dani, tu guía de bienestar. ¿Cómo te has sentido hoy?',
  nutricion: '¡Hola! Soy Marco. ¿En qué te puedo ayudar con tu alimentación?',
  'salud-mental': '¡Hola! Soy Luna. Estoy aquí para escucharte. ¿Cómo estás?',
  movimiento: '¡Hola! Soy Rio. ¿Listo/a para movernos?',
  medicamentos: '¡Hola! Soy Farma. ¿Tienes dudas sobre tus medicamentos?',
  sueno: '¡Hola! Soy Nox. ¿Cómo has dormido últimamente?',
};

type AttachedFile = {
  name: string;
  type: 'image' | 'pdf';
  base64: string;
  mediaType: string;
  preview?: string;
};

export default function ChatPage() {
  const [activeId, setActiveId] = useState('dani');
  const [actives, setActives] = useState(['dani']);
  const [msgs, setMsgs] = useState<Record<string, ChatMessage[]>>({ dani: [{ role: 'assistant', content: WELCOME['dani'] }] });
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [modal, setModal] = useState(false);
  const [attached, setAttached] = useState<AttachedFile | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cur = msgs[activeId] ?? [];
  const sp = SPECIALISTS.find(s => s.id === activeId);
  const available = SPECIALISTS.filter(s => !actives.includes(s.id));

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [cur, streamText]);

  function switchTo(id: string) {
    setActiveId(id);
    if (!msgs[id]) setMsgs(p => ({ ...p, [id]: [{ role: 'assistant', content: WELCOME[id] ?? WELCOME['dani'] }] }));
  }

  function addSpec(id: string) {
    setActives(p => [...p, id]);
    setMsgs(p => ({ ...p, [id]: [{ role: 'assistant', content: WELCOME[id] ?? WELCOME['dani'] }] }));
    setActiveId(id);
    setModal(false);
  }

  // — Manejo de archivos —
  function handleFileClick() { fileRef.current?.click(); }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    if (!isPDF && !isImage) { alert('Solo se permiten imágenes (JPG, PNG, WebP) o PDF'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('El archivo debe ser menor a 5MB'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setAttached({
        name: file.name,
        type: isPDF ? 'pdf' : 'image',
        base64,
        mediaType: file.type,
        preview: isImage ? (reader.result as string) : undefined,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  // — Manejo de voz —
  async function toggleRecording() {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(blob);
      };
      mr.start();
      mediaRef.current = mr;
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch {
      alert('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function transcribeAudio(blob: Blob) {
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Error al transcribir');
      const { text } = await res.json();
      if (text) setInput(prev => prev + (prev ? ' ' : '') + text);
    } catch {
      alert('No se pudo transcribir el audio. Intenta de nuevo.');
    }
  }

  // — Enviar mensaje —
  async function send() {
    if ((!input.trim() && !attached) || streaming) return;
    const textContent = input.trim();
    setInput('');

    // Construir content del mensaje
    let userContent: any;
    if (attached) {
      const contentParts: any[] = [];
      if (attached.type === 'image') {
        contentParts.push({ type: 'image', source: { type: 'base64', media_type: attached.mediaType, data: attached.base64 } });
      } else {
        contentParts.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: attached.base64 } });
      }
      if (textContent) contentParts.push({ type: 'text', text: textContent });
      else contentParts.push({ type: 'text', text: attached.type === 'image' ? '¿Qué ves en esta imagen? Analízala en el contexto de mi salud.' : '¿Puedes analizar este documento?' });
      userContent = contentParts;
    } else {
      userContent = textContent;
    }

    const displayMsg: ChatMessage = { role: 'user', content: textContent || `📎 ${attached?.name}` };
    const apiMsg = { role: 'user' as const, content: userContent };
    const newMsgs: ChatMessage[] = [...cur, displayMsg];
    setMsgs(p => ({ ...p, [activeId]: newMsgs }));
    setAttached(null);
    setStreaming(true);
    setStreamText('');

    try {
      const apiMessages = [
        ...cur.map(m => ({ role: m.role, content: m.content })),
        apiMsg,
      ];
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, specialistId: activeId, patientContext: CTX }),
      });
      if (!res.ok || !res.body) throw new Error('Sin respuesta');
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let ai = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of dec.decode(value).split('\n').filter(l => l.startsWith('data: '))) {
          try {
            const d = JSON.parse(line.slice(6));
            if (d.type === 'delta') { ai += d.text; setStreamText(ai); }
            if (d.type === 'error') { ai = `Error: ${d.message}`; setStreamText(ai); }
          } catch { }
        }
      }
      setMsgs(p => ({ ...p, [activeId]: [...newMsgs, { role: 'assistant', content: ai || 'No hay respuesta.' }] }));
    } catch {
      setMsgs(p => ({ ...p, [activeId]: [...newMsgs, { role: 'assistant', content: 'Error de conexión. Intenta de nuevo.' }] }));
    } finally { setStreaming(false); setStreamText(''); }
  }

  return (
    <div style={s.page}>
      <div style={s.hdr}>
        <a href="/patient" style={{ fontSize: 13, color: '#7B8499', textDecoration: 'none' }}>← Inicio</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: sp?.color }} />
          <div>
            <b style={{ fontSize: 15, color: '#1B3A6B' }}>{sp?.emoji} {sp?.nombre}</b>
            <div style={{ fontSize: 11, color: '#0E8A7A' }}>En línea</div>
          </div>
        </div>
      </div>

      <div style={s.bar}>
        {actives.map(id => {
          const sp2 = SPECIALISTS.find(s => s.id === id);
          if (!sp2) return null;
          return (
            <button key={id} onClick={() => switchTo(id)}
              style={{ ...s.chip, background: activeId === id ? sp2.color : '#EEF0F4', color: activeId === id ? '#fff' : '#7B8499', border: `2px solid ${activeId === id ? sp2.color : 'transparent'}` }}>
              {sp2.emoji} {sp2.nombre.split(' — ')[0]}
            </button>
          );
        })}
        <button onClick={() => setModal(true)} style={s.addChip}>+ Agregar</button>
      </div>

      <div style={s.msgs}>
        {cur.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            {m.role === 'assistant' && <div style={{ ...s.av, background: sp?.color }}>{sp?.emoji}</div>}
            <div style={m.role === 'user' ? s.uBubble : s.aBubble}>{m.content}</div>
          </div>
        ))}
        {streaming && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div style={{ ...s.av, background: sp?.color }}>{sp?.emoji}</div>
            <div style={s.aBubble}>{streamText || '● ● ●'}<span style={{ opacity: .4 }}>▋</span></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Preview archivo adjunto */}
      {attached && (
        <div style={s.attachPreview}>
          {attached.type === 'image' && attached.preview
            ? <img src={attached.preview} alt="adjunto" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
            : <div style={{ width: 48, height: 48, borderRadius: 8, background: '#EEF0F4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📄</div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1B3A6B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attached.name}</div>
            <div style={{ fontSize: 11, color: '#7B8499' }}>{attached.type === 'pdf' ? 'PDF' : 'Imagen'} listo para enviar</div>
          </div>
          <button onClick={() => setAttached(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#7B8499', padding: '0 4px' }}>×</button>
        </div>
      )}

      {/* Barra de grabación */}
      {recording && (
        <div style={s.recordingBar}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>Grabando... {recordingTime}s</span>
          <span style={{ fontSize: 12, color: '#7B8499', marginLeft: 'auto' }}>Toca 🎤 para detener</span>
        </div>
      )}

      {/* Input row */}
      <div style={s.inputRow}>
        {/* Input oculto para archivos */}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          style={{ display: 'none' }} onChange={handleFileChange} />

        {/* Botón + */}
        <button onClick={handleFileClick} disabled={streaming}
          style={{ ...s.iconBtn, background: attached ? '#EBF1FB' : '#F8F9FB', border: `2px solid ${attached ? '#3366CC' : '#EEF0F4'}` }}>
          <span style={{ fontSize: 18, color: attached ? '#3366CC' : '#7B8499' }}>+</span>
        </button>

        {/* Campo de texto */}
        <input style={s.inp} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={recording ? 'Transcribiendo...' : `Escribe a ${sp?.nombre?.split(' — ')[0]}...`}
          disabled={streaming || recording} />

        {/* Botón micrófono */}
        <button onClick={toggleRecording} disabled={streaming}
          style={{ ...s.iconBtn, background: recording ? '#FEF2F2' : '#F8F9FB', border: `2px solid ${recording ? '#EF4444' : '#EEF0F4'}` }}>
          <span style={{ fontSize: 18 }}>{recording ? '⏹️' : '🎤'}</span>
        </button>

        {/* Botón enviar */}
        <button onClick={send} disabled={(!input.trim() && !attached) || streaming || recording}
          style={{ ...s.sendBtn, background: (input.trim() || attached) && !streaming && !recording ? '#1B3A6B' : '#D5DAE4' }}>→</button>
      </div>

      <p style={{ fontSize: 11, color: '#7B8499', textAlign: 'center', padding: '0 20px 16px', margin: 0 }}>
        {sp?.nombre} no sustituye a tu médico.
      </p>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <b style={{ fontFamily: "'Lora',serif", fontSize: 18, color: '#1B3A6B' }}>Agregar especialista</b>
            <p style={{ fontSize: 13, color: '#7B8499', margin: '6px 0 20px' }}>Todos gratis</p>
            {available.length === 0 && <p style={{ fontSize: 13, color: '#7B8499', textAlign: 'center' }}>¡Ya los tienes todos!</p>}
            {available.map(sp2 => (
              <div key={sp2.id} style={s.specCard} onClick={() => addSpec(sp2.id)}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: sp2.color + '20', color: sp2.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{sp2.emoji}</div>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 14 }}>{sp2.nombre}</b>
                  <div style={{ fontSize: 12, color: '#7B8499' }}>{sp2.descripcion}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: sp2.color }}>+</span>
              </div>
            ))}
            <button onClick={() => setModal(false)} style={{ width: '100%', marginTop: 16, padding: '12px', background: '#EEF0F4', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: "'Sora',sans-serif", fontWeight: 600, color: '#7B8499' }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#F8F9FB', display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', fontFamily: "'Sora',sans-serif" },
  hdr: { padding: '16px 20px 12px', borderBottom: '1px solid #EEF0F4', background: '#fff', display: 'flex', flexDirection: 'column', gap: 10 },
  bar: { display: 'flex', gap: 8, padding: '10px 16px', background: '#fff', borderBottom: '1px solid #EEF0F4', overflowX: 'auto' },
  chip: { padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Sora',sans-serif" },
  addChip: { padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'transparent', border: '2px dashed #D5DAE4', color: '#7B8499', whiteSpace: 'nowrap', fontFamily: "'Sora',sans-serif" },
  msgs: { flex: 1, padding: '20px 16px', overflowY: 'auto' },
  av: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' },
  aBubble: { background: '#fff', border: '1px solid #EEF0F4', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', fontSize: 14, color: '#111827', lineHeight: 1.5, maxWidth: '80%', boxShadow: '0 1px 4px rgba(27,58,107,0.06)' },
  uBubble: { background: '#1B3A6B', borderRadius: '18px 18px 4px 18px', padding: '12px 16px', fontSize: 14, color: '#fff', lineHeight: 1.5, maxWidth: '80%' },
  inputRow: { display: 'flex', gap: 8, padding: '12px 16px', background: '#fff', borderTop: '1px solid #EEF0F4', alignItems: 'center' },
  iconBtn: { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  inp: { flex: 1, padding: '10px 14px', border: '2px solid #EEF0F4', borderRadius: 24, fontSize: 14, fontFamily: "'Sora',sans-serif", color: '#111827', outline: 'none', background: '#F8F9FB' },
  sendBtn: { width: 40, height: 40, borderRadius: '50%', border: 'none', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', flexShrink: 0 },
  attachPreview: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: '#fff', borderTop: '1px solid #EEF0F4' },
  recordingBar: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#FEF2F2', borderTop: '1px solid #FECACA' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%', maxWidth: 480, maxHeight: '70vh', overflowY: 'auto' },
  specCard: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid #EEF0F4', cursor: 'pointer' },
};
