# ⚽ Pasión Lomonegra - Plataforma Pay-Per-View

Plataforma oficial de alta concurrencia de **Pasión Lomonegra** para transmisión de partidos en vivo bajo la modalidad Pay-Per-View (PPV), desarrollada con **Next.js (App Router)**, **Supabase**, **Cloudflare Stream** y **Mercado Pago**.

---

## 🎨 Paleta y Diseño
- **Fondo / Superficies:** Negro profundo (`#09090b` / `zinc-950`), gris oscuro para tarjetas (`#18181b` / `zinc-900`).
- **Texto y Tipografía:** Blanco de alto contraste (`#ffffff`) y gris claro (`#e4e4e7`).
- **Acentos y Detalles:** Rojo vibrante (`#dc2626` / `#ef4444`) para botones de compra, badges pulsantes `● EN VIVO`, precios y pantalla de bloqueo anti-concurrencia.

---

## 🚀 Requisitos e Instalación

### 1. Clonar o abrir el directorio del proyecto
```bash
cd c:\Users\arika\OneDrive\Desktop\futbol-ppv
```

### 2. Instalar dependencias
```bash
npm install
```

Las dependencias principales instaladas son:
- `@supabase/supabase-js` y `@supabase/ssr`: Autenticación segura mediante cookies y base de datos PostgreSQL.
- `mercadopago`: SDK oficial v2 para Node.js (Checkout Pro y gestión de pagos).
- `jose`: Generación criptográfica de tokens JWT RSA-256 en entornos Serverless sin dependencias nativas.
- `@cloudflare/stream-react`: Reproductor de video oficial de Cloudflare Stream optimizado para HLS/DASH con Signed URLs.
- `lucide-react`: Iconos deportivos y de interfaz.

---

## ⚙️ Configuración de Servicios Externos

### 1. Supabase (PostgreSQL, Auth & RLS)
1. Ingresa a tu proyecto en [Supabase](https://supabase.com/).
2. Ve a **SQL Editor** -> **New Query**.
3. Copia y pega el contenido del archivo `supabase/migrations/001_initial_schema.sql`.
4. Ejecuta el script. Esto creará:
   - Las tablas `profiles`, `matches`, `purchases` y `active_sessions`.
   - Las políticas Row Level Security (RLS).
   - El trigger para crear perfiles automáticamente al registrarse.
   - Partidos de ejemplo para pruebas inmediatas.
5. Ve a **Project Settings** -> **API** y copia tu `URL`, `anon key` y `service_role key`.

### 2. Cloudflare Stream (Live Streaming & RSA-256)
1. En [Cloudflare Dashboard](https://dash.cloudflare.com/), dirígete a **Stream** -> **Live Inputs**.
2. Crea un nuevo Live Input y copia su **Live Input UID**.
3. Asegúrate de habilitar la opción **Require Signed URLs** en el Live Input.
4. Ve a **Stream** -> **Signing Keys** y genera un nuevo par de claves RSA.
5. Copia el **Key ID** y descarga la **Private Key PEM**.

### 3. Mercado Pago (Checkout Pro & Webhooks)
1. En [Mercado Pago Developers](https://www.mercadopago.com/developers/), crea una aplicación o accede a tus credenciales de prueba.
2. Copia tu **Access Token** (`APP_USR-...`).
3. La URL de retorno y notificación webhook ya están configuradas en `/api/checkout` y `/api/webhooks/mercadopago`.

---

## 🔑 Variables de Entorno (.env.local)

Copia el archivo `.env.example` a `.env.local`:
```bash
copy .env.example .env.local
```

Completa los valores con tus credenciales:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxxxxxxxxxxx

CLOUDFLARE_STREAM_KEY_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLOUDFLARE_STREAM_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...\n-----END RSA PRIVATE KEY-----"
```

---

## 🏃‍♂️ Ejecución en Desarrollo

```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🛡️ Mecanismo Anti-Concurrencia (Sesión Única)
1. Cuando un usuario con pase aprobado entra a un partido, el servidor genera un `session_id` único y lo registra en la tabla `active_sessions`.
2. El reproductor frontend (`StreamPlayer`) envía un latido (*heartbeat*) cada 20 segundos a `/api/stream/heartbeat`.
3. Si el usuario inicia sesión y abre el partido en otro dispositivo o navegador:
   - Se sobreescribe el `session_id` en la base de datos.
   - El primer dispositivo recibe una respuesta `HTTP 409 Conflict` (`CONCURRENT_SESSION_DETECTED`).
   - La transmisión se pausa instantáneamente y se muestra una pantalla de bloqueo con opción a retomar el control.
#   l o m o n e g r o . t v    