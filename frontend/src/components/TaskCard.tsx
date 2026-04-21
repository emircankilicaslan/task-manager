'use client';

import { useState } from 'react';
import { useDeleteTask, useUpdateTaskStatus } from '@/hooks/useTasks';
import type { Task, TaskStatus } from '@/types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Yapılacak',
  in_progress: 'Devam Ediyor',
  done: 'Tamamlandı',
};

const STATUS_STYLES: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

const PRIORITY_STYLES = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const PRIORITY_LABELS = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteMutation = useDeleteTask();
  const statusMutation = useUpdateTaskStatus();

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    deleteMutation.mutate(task.id);
  };

  const cycleStatus = () => {
    const order: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    statusMutation.mutate({ id: task.id, status: next });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded"
            title="Düzenle"
          >
            <PencilIcon />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className={`transition-colors p-1 rounded ${
              confirmDelete
                ? 'text-red-600 hover:text-red-700'
                : 'text-gray-400 hover:text-red-500'
            }`}
            title={confirmDelete ? 'Silmek için tekrar tıkla' : 'Sil'}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-auto">
        <button
          onClick={cycleStatus}
          disabled={statusMutation.isPending}
          className={`text-xs font-medium px-2 py-1 rounded-full transition-opacity hover:opacity-80 ${STATUS_STYLES[task.status]}`}
          title="Durumu değiştir"
        >
          {STATUS_LABELS[task.status]}
        </button>

        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${PRIORITY_STYLES[task.priority]}`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>

        {task.due_date && (
          <span className="text-xs text-gray-400 ml-auto">
            📅 {new Date(task.due_date).toLocaleDateString('tr-TR')}
          </span>
        )}
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828A2 2 0 0110 14.414H8v-2a2 2 0 01.586-1.414z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16"
      />
    </svg>
  );
}
