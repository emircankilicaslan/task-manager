import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { User } from '@/types';

export function useMe() {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get<{ data: User }>('/auth/me');
      return data.data;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await api.post<{ token: string; user: User }>(
        '/auth/login',
        payload
      );
      return data;
    },
    onSuccess: ({ token, user }) => {
      localStorage.setItem('token', token);
      queryClient.setQueryData(['me'], user);
      router.push('/');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => {
      const { data } = await api.post<{ token: string; user: User }>(
        '/auth/register',
        payload
      );
      return data;
    },
    onSuccess: ({ token, user }) => {
      localStorage.setItem('token', token);
      queryClient.setQueryData(['me'], user);
      router.push('/');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSettled: () => {
      localStorage.removeItem('token');
      queryClient.clear();
      router.push('/login');
    },
  });
}
