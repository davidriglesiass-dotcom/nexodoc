import type { Metadata } from 'next';
import Sidebar from '@/components/patient/Sidebar';

export const metadata: Metadata = {
  title: 'NexoDoc — Tu portal de salud',
  description: 'Conecta con tu médico, sigue tu tratamiento y cuida tu bienestar.',
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Sora', sans-serif; background: #F8F9FB; }
          @media (max-width: 768px) {
            .sidebar { display: none !important; }
            .mobile-bar { display: flex !important; }
            .main-content { margin-left: 0 !important; padding-bottom: 70px !important; }
          }
        `}</style>
      </head>
      <body>
        <Sidebar />
        <main className="main-content" style={{ marginLeft: 240, minHeight: '100vh', background: '#F8F9FB' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
