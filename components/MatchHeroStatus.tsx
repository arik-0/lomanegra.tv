'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface MatchStatusProps {
  targetDate: string | null;
  isDateConfirmed: boolean;
}

function useMatchTimer(targetDate: string | null, isDateConfirmed: boolean) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    diffMs: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    diffMs: 0,
    isPast: false,
  });

  useEffect(() => {
    setMounted(true);

    if (!isDateConfirmed || !targetDate) {
      return;
    }

    function calculate() {
      const matchTime = new Date(targetDate!).getTime();
      const now = Date.now();
      const diffMs = matchTime - now;

      if (isNaN(matchTime) || diffMs <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          diffMs: 0,
          isPast: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffMs / 1000 / 60) % 60),
        seconds: Math.floor((diffMs / 1000) % 60),
        diffMs,
        isPast: false,
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, isDateConfirmed]);

  const isConfirmed = isDateConfirmed && !!targetDate;
  const isLive = isConfirmed && timeLeft.isPast && mounted;

  let badgeText = 'PRÓXIMA TRANSMISIÓN EN VIVO';
  if (!isConfirmed) {
    badgeText = 'EVENTO A CONFIRMAR // SEÑAL EN ESPERA';
  } else if (isLive) {
    badgeText = 'EN DIRECTO';
  } else {
    const hours = timeLeft.diffMs / (1000 * 60 * 60);
    if (hours <= 1) {
      badgeText = 'COMIENZA EN BREVE // TRANSMISIÓN EN VIVO';
    } else {
      badgeText = 'PRÓXIMA TRANSMISIÓN EN VIVO';
    }
  }

  return { mounted, timeLeft, isConfirmed, isLive, badgeText };
}

// 1. Badge Superior Dinámico
export function MatchHeroBadge({ targetDate, isDateConfirmed }: MatchStatusProps) {
  const { isLive, isConfirmed, badgeText } = useMatchTimer(targetDate, isDateConfirmed);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-300 ${
          isLive
            ? 'bg-red-600/90 text-white animate-pulse'
            : !isConfirmed
            ? 'bg-amber-950/70 border border-amber-700/80 text-amber-400'
            : 'bg-red-950/70 border border-red-700/80 text-red-400'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isLive
              ? 'bg-white animate-ping'
              : !isConfirmed
              ? 'bg-amber-400'
              : 'bg-red-500 animate-ping'
          }`}
        />
        <span>{badgeText}</span>
      </div>
    </div>
  );
}

// 2. Contador Dinámico que se sincroniza solo al partido
export function MatchHeroCountdown({ targetDate, isDateConfirmed }: MatchStatusProps) {
  const { timeLeft, isConfirmed, isLive } = useMatchTimer(targetDate, isDateConfirmed);

  if (!isConfirmed) {
    return (
      <div className="pt-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-400 text-xs font-mono">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>FECHA Y HORARIO A CONFIRMAR POR LA LIGA</span>
        </div>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className="pt-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/60 border border-red-700/80 text-red-400 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>SEÑAL EN TRANSMISIÓN DIRECTA EN EL PLAYER</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-1">
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
        Comienza en:
      </span>
      <div className="flex items-center gap-2 sm:gap-2.5 text-center font-mono">
        {timeLeft.days > 0 && (
          <div className="bg-[#0c0c10] border border-white/[0.08] rounded-xl px-3 py-2 min-w-[56px] shadow-sm">
            <span className="block text-xl sm:text-2xl font-black tabular-nums text-white leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1 block">
              DÍAS
            </span>
          </div>
        )}
        <div className="bg-[#0c0c10] border border-white/[0.08] rounded-xl px-3 py-2 min-w-[56px] shadow-sm">
          <span className="block text-xl sm:text-2xl font-black tabular-nums text-white leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1 block">
            HS
          </span>
        </div>
        <span className="text-zinc-600 font-bold text-lg -mt-3">:</span>
        <div className="bg-[#0c0c10] border border-white/[0.08] rounded-xl px-3 py-2 min-w-[56px] shadow-sm">
          <span className="block text-xl sm:text-2xl font-black tabular-nums text-white leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1 block">
            MIN
          </span>
        </div>
        <span className="text-zinc-600 font-bold text-lg -mt-3">:</span>
        <div className="bg-[#0c0c10] border border-white/[0.08] rounded-xl px-3 py-2 min-w-[56px] shadow-sm">
          <span className="block text-xl sm:text-2xl font-black tabular-nums text-red-500 animate-pulse leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1 block">
            SEG
          </span>
        </div>
      </div>
    </div>
  );
}
