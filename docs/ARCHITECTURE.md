# System architecture

## Runtime boundaries

This is one Next.js App Router application with three optional external integrations:

```text
Browser
  ├─ Next.js marketing and Work pages (Vercel)
  ├─ EmailJS, or mailto fallback
  ├─ Supabase Auth / Database / Storage (blog and admin)
  └─ Zeptaz voice API → short-lived grant → protected WebSocket
```

Marketing and portfolio need only Next.js. Work demos call no external systems. Supabase, EmailJS and voice are independently optional and do not prevent the core site from building.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/`, `/about`, `/services`, `/process`, `/pricing`, `/contact`, `/engine` | Public | Marketing and conversion |
| `/work` | Public/static | Four-project case-study index |
| `/work/[slug]` | Public/static | Case narrative and embedded demo |
| `/work/[slug]/demo` | Public/static/`noindex` | Focused version of the same session |
| `/work/[slug]/opengraph-image-*` | Generated | Case social image |
| `/products/voice-agent` | Public | Voice product and optional live preview |
| `/blog`, `/blog/[slug]` | Public | Published Supabase content |
| `/admin/login` | Public entry | Supabase sign-in |
| `/admin`, `/admin/edit/[id]`, `/admin/preview/[id]` | Authenticated/allowlisted | Blog management |

Only `/admin/:path*` passes through `proxy.ts`. Public pages avoid cookie-bound auth middleware so blog content remains cache-friendly.

## Guided portfolio

`app/lib/work.ts` defines four case studies and six screens each. `demo-state.ts` owns fixtures, approvals and `GuidedState`. The UI can request only start, next, finish, pause, resume, retry or restart.

Async completion carries the current stage and generation. The reducer rejects stale callbacks, skipped stages and duplicate completion. Approval is a snapshot of relevant data; campaign approval also requires a SHA-256 fingerprint. Scenes receive read-only state. Supporting evidence unlocks only at completion.

`DemoSessions` keeps one session per project above the marketing route frame. Client navigation between embedded and expanded views preserves state; refresh clears it. Leaving, hiding or scrolling a running demo out of view pauses processing.

All identities, dates, sources and outputs are fictional. Demos call no CRM, publisher, repository, model or notification service. Technologies on case pages describe underlying projects, not the browser simulation.

## Blog and admin

Public blog queries use a cookie-free anonymous Supabase client. RLS exposes only published rows. Missing configuration returns an empty blog.

Admin uses a cookie-bound server client. Mutations call `getUser`, while database/storage RLS independently requires the authenticated email in `public.admins`. HTML is sanitized before storage. Publishing revalidates public paths. Authenticated image uploads go directly to the public `blog-images` bucket under storage policies.

`supabase/schema.sql` is a manual reference migration; the app never executes it at startup.

## Contact and voice

Contact uses EmailJS only when all three values exist. Otherwise it opens a prefilled mail-client message. No private email credential is embedded.

Voice uses `NEXT_PUBLIC_VOICE_API_URL` as a public origin. It requests a short-lived, scenario-bound grant and validates the secure WebSocket before connecting. PCM streams through same-origin worklets. Provider credentials and signing material remain in the separate backend. Missing configuration leaves the UI safely offline.

## Styling and operational invariants

The root loads Geist and Geist Mono. `app/globals.css` owns the black, warm-paper and crimson marketing system. Work uses scoped per-project theme variables. Generated social images use `next/og`.

- Never expose secrets through `NEXT_PUBLIC_*`.
- Never weaken Supabase RLS because the anon key is public by design.
- Keep voice worklets in `public/voice/` and production on HTTPS.
- Keep the Work index routed through case studies—no direct demo links.
- Keep demo approvals explicit and supporting details read-only.
- Keep build-time Google Fonts access unless fonts are intentionally self-hosted.
