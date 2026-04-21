export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    next: string | null;
    prev: string | null;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface TaskFilters {
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  search?: string;
  page?: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;
