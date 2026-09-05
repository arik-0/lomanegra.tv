'use client';

import { useState, createContext, useContext } from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import SupportChat from '@/components/SupportChat';

interface SidebarContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  openSidebar: () => {},
  closeSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <SidebarContext.Provider
      value={{ sidebarOpen, toggleSidebar, openSidebar, closeSidebar }}
    >
      <div className="min-h-screen bg-[#08080a] text-white flex flex-col">
        {/* Barra Lateral Izquierda Técnica Estilo Forg1 */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        {/* Contenedor Principal (con margen en desktop y padding inferior para BottomNav en mobile) */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-[270px] pb-16 lg:pb-0 transition-all duration-200">
          {children}
        </div>

        {/* Barra Inferior Fija Táctil en Móviles */}
        <BottomNav onOpenSidebar={openSidebar} />

        {/* Chat de Soporte Flotante */}
        <SupportChat />
      </div>
    </SidebarContext.Provider>
  );
}
