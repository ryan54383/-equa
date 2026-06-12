'use client';
import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="space-y-1">
        <label className="label" htmlFor={props.id || props.name}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={props.id || props.name}
            type={inputType}
            className={cn(
              'input-field',
              isPassword && 'pr-12',
              error && 'input-error',
              className
            )}
            aria-describedby={error ? `${props.name}-error` : undefined}
            aria-invalid={!!error}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${props.name}-error`} className="error-text" role="alert">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="shrink-0">
              <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 016 5zm0-1.5a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
            </svg>
            {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </div>
    );
  }
);
FormInput.displayName = 'FormInput';
