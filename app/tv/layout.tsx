import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pasión Lomonegra TV',
  description: 'Aplicación oficial para Android TV y Google TV de Pasión Lomonegra.',
};

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050608] text-white select-none cursor-default font-mono antialiased">
      {children}
    </div>
  );
}
