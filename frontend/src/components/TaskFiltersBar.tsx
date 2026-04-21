'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TaskFilters, TaskPriority, TaskStatus } from '@/types';

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export default function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  const [search, setSearch] = useState(filters.search ?? '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, search, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatus = useCallback(
    (status: TaskStatus | '') => {
      onChange({ ...filters, status, page: 1 });
    },
    [filters, onChange]
  );

  const handlePriority = useCallback(
    (priority: TaskPriority | '') => {
      onChange({ ...filters, priority, page: 1 });
    },
    [filters, onChange]
  );

  const handleReset = () => {
    setSearch('');
    onChange({ page: 1 });
  };

  const hasActiveFilters =
    filters.status || filters.priority || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Görev ara..."
          className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
        />
        <svg
          className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </div>

      <select
        value={filters.status ?? ''}
        onChange={(e) => handleStatus(e.target.value as TaskStatus | '')}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Tüm Durumlar</option>
        <option value="todo">Yapılacak</option>
        <option value="in_progress">Devam Ediyor</option>
        <option value="done">Tamamlandı</option>
      </select>

      <select
        value={filters.priority ?? ''}
        onChange={(e) => handlePriority(e.target.value as TaskPriority | '')}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Tüm Öncelikler</option>
        <option value="low">Düşük</option>
        <option value="medium">Orta</option>
        <option value="high">Yüksek</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Temizle
        </button>
      )}
    </div>
  );
}
