'use client';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type: 'error' | 'success';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({ type, message, onDismiss, className }: AlertProps) {
  const isError = type === 'error';
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-xl px-4 py-3 text-sm',
        isError
          ? 'bg-red-500/10 border border-red-500/20 text-red-300'
          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300',
        className
      )}
    >
      {isError ? <AlertCircle size={16} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={16} className="shrink-0 mt-0.5" />}
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 hover:opacity-70 transition-opacity" aria-label="Dismiss">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
