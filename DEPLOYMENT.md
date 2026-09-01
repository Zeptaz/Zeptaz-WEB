# Production deployment

The production website and voice backend are deployed separately:

- `zeptaz.com` and `www.zeptaz.com`: this Next.js repository on Vercel.
- `voice.zeptaz.com`: the `zeptaz_voice` Docker Compose stack on the voice VM.

## Required Vercel configuration

Import this repository as a Next.js project and configure these Production environment variables:

```env
NEXT_PUBLIC_VOICE_API_URL=https://voice.zeptaz.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

`NEXT_PUBLIC_VOICE_API_URL` is required for the voice preview. Supabase and EmailJS values are required only for their corresponding website features. These are browser-visible identifiers; provider secrets, the Gemini API key, database credentials, and voice signing keys must never be added to this repository or to a `NEXT_PUBLIC_*` variable.

The voice playback engine uses `AudioWorklet`, so production must be served over HTTPS. Vercel supplies HTTPS automatically. The player modules under `public/voice/` must remain same-origin assets.

## Backend origin contract

The backend production environment must include the exact website origins:

```env
ALLOWED_ORIGINS=https://zeptaz.com,https://www.zeptaz.com
ZEPTAZ_DEMO_ALLOWED_ORIGINS=https://zeptaz.com,https://www.zeptaz.com
ZEPTAZ_PUBLIC_BASE_URL=https://voice.zeptaz.com
ZEPTAZ_DEMO_ADDRESS=voice.zeptaz.com
```

Do not add trailing slashes to the configured origins. DNS for `voice.zeptaz.com` must point to the voice VM, with ports 80 and 443 available to Caddy.

## Release checks

Run before merging or deploying:

```bash
npm ci
npm run test:voice
npm run build
```

After deployment, verify:

1. `https://voice.zeptaz.com/healthz` returns a healthy response.
2. The voice page requests grants from `https://voice.zeptaz.com/api/demo/sessions`.
3. The returned WebSocket uses `wss://voice.zeptaz.com/ws/demo/...`.
4. Auto, English, Sinhala, and Tamil calls connect.
5. Barge-in clears queued speech and subsequent audio remains free of frame-boundary artifacts.

Changing any `NEXT_PUBLIC_*` variable requires a new frontend deployment because Next.js embeds it during the production build.
