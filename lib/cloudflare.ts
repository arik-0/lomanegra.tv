import { SignJWT, importPKCS8 } from 'jose';
import crypto from 'crypto';

/**
 * Genera un Signed JWT con algoritmo RS256 para Cloudflare Stream (Live Input o Video).
 * @param liveInputUid ID único de la entrada en vivo o video en Cloudflare Stream.
 * @param durationInSeconds Duración de validez del token en segundos (por defecto 4 horas).
 */
export async function generateStreamToken(
  liveInputUid: string,
  durationInSeconds: number = 4 * 60 * 60
): Promise<string> {
  // Si el operador ancló una URL directa de stream (HLS .m3u8 o MP4), retornarla directamente
  if (liveInputUid.startsWith('http://') || liveInputUid.startsWith('https://')) {
    return liveInputUid;
  }

  const privateKeyPem = process.env.CLOUDFLARE_STREAM_PRIVATE_KEY;
  const keyId = process.env.CLOUDFLARE_STREAM_KEY_ID;

  if (!privateKeyPem || !keyId || keyId.startsWith('xxx')) {
    console.warn(
      '⚠️ Credenciales de Cloudflare Stream no configuradas. Activando modo Demo para pruebas.'
    );
    // Retorna URL de video de prueba para permitir testear la plataforma sin Cloudflare
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }

  // Normalizar saltos de línea literales \n a saltos de línea reales
  let formattedKey = privateKeyPem.replace(/\\n/g, '\n').trim();

  // Si la clave viene en formato PKCS#1 (BEGIN RSA PRIVATE KEY), convertir a PKCS#8
  if (formattedKey.includes('BEGIN RSA PRIVATE KEY')) {
    try {
      const keyObj = crypto.createPrivateKey(formattedKey);
      formattedKey = keyObj.export({ type: 'pkcs8', format: 'pem' }) as string;
    } catch (e) {
      console.warn('Conversión PKCS#1 a PKCS#8 omitida:', e);
    }
  }

  const privateKey = await importPKCS8(formattedKey, 'RS256');
  const now = Math.floor(Date.now() / 1000);
  const exp = now + durationInSeconds;

  const jwt = await new SignJWT({
    sub: liveInputUid,
    kid: keyId,
  })
    .setProtectedHeader({ alg: 'RS256', kid: keyId })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(privateKey);

  return jwt;
}
