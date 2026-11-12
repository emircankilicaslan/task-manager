import { describe, expect, it } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { getApiError } from './utils';

const axiosError = (data: unknown, status = 422) =>
  new AxiosError('fail', 'ERR', undefined, undefined, {
    data,
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('getApiError', () => {
  it('Laravel doğrulama hatalarından ilk mesajı döndürür', () => {
    const err = axiosError({ errors: { email: ['E-posta geçersiz.'], password: ['Çok kısa.'] } });
    expect(getApiError(err)).toBe('E-posta geçersiz.');
  });

  it('errors boşsa genel mesaja düşer', () => {
    expect(getApiError(axiosError({ errors: {} }))).toBe('Bir hata oluştu.');
  });

  it('message alanını döndürür', () => {
    expect(getApiError(axiosError({ message: 'Unauthenticated.' }, 401))).toBe('Unauthenticated.');
  });

  it('axios dışı hatalarda genel mesaj döndürür', () => {
    expect(getApiError(new Error('x'))).toBe('Beklenmeyen bir hata oluştu.');
    expect(getApiError(undefined)).toBe('Beklenmeyen bir hata oluştu.');
  });
});