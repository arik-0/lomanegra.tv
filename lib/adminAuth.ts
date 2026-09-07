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
  } catch (err) {
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
