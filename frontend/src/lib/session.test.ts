// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { clearSession, getToken, saveSession } from './session';

describe('session', () => {
  beforeEach(() => {
    clearSession();
  });

  it('token ı saklar ve middleware ın okuyacağı session çerezini yazar', () => {
    saveSession('abc123');

    expect(getToken()).toBe('abc123');
    expect(document.cookie).toContain('session=1');
    expect(document.cookie).not.toContain('abc123'); // çerezde gizli bilgi yok
  });

  it('clearSession hem token ı hem çerezi siler', () => {
    saveSession('abc123');
    clearSession();

    expect(getToken()).toBeNull();
    expect(document.cookie).not.toContain('session=1');
  });
});