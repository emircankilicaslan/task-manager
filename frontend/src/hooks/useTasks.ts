import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  CreateTaskPayload,
  PaginatedResponse,
  Task,
  TaskFilters,
  UpdateTaskPayload,
} from '@/types';

const TASKS_KEY = 'tasks';

export function useTasks(filters: TaskFilters = {}) {
  return useQuery<PaginatedResponse<Task>>({
    queryKey: [TASKS_KEY, filters],
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined)
      );
      const { data } = await api.get('/tasks', { params });
      return data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const { data } = await api.post<{ data: Task }>('/tasks', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTaskPayload;
    }) => {
      const { data } = await api.put<{ data: Task }>(`/tasks/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: Task['status'];
    }) => {
      const { data } = await api.patch<{ data: Task }>(`/tasks/${id}/status`, {
        status,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}
