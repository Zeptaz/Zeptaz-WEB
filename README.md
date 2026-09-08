# Zeptaz Web

The public website for [Zeptaz](https://zeptaz.com): operator-first workflow automation for service businesses. It includes marketing pages, four guided portfolio case studies, a Supabase-backed blog and admin editor, and an optional live voice-agent preview.

## Start locally

Requirements: Node.js 20.9 or newer and npm.

```bash
git clone https://github.com/Zeptaz/Zeptaz-WEB.git
cd Zeptaz-WEB
npm ci
copy .env.local.example .env.local   # Windows
# cp .env.local.example .env.local   # macOS/Linux
npm run dev
```

Open <http://localhost:3000>. Environment values are optional for marketing pages and Work demos. Without them, the blog is empty, admin cannot authenticate, voice shows its offline state, and contact falls back to the visitor's email application.

Production-like local run:

```bash
npm run build
npm run start
```

`next/font` downloads Geist during a clean build, so the build environment needs Google Fonts access. Never commit `.env.local`; Git ignores it.

## Environment and optional services

Copy `.env.local.example` and configure only the features needed:

| Variable | Feature | Behaviour when absent |
| --- | --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Contact | Opens a prefilled email instead |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Contact | Opens a prefilled email instead |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Contact | Opens a prefilled email instead |
| `NEXT_PUBLIC_SUPABASE_URL` | Blog/admin | Blog is empty; admin is unavailable |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Blog/admin | Blog is empty; admin is unavailable |
| `NEXT_PUBLIC_VOICE_API_URL` | Voice preview | Preview renders its offline state |

These are browser-visible identifiers. Provider secrets, service-role keys, database passwords, Gemini keys and signing keys must not use `NEXT_PUBLIC_` or live in this repository.

### Supabase blog/admin

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) once in its SQL editor.
2. Create a public `blog-images` bucket for images (the UI expects roughly a 5 MB limit).
3. Disable public sign-ups.
4. Create an editor through Supabase Auth, then add the same email to `public.admins`.
5. Set both Supabase variables and restart the app.

Published posts are publicly readable through RLS. Drafts and writes require an authenticated email in `public.admins`. Admin routes are under `/admin`.

### Contact and voice

Configure all three EmailJS values together. If any is missing, submission deliberately uses `mailto:`. A portfolio CTA carries its selected project into the message.

The voice backend is separate and is not in this repository. Set `NEXT_PUBLIC_VOICE_API_URL` to its HTTPS origin. The browser requests a short-lived session grant from `/api/demo/sessions`, then uses the returned protected WebSocket. Production requires HTTPS for microphone and `AudioWorklet`. See [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Structure

```text
app/
  (marketing)/              public pages, blog, Work and voice product page
  (admin)/                  authenticated blog administration
  components/work/          guided portfolio shell, scenes and scoped themes
  components/sections/voice voice presentation and live preview
  lib/work.ts               case-study content and six-step stories
  lib/demo-state.ts         guarded demo state machine and fixtures
  lib/blog.ts, lib/supabase public queries and authenticated clients
  globals.css               marketing design system
public/voice/               same-origin audio worklets
proxy.ts                    admin-only Supabase session boundary
supabase/schema.sql         blog, allowlist and storage RLS reference
```

The Work index links to case studies, never directly to demos. Each case study explains the problem before its embedded six-step walkthrough. Expanded `/work/[slug]/demo` routes are focused `noindex` views. Demo state is fictional and browser-local; refresh clears it, and no external action occurs.

Documentation:

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — boundaries, routes and data flows
- [`docs/work-showcase-implementation.md`](docs/work-showcase-implementation.md) — guided demo contract and QA
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — Vercel and external voice deployment

## Quality checks

Run before a pull request:

```bash
npm run test:work
npm run test:voice
npm run build
```

The Work suite covers sequence guards, approvals, restart/pause, retries, consent, permissions and source counts. The voice suite covers persistent playback, PCM validation, interruption and buffer draining. The build checks TypeScript and production routes.

Optional Chrome QA for all Work screens and responsive layouts is documented in [`docs/work-showcase-implementation.md`](docs/work-showcase-implementation.md).

## Deployment

Deploy the repository root as a standard Next.js project on Vercel. Add production environment values, deploy a preview, run the checks above, then verify `/`, `/work`, one guided demo, `/blog`, `/admin/login`, `/contact`, and `/products/voice-agent` as applicable. Changes to `NEXT_PUBLIC_*` require a new frontend build.

Do not deploy the voice backend from this repository. Follow [`DEPLOYMENT.md`](DEPLOYMENT.md) for the complete production contract.
