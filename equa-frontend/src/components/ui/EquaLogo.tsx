'use client';
import { cn } from '@/lib/utils';

export function EquaLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Water drop icon */}
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-water-500/20 border border-water-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(42,154,255,0.3)]">
          <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
            <path
              d="M14 2C14 2 3 13.5 3 20C3 26.075 7.925 31 14 31C20.075 31 25 26.075 25 20C25 13.5 14 2 14 2Z"
              fill="url(#waterGrad)"
              stroke="rgba(42,154,255,0.5)"
              strokeWidth="1"
            />
            <path
              d="M8 22C8 22 8 25 11 27"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="waterGrad" x1="14" y1="2" x2="14" y2="31" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60b8ff" />
                <stop offset="1" stopColor="#0078f0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Ping indicator */}
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
      </div>
      <div className="text-center">
        <h1 className="font-sans text-2xl font-bold tracking-widest text-white uppercase">EQUA</h1>
        <p className="text-xs text-slate-500 tracking-wider mt-0.5">Smart Water Platform</p>
      </div>
    </div>
  );
}
