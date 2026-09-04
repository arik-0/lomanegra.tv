'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    function calculate() {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPast: false,
      });
    }

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/70 border border-red-700/80 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span>PARTIDO EN CURSO // EN VIVO</span>
      </div>
    );
  }

  return (
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
  );
}
