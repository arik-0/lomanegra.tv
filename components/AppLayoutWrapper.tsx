'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col md:flex-row">
      {/* Barra Lateral Izquierda Técnica Estilo Forg1 */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Contenedor Principal (con margen en desktop y padding inferior para BottomNav en mobile) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[270px] pb-16 lg:pb-0 transition-all duration-200">
        {children}
      </div>

      {/* Barra Inferior Fija Táctil en Móviles */}
      <BottomNav onOpenSidebar={() => setSidebarOpen(true)} />
    </div>
  );
}
