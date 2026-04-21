'use client';

import { useState } from 'react';
import { useCreateTask, useTasks, useUpdateTask } from '@/hooks/useTasks';
import { useLogout, useMe } from '@/hooks/useAuth';
import Modal from '@/components/Modal';
import TaskCard from '@/components/TaskCard';
import TaskFiltersBar from '@/components/TaskFiltersBar';
import TaskForm from '@/components/TaskForm';
import Pagination from '@/components/Pagination';
import type { CreateTaskPayload, Task, TaskFilters } from '@/types';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>({ page: 1 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: user } = useMe();
  const { data, isLoading, isError } = useTasks(filters);
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const logoutMutation = useLogout();

  const handleCreate = (payload: CreateTaskPayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (payload: CreateTaskPayload) => {
    if (!editingTask) return;
    updateMutation.mutate(
      { id: editingTask.id, payload },
      { onSuccess: () => setEditingTask(null) }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm">TaskManager</span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-500">
                Merhaba, <strong className="text-gray-800">{user.name}</strong>
              </span>
            )}
            <button
              onClick={() => logoutMutation.mutate()}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Görevlerim</h1>
            {data && (
              <p className="text-sm text-gray-500 mt-0.5">
                Toplam {data.meta.total} görev
              </p>
            )}
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Görev
          </button>
        </div>

        <TaskFiltersBar filters={filters} onChange={setFilters} />

        {/* Task Grid */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 h-36 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-sm">Görevler yüklenirken hata oluştu.</p>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm font-medium">Henüz görev yok.</p>
              <p className="text-xs mt-1">Yeni Görev butonuna tıklayarak başlayabilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.data.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={setEditingTask} />
              ))}
            </div>
          )}
        </div>

        {data && (
          <Pagination
            currentPage={data.meta.current_page}
            lastPage={data.meta.last_page}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        )}
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Yeni Görev Oluştur"
      >
        <TaskForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Görevi Düzenle"
      >
        <TaskForm
          onSubmit={handleUpdate}
          defaultValues={editingTask ?? undefined}
          isLoading={updateMutation.isPending}
        />
      </Modal>
    </div>
  );
}
