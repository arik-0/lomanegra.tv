'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VideosRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/galeria?tab=videos');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center text-zinc-400 font-mono text-sm">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <span>Redirigiendo a la Galería oficial...</span>
      </div>
    </div>
  );
}
