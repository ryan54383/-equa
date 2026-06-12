'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { loginApi } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { FormInput } from '@/components/ui/FormInput';
import { Alert } from '@/components/ui/Alert';
import { EquaLogo } from '@/components/ui/EquaLogo';
import type { LoginFormValues } from '@/types';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setApiError('');
    try {
      const data = await loginApi(values);
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      router.push('/dashboard');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="glass-card p-8 shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="mb-8">
        <EquaLogo className="mb-8" />
        <h2 className="text-xl font-semibold text-white">Welcome back</h2>
        <p className="text-slate-400 text-sm mt-1">Sign in to monitor your water systems</p>
      </div>

      {/* API error banner */}
      {apiError && (
        <Alert
          type="error"
          message={apiError}
          onDismiss={() => setApiError('')}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="stagger space-y-5">
          <FormInput
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end mt-2">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-water-400 hover:text-water-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-slate-600">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-water-400 hover:text-water-300 font-medium transition-colors">
          Create one
        </Link>
      </p>

      {/* Demo credentials hint */}
      <p className="text-center text-xs text-slate-700 mt-4 font-mono">
        Sprint 1 · Authentication Module
      </p>
    </div>
  );
}
