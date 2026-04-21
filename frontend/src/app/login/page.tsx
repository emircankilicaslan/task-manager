'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useAuth';
import { getApiError } from '@/lib/utils';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const loginMutation = useLogin();

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Giriş Yap</h1>
          <p className="text-sm text-gray-500 mt-1">TaskManager'a hoş geldiniz</p>
        </div>

        {loginMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
            {getApiError(loginMutation.error)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              {...register('email', { required: 'E-posta zorunludur.' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ornek@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              {...register('password', { required: 'Şifre zorunludur.' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2 rounded-lg text-sm transition-colors"
          >
            {loginMutation.isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-indigo-600 font-medium hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
