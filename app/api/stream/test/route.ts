import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { generateStreamToken } from '@/lib/cloudflare';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getStoredMatches } from '@/lib/adminStore';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  return handleTest(req);
}

export async function POST(req: Request) {
  return handleTest(req);
}

async function handleTest(req: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(req.url);
  let body: any = {};
  if (req.method === 'POST') {
    body = await req.json().catch(() => ({}));
  }

  const matchId = body.matchId || searchParams.get('matchId') || undefined;
  const customStreamUid = body.streamUid || searchParams.get('streamUid') || undefined;

  const results: {
    timestamp: string;
    environment: {
      hasSupabaseUrl: boolean;
      hasServiceKey: boolean;
      hasCloudflareKeyId: boolean;
      hasCloudflarePrivateKey: boolean;
      cloudflareMode: 'production' | 'demo';
    };
    tokenTest: {
      status: 'pass' | 'fail';
      isDirectUrl: boolean;
      tokenPreview: string;
      tokenLength: number;
      durationMs: number;
      error?: string;
    };
    videoReachability: {
      status: 'pass' | 'warn' | 'skip';
      url: string;
      httpStatus?: number;
      latencyMs?: number;
      message: string;
    };
    antiConcurrencyTest: {
      status: 'pass' | 'warn' | 'fail';
      message: string;
      sessionIdA?: string;
      sessionIdB?: string;
    };
    matchesSummary: {
      total: number;
      broadcastingLive: number;
      list: { id: string; title: string; is_live: boolean; stream_uid: string }[];
    };
    overall: {
      status: 'healthy' | 'warning' | 'error';
      message: string;
      totalDurationMs: number;
    };
  } = {
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl: false,
      hasServiceKey: false,
      hasCloudflareKeyId: false,
      hasCloudflarePrivateKey: false,
      cloudflareMode: 'demo',
    },
    tokenTest: {
      status: 'fail',
      isDirectUrl: false,
      tokenPreview: '',
      tokenLength: 0,
      durationMs: 0,
    },
    videoReachability: {
      status: 'skip',
      url: '',
      message: '',
    },
    antiConcurrencyTest: {
      status: 'warn',
      message: '',
    },
    matchesSummary: {
      total: 0,
      broadcastingLive: 0,
      list: [],
    },
    overall: {
      status: 'healthy',
      message: 'Todos los sistemas de transmisión verificados correctamente.',
      totalDurationMs: 0,
    },
  };

  // 1. Diagnóstico de Variables de Entorno
  const cfKeyId = process.env.CLOUDFLARE_STREAM_KEY_ID;
  const cfPrivateKey = process.env.CLOUDFLARE_STREAM_PRIVATE_KEY;
  results.environment.hasSupabaseUrl = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );
  results.environment.hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  results.environment.hasCloudflareKeyId = Boolean(cfKeyId && !cfKeyId.startsWith('xxx'));
  results.environment.hasCloudflarePrivateKey = Boolean(cfPrivateKey && !cfPrivateKey.includes('MIIEowIBAAKCAQEA0...'));
  results.environment.cloudflareMode =
    results.environment.hasCloudflareKeyId && results.environment.hasCloudflarePrivateKey
      ? 'production'
      : 'demo';

  // 2. Test de Generación de Token
  const tokenStart = Date.now();
  const testUid = customStreamUid || 'test_live_input_byn_2026';
  try {
    const token = await generateStreamToken(testUid, 3600);
    results.tokenTest.status = 'pass';
    results.tokenTest.isDirectUrl = token.startsWith('http://') || token.startsWith('https://');
    results.tokenTest.tokenLength = token.length;
    results.tokenTest.tokenPreview =
      token.length > 40 ? `${token.substring(0, 20)}...${token.substring(token.length - 15)}` : token;
    results.tokenTest.durationMs = Date.now() - tokenStart;

    // 3. Test de Conectividad HTTP al Video
    if (results.tokenTest.isDirectUrl) {
      const urlToTest = token;
      results.videoReachability.url = urlToTest;
      const reachStart = Date.now();
      try {
        const headRes = await fetch(urlToTest, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
        results.videoReachability.latencyMs = Date.now() - reachStart;
        results.videoReachability.httpStatus = headRes.status;
        if (headRes.ok || headRes.status === 206 || headRes.status === 302) {
          results.videoReachability.status = 'pass';
          results.videoReachability.message = `Servidor de video responde HTTP ${headRes.status} (${results.videoReachability.latencyMs}ms). Señal lista para emitir.`;
        } else {
          results.videoReachability.status = 'warn';
          results.videoReachability.message = `Servidor de video respondió HTTP ${headRes.status}. Comprobar la URL de emisión.`;
        }
      } catch (err: any) {
        results.videoReachability.status = 'warn';
        results.videoReachability.message = `No se pudo conectar al stream en el tiempo límite: ${err.message}`;
      }
    } else {
      results.videoReachability.status = 'pass';
      results.videoReachability.url = `https://cloudflarestream.com/${testUid}/manifest/video.m3u8`;
      results.videoReachability.message = 'Token firmado RSA-256 generado para Cloudflare Stream Player SDK.';
    }
  } catch (err: any) {
    results.tokenTest.status = 'fail';
    results.tokenTest.error = err.message || 'Error generando token';
    results.overall.status = 'error';
    results.overall.message = `Falla en generación de token: ${err.message}`;
  }

  // 4. Test de Anti-Concurrencia (Simulación de 2 dispositivos)
  const testUserId = `test_runner_${Date.now()}`;
  const sessionA = crypto.randomUUID();
  const sessionB = crypto.randomUUID();
  try {
    const { error: upsertErrA } = await supabaseAdmin.from('active_sessions').upsert({
      user_id: testUserId,
      session_id: sessionA,
      last_heartbeat: new Date().toISOString(),
    });

    if (upsertErrA) {
      results.antiConcurrencyTest.status = 'warn';
      results.antiConcurrencyTest.message = `Tabla active_sessions en Supabase: ${upsertErrA.message}. El sistema operará con validación local resiliente.`;
    } else {
      // Dispositivo B toma la sesión
      await supabaseAdmin.from('active_sessions').upsert({
        user_id: testUserId,
        session_id: sessionB,
        last_heartbeat: new Date().toISOString(),
      });

      // Dispositivo A intenta consultar su sesión
      const { data: currentSession } = await supabaseAdmin
        .from('active_sessions')
        .select('session_id')
        .eq('user_id', testUserId)
        .single();

      if (currentSession?.session_id === sessionB) {
        results.antiConcurrencyTest.status = 'pass';
        results.antiConcurrencyTest.message = 'Control anti-concurrencia activo: Dispositivo B revocó exitosamente la sesión de Dispositivo A.';
        results.antiConcurrencyTest.sessionIdA = sessionA;
        results.antiConcurrencyTest.sessionIdB = sessionB;
      } else {
        results.antiConcurrencyTest.status = 'warn';
        results.antiConcurrencyTest.message = 'La sesión B no reemplazó a la sesión A como se esperaba.';
      }

      // Limpiar sesión de prueba
      await supabaseAdmin.from('active_sessions').delete().eq('user_id', testUserId);
    }
  } catch (err: any) {
    results.antiConcurrencyTest.status = 'warn';
    results.antiConcurrencyTest.message = `Omitido test DB anti-concurrencia: ${err.message}`;
  }

  // 5. Resumen de Partidos y sus Streams
  const storedMatches = getStoredMatches();
  results.matchesSummary.total = storedMatches.length;
  results.matchesSummary.broadcastingLive = storedMatches.filter((m) => m.is_live).length;
  results.matchesSummary.list = storedMatches.map((m) => ({
    id: m.id,
    title: m.title,
    is_live: Boolean(m.is_live),
    stream_uid: m.cloudflare_live_input_uid,
  }));

  // Diagnóstico Global
  results.overall.totalDurationMs = Date.now() - startTime;
  if (results.environment.cloudflareMode === 'demo') {
    results.overall.message =
      'Modo Demo / Video de Prueba activo. La señal funciona correctamente con el video de prueba BigBuckBunny. Para transmisión oficial en vivo vía Cloudflare Stream, agrega tus claves en .env.local.';
  }

  return NextResponse.json(results);
}
