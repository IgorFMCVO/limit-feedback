
import 'server-only';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

export const ADMIN_COOKIE_NAME = 'voz_admin_session';

function getAdminHash() {
  const password = process.env.ADMIN_PASSWORD || '';
  return createHash('sha256').update(`${password}|voz-admin`).digest('hex');
}

export async function isAdminAuthenticated() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === getAdminHash();
}

export function getAdminCookieValue() {
  return getAdminHash();
}
