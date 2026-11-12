import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

const req = (path: string, session?: string) =>
  new NextRequest(`http://localhost:3000${path}`, {
    headers: session === undefined ? {} : { cookie: `session=${session}` },
  });

const redirectTarget = (res: Response) => {
  const loc = res.headers.get('location');
  return loc ? new URL(loc).pathname : null;
};

describe('middleware', () => {
  it('oturumsuz kullanıcıyı korumalı sayfadan /login e yönlendirir', () => {
    expect(redirectTarget(middleware(req('/')))).toBe('/login');
  });

  it('oturumsuz kullanıcı /login ve /register a girebilir', () => {
    expect(redirectTarget(middleware(req('/login')))).toBeNull();
    expect(redirectTarget(middleware(req('/register')))).toBeNull();
  });

  it('oturumlu kullanıcı korumalı sayfaya girebilir', () => {
    expect(redirectTarget(middleware(req('/', '1')))).toBeNull();
  });

  it('oturumlu kullanıcıyı /login ve /register dan ana sayfaya yönlendirir', () => {
    expect(redirectTarget(middleware(req('/login', '1')))).toBe('/');
    expect(redirectTarget(middleware(req('/register', '1')))).toBe('/');
  });

  it('beklenen değer dışındaki çerezi oturum saymaz', () => {
    expect(redirectTarget(middleware(req('/', '0')))).toBe('/login');
    expect(redirectTarget(middleware(req('/', 'true')))).toBe('/login');
  });
});