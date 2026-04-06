'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Role = 'paciente' | 'doctor';

export default function PatientLogin() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('paciente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleRole(r: Role) {
    setRole(r);
    if (r === 'doctor') window.location.href = 'https://docmonitor.vercel.app';
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rol: 'paciente' }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'Correo o contraseña incorrectos'); return; }
      localStorage.setItem('mdl_token', data.token);
      router.push('/patient');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally { setLoading(false); }
  }

  return (
    <div style={s.bg}>
      <div style={s.card}>
        <div style={s.logo}>Nexo<span style={{ color: '#7DD3C8' }}>Doc</span></div>
        <p style={s.sub}>Tu portal de salud personalizado</p>

        <div style={s.pills}>
          <button style={{ ...s.pill, ...(role === 'paciente' ? s.pillOn : s.pillOff) }} onClick={() => handleRole('paciente')}>Soy paciente</button>
          <button style={{ ...s.pill, ...(role === 'doctor' ? s.pillOn : s.pillOff) }} onClick={() => handleRole('doctor')}>Soy doctor</button>
        </div>

        <button style={s.google} onClick={() => alert('Google OAuth — próximamente')}>
          <GoogleSVG /> Continuar con Google
        </button>
        <div style={s.divider}>o</div>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          {error && <div style={s.err}>{error}</div>}
          <Field label="Correo electrónico"><input style={s.inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@ejemplo.com" required /></Field>
          <Field label="Contraseña"><input style={s.inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required /></Field>
          <button type="submit" style={s.submit} disabled={loading}>{loading ? 'Entrando...' : 'Iniciar Sesión'}</button>
        </form>

        <p style={s.foot}>¿No tienes cuenta? <Link href="/patient/register" style={{ color: '#0E8A7A', fontWeight: 600 }}>Regístrate</Link></p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}><label style={s.lbl}>{label}</label>{children}</div>;
}

function GoogleSVG() {
  return <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 10 }}><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>;
}

const s: Record<string, React.CSSProperties> = {
  bg: { minHeight: '100vh', background: '#EBF1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Sora', sans-serif" },
  card: { background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(27,58,107,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  logo: { fontFamily: "'Lora',serif", fontSize: 28, fontWeight: 700, color: '#1B3A6B', marginBottom: 6 },
  sub: { fontSize: 13, color: '#7B8499', marginBottom: 24, textAlign: 'center' },
  pills: { display: 'flex', gap: 6, background: '#EEF0F4', borderRadius: 10, padding: 4, marginBottom: 24, width: '100%' },
  pill: { flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora',sans-serif" },
  pillOn: { background: '#1B3A6B', color: '#fff', boxShadow: '0 2px 8px rgba(27,58,107,0.2)' },
  pillOff: { background: 'transparent', color: '#7B8499' },
  google: { width: '100%', padding: '12px 0', border: '1.5px solid #D5DAE4', borderRadius: 10, background: '#fff', fontSize: 14, fontWeight: 600, color: '#3D4457', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontFamily: "'Sora',sans-serif" },
  divider: { width: '100%', textAlign: 'center', margin: '0 0 16px', color: '#7B8499', fontSize: 12 },
  lbl: { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.4px', color: '#3D4457', marginBottom: 6 },
  inp: { width: '100%', padding: '12px 14px', border: '2px solid #EEF0F4', borderRadius: 10, fontSize: 14, fontFamily: "'Sora',sans-serif", color: '#111827', background: '#F8F9FB', outline: 'none', boxSizing: 'border-box' as const },
  submit: { width: '100%', padding: '13px 0', background: '#1B3A6B', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif", marginTop: 4 },
  err: { background: '#FDEAEA', border: '1px solid #C0392B', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#C0392B', marginBottom: 14 },
  foot: { marginTop: 20, fontSize: 13, color: '#7B8499', textAlign: 'center' as const },
};
