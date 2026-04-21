import { AxiosError } from 'axios';

export function getApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    // Laravel validation errors
    if (data?.errors) {
      const messages = Object.values(data.errors as Record<string, string[]>).flat();
      return messages[0] ?? 'Bir hata oluştu.';
    }

    if (data?.message) return data.message;
  }

  return 'Beklenmeyen bir hata oluştu.';
}
