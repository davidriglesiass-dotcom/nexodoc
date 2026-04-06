'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const doctorToken = params.get('doctor_token');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, doctor_token: doctorToken }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'Error al registrarse'); return; }
      localStorage.setItem('mdl_token', data.token);
      router.push('/patient');
    } catch { setError('Error de conexión.'); }
    finally { setLoading(false); }
  }

  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <div style={s.bg}>
      <div style={s.card}>
        <div style={s.logo}>Nexo<span style={{ color: '#7DD3C8' }}>Doc</span></div>
        <p style={s.sub}>Crea tu cuenta y empieza a cuidarte</p>
        {doctorToken && <div style={s.docBadge}>🩺 Te registras con tu médico de ConectoSalud</div>}
        <button style={s.google} onClick={() => alert('Google OAuth — próximamente')}>
          <GoogleSVG /> Registrarse con Google
        </button>
        <div style={s.divider}>o</div>
        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          {error && <div style={s.err}>{error}</div>}
          <Field label="Nombre completo *"><input style={s.inp} type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="María González" required /></Field>
          <Field label="Correo electrónico *"><input style={s.inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@ejemplo.com" required /></Field>
          <Field label="Contraseña *"><input style={s.inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required /></Field>
          <Field label="Confirmar contraseña *">
            <input style={{ ...s.inp, borderColor: mismatch ? '#C0392B' : '#EEF0F4' }} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite tu contraseña" required />
            {mismatch && <span style={{ fontSize: 11, color: '#C0392B', marginTop: 4, display: 'block' }}>Las contraseñas no coinciden</span>}
          </Field>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#7B8499', marginBottom: 16, cursor: 'pointer' }}>
            <input type="checkbox" required style={{ marginTop: 2 }} />
            Acepto los términos y la política de privacidad de ConectoSalud
          </label>
          <button type="submit" style={s.submit} disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
        </form>
        <p style={s.foot}>¿Ya tienes cuenta? <Link href="/patient/login" style={{ color: '#0E8A7A', fontWeight: 600 }}>Inicia sesión</Link></p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.4px', color: '#3D4457', marginBottom: 6 }}>{label}</label>{children}</div>;
}

function GoogleSVG() {
  return <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 10 }}><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#EBF1FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Sora',sans-serif", color: '#1B3A6B', fontSize: 14 }}>Cargando...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

const s: Record<string, React.CSSProperties> = {
  bg: { minHeight: '100vh', background: '#EBF1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Sora',sans-serif" },
  card: { background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(27,58,107,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  logo: { fontFamily: "'Lora',serif", fontSize: 28, fontWeight: 700, color: '#1B3A6B', marginBottom: 6 },
  sub: { fontSize: 13, color: '#7B8499', marginBottom: 20, textAlign: 'center' },
  docBadge: { background: '#E0F5F2', border: '1px solid #0E8A7A', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: '#0E8A7A', fontWeight: 600, width: '100%', marginBottom: 16, textAlign: 'center' },
  google: { width: '100%', padding: '12px 0', border: '1.5px solid #D5DAE4', borderRadius: 10, background: '#fff', fontSize: 14, fontWeight: 600, color: '#3D4457', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontFamily: "'Sora',sans-serif" },
  divider: { width: '100%', textAlign: 'center', margin: '0 0 16px', color: '#7B8499', fontSize: 12 },
  inp: { width: '100%', padding: '12px 14px', border: '2px solid #EEF0F4', borderRadius: 10, fontSize: 14, fontFamily: "'Sora',sans-serif", color: '#111827', background: '#F8F9FB', outline: 'none', boxSizing: 'border-box' as const },
  submit: { width: '100%', padding: '13px 0', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
  err: { background: '#FDEAEA', border: '1px solid #C0392B', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#C0392B', marginBottom: 14 },
  foot: { marginTop: 20, fontSize: 13, color: '#7B8499', textAlign: 'center' as const },
};
