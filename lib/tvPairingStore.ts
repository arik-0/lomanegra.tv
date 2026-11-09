import fs from 'fs';
import path from 'path';

export interface TvPairingSession {
  code: string;
  deviceId: string;
  matchId?: string;
  createdAt: number;
  expiresAt: number;
  status: 'pending' | 'authorized' | 'rejected';
  guestEmail?: string;
  matchTitle?: string;
}

// Almacén en memoria global para soportar recargas en desarrollo y serverless caliente
declare global {
  // eslint-disable-next-line no-var
  var globalTvPairingStore: Record<string, TvPairingSession> | undefined;
}

const TTL_MS = 15 * 60 * 1000; // 15 minutos de validez

function getStore(): Record<string, TvPairingSession> {
  if (!globalThis.globalTvPairingStore) {
    globalThis.globalTvPairingStore = {};
  }
  return globalThis.globalTvPairingStore;
}

// Genera un código limpio y fácil de leer en la tele (ej: PL-4829)
export function generateCleanTvCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let numPart = '';
  for (let i = 0; i < 4; i++) {
    numPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PL-${numPart}`;
}

export function createTvPairingSession(deviceId: string, matchId?: string, matchTitle?: string): TvPairingSession {
  const store = getStore();
  const now = Date.now();

  // Limpiar sesiones expiradas
  for (const c of Object.keys(store)) {
    if (store[c].expiresAt < now) {
      delete store[c];
    }
  }

  // Si el dispositivo ya tenía un código activo, reutilizarlo o renovarlo
  for (const c of Object.keys(store)) {
    if (store[c].deviceId === deviceId && store[c].expiresAt > now && store[c].status === 'pending') {
      store[c].matchId = matchId || store[c].matchId;
      store[c].matchTitle = matchTitle || store[c].matchTitle;
      return store[c];
    }
  }

  let code = generateCleanTvCode();
  while (store[code]) {
    code = generateCleanTvCode();
  }

  const session: TvPairingSession = {
    code,
    deviceId,
    matchId,
    matchTitle,
    createdAt: now,
    expiresAt: now + TTL_MS,
    status: 'pending',
  };

  store[code] = session;
  return session;
}

export function getTvPairingSession(code: string): TvPairingSession | null {
  const store = getStore();
  const cleanCode = code.toUpperCase().trim();
  const session = store[cleanCode];
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    delete store[cleanCode];
    return null;
  }
  return session;
}

export function authorizeTvPairingSession(
  code: string,
  guestEmail: string
): { success: boolean; session?: TvPairingSession; error?: string } {
  const store = getStore();
  const cleanCode = code.toUpperCase().trim();
  const session = store[cleanCode];

  if (!session) {
    return { success: false, error: 'Código de televisión no encontrado o ya expiró.' };
  }

  if (Date.now() > session.expiresAt) {
    delete store[cleanCode];
    return { success: false, error: 'El código ha expirado. Genera uno nuevo en tu televisor.' };
  }

  session.status = 'authorized';
  session.guestEmail = guestEmail.toLowerCase().trim();
  // Extender validez a 4 horas una vez autorizada la tele
  session.expiresAt = Date.now() + 4 * 60 * 60 * 1000;

  return { success: true, session };
}
