
import { NextResponse } from 'next/server';
import { getAdminCookieValue, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }));
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'ADMIN_PASSWORD não configurada.' }, { status: 500 });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'Senha inválida.' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, getAdminCookieValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
  });
  return response;
}
