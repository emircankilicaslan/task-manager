'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateTaskPayload, Task } from '@/types';

interface TaskFormProps {
  onSubmit: (data: CreateTaskPayload) => void;
  defaultValues?: Partial<Task>;
  isLoading?: boolean;
}

export default function TaskForm({
  onSubmit,
  defaultValues,
  isLoading,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskPayload>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      status: defaultValues?.status ?? 'todo',
      priority: defaultValues?.priority ?? 'medium',
      due_date: defaultValues?.due_date ?? '',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title ?? '',
        description: defaultValues.description ?? '',
        status: defaultValues.status ?? 'todo',
        priority: defaultValues.priority ?? 'medium',
        due_date: defaultValues.due_date ?? '',
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Başlık <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title', {
            required: 'Başlık zorunludur.',
            minLength: { value: 3, message: 'En az 3 karakter olmalıdır.' },
            maxLength: { value: 255, message: 'En fazla 255 karakter.' },
          })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Görev başlığı"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <textarea
          {...register('description', {
            maxLength: { value: 2000, message: 'En fazla 2000 karakter.' },
          })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="İsteğe bağlı açıklama..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durum
          </label>
          <select
            {...register('status')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todo">Yapılacak</option>
            <option value="in_progress">Devam Ediyor</option>
            <option value="done">Tamamlandı</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Öncelik <span className="text-red-500">*</span>
          </label>
          <select
            {...register('priority', { required: 'Öncelik seçiniz.' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
          {errors.priority && (
            <p className="text-red-500 text-xs mt-1">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bitiş Tarihi
        </label>
        <input
          type="date"
          {...register('due_date')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2 rounded-lg text-sm transition-colors"
      >
        {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </form>
  );
}
