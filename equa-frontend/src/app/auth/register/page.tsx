'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWatch } from 'react-hook-form';

import { registerApi } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { FormInput } from '@/components/ui/FormInput';
import { Alert } from '@/components/ui/Alert';
import { EquaLogo } from '@/components/ui/EquaLogo';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import type { RegisterFormValues } from '@/types';

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = useWatch({ control, name: 'password' });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setApiError('');
    try {
      const { confirmPassword: _, ...payload } = values;
      const data = await registerApi(payload);
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      router.push('/dashboard');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="glass-card p-8 shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="mb-8">
        <EquaLogo className="mb-8" />
        <h2 className="text-xl font-semibold text-white">Create your account</h2>
        <p className="text-slate-400 text-sm mt-1">Start protecting your water infrastructure</p>
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
            label="Full name"
            type="text"
            placeholder="Jane Smith"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />

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
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordStrength password={passwordValue || ''} />
          </div>

          <FormInput
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {/* Terms note */}
          <p className="text-xs text-slate-500">
            By creating an account you agree to our{' '}
            <span className="text-water-400">Terms of Service</span> and{' '}
            <span className="text-water-400">Privacy Policy</span>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Create account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer link */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-slate-600">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-water-400 hover:text-water-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
