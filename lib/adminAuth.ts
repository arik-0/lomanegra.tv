import crypto from 'crypto';

/**
 * Hash seguro con algoritmo PBKDF2 SHA-512 (100.000 iteraciones) y salt aleatorio de 16 bytes.
 * Formato resultante: salt:hash_hex
 */
export function hashPassword(password: string, customSalt?: string): string {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifica una contraseña candidata contra un hash PBKDF2 utilizando comparación segura contra ataques de temporización.
 */
export function verifyPassword(candidate: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, expectedHash] = parts;
    if (!salt || !expectedHash) return false;

    const candidateHash = crypto.pbkdf2Sync(candidate, salt, 100000, 64, 'sha512').toString('hex');

    const candidateBuffer = Buffer.from(candidateHash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    if (candidateBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Hash oficial predeterminado para el administrador.
 * Contraseña maestra: P@sionLomonegra#2026!AdminX9
 */
export const DEFAULT_ADMIN_HASH =
  '4bc0855c1f70beae78f4534f6079cf1e:3a2bf245388fe21865a38132fca518b35357fd73b9a99b4219a64bb4a02cf3665f9624e4dc456253b2cc6c7a53814b234dff02760ae2d091226b7ddd78470969';

export function getAdminPasswordHash(): string {
  return process.env.ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_HASH;
}

/**
 * Genera un token de sesión firmado con HMAC-SHA256 para evitar falsificación de cookies.
 */
export function createAdminSessionToken(): string {
  const secret = getAdminPasswordHash();
  const payload = 'authenticated_v2';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return `${payload}.${signature}`;
}

/**
 * Verifica un valor de cookie de sesión de administrador de forma criptográfica.
 */
export function isValidAdminTokenValue(val?: string | null): boolean {
  if (!val) return false;
  try {
    const expectedToken = createAdminSessionToken();
    const a = Buffer.from(val);
    const b = Buffer.from(expectedToken);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Verifica si la petición actual proviene de un administrador autenticado con cookie de sesión segura.
 */
export function verifyAdminSession(): boolean {
  try {
    const { cookies } = require('next/headers');
    const cookieStore = cookies();
    const session = cookieStore.get('admin_session');
    return isValidAdminTokenValue(session?.value);
  } catch {
    return false;
  }
}

// Control de límite de intentos (Rate Limiting) contra ataques de fuerza bruta
interface LoginAttemptRecord {
  count: number;
  resetAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var globalAdminRateLimit: Record<string, LoginAttemptRecord> | undefined;
}

const MAX_ATTEMPTS = 6;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

function getRateLimitStore(): Record<string, LoginAttemptRecord> {
  if (!globalThis.globalAdminRateLimit) {
    globalThis.globalAdminRateLimit = {};
  }
  return globalThis.globalAdminRateLimit;
}

export function checkAdminLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const store = getRateLimitStore();
  const now = Date.now();
  const record = store[ip];

  if (!record || now > record.resetAt) {
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true };
}

export function recordAdminLoginFailure(ip: string): void {
  const store = getRateLimitStore();
  const now = Date.now();
  const record = store[ip];

  if (!record || now > record.resetAt) {
    store[ip] = { count: 1, resetAt: now + WINDOW_MS };
  } else {
    record.count += 1;
  }
}

export function resetAdminLoginFailures(ip: string): void {
  const store = getRateLimitStore();
  delete store[ip];
}
