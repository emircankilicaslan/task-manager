'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/hooks/useAuth';
import { getApiError } from '@/lib/utils';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Kayıt Ol</h1>
          <p className="text-sm text-gray-500 mt-1">Hesabını oluştur</p>
        </div>

        {registerMutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
            {getApiError(registerMutation.error)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
            <input
              {...register('name', {
                required: 'Ad zorunludur.',
                minLength: { value: 2, message: 'En az 2 karakter.' },
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Adınız Soyadınız"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              {...register('email', { required: 'E-posta zorunludur.' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ornek@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              {...register('password', {
                required: 'Şifre zorunludur.',
                minLength: { value: 8, message: 'En az 8 karakter.' },
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre Tekrar</label>
            <input
              type="password"
              {...register('password_confirmation', {
                required: 'Şifre tekrarı zorunludur.',
                validate: (v) => v === watch('password') || 'Şifreler eşleşmiyor.',
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2 rounded-lg text-sm transition-colors"
          >
            {registerMutation.isPending ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabın var mı?{' '}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
