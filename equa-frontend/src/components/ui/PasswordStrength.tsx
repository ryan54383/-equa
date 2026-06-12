'use client';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StrengthProps {
  password: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-400' };
  return { score, label: 'Strong', color: 'bg-emerald-400' };
}

export function PasswordStrength({ password }: StrengthProps) {
  const { score, label, color } = useMemo(() => getStrength(password), [password]);
  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i <= score ? color : 'bg-white/10'
            )}
          />
        ))}
      </div>
      <p className={cn('text-xs', score <= 1 ? 'text-red-400' : score <= 2 ? 'text-amber-400' : score <= 3 ? 'text-yellow-400' : 'text-emerald-400')}>
        {label} password
      </p>
    </div>
  );
}
