# Guided Work showcases: implementation and QA

## Experience

The four public demos use one fixed introduction → six-screen story → result sequence. Each screen has a prepared scenario, actor label, short explanation and one forward action. Visitors never type, select a mode, skip chapters, switch channels or trigger failure experiments. Approval remains an explicit click. Read-only supporting details unlock only after completion.

The Work index and case-study pages keep Zeptaz's theme. Lead uses light teal, campaign light amber, workstation a dark cyan console, and media light purple. Work cards have one “View case study” action and never link directly to a demo; the case study establishes context before presenting the guided walkthrough.

## Architecture and boundaries

- `app/lib/work.ts` defines the six screens, action labels, actors, introductory stories and recaps.
- `guidedReducer` in `demo-state.ts` enforces stage-specific transitions and approval prerequisites. Stage/generation tokens reject duplicate actions and callbacks from previous runs. The underlying scenario reducer and its regression tests remain as invariant coverage; it is not exposed as a public sandbox.
- `DemoSessions` retains one guided state per project during client navigation. Expand/back and exit/return preserve the place. Refresh clears it; no local storage or database is used.
- `PortfolioDemo` renders only the active scene. Actions run a short 900ms simulated processing transition; reading and approval never advance automatically. Hidden/offscreen/unmounted processing pauses. Resume is explicit. Restart requires confirmation during the journey and invalidates old work.
- `GuidedScene` renders the four prepared scenarios and completion-only supporting evidence. It receives read-only state, not a mutation dispatcher.
- Campaign approval computes an actual browser SHA-256 digest over the corrected posts, fixed artwork version, event and scheduled time. A missing digest blocks approval with a same-step retry. This is not a production security boundary or an AI fact-checker.
- Contacts, consent, sources, dates, reviewers, test output and example report metrics are fictional. The visitor does not supply contact permission on behalf of themselves. No messages, publishing, repository writes or deployment occur.
- Media counts remain eight captured items, three repeats, five distinct reports and one disagreement. Uncertainty stays in the displayed report and supporting evidence.
- Existing project routes, canonical URLs, share images and contextual contact CTAs remain intact. Expanded demos omit the marketing navigation/footer.

## Verification

1. Run `npm run test:work` for the guided contract plus underlying approval, timer, consent, permission, retry and source-count regression tests.
2. Run `npm run build` for production/TypeScript verification. The existing Google Fonts build step needs network access.
3. Run `npm run start -- --port 3108`, then open `http://localhost:3108/work`.
4. For automated Chrome QA, launch an isolated headless profile with loopback-only debugging on port 9227. Set `WORK_TEST_ORIGIN=http://localhost:3108` and run `node scripts/work-smoke.mjs`. Its default server port is 3107. Screenshots go to the OS temp directory; the contact form is never submitted.

The browser test covers all six screens of all four demos at 320, 768 and 1440px; Work-page widths from 320–1440px; missing sandbox controls; repeated clicks; completion-only details; keyboard dialog dismissal/focus; confirmed restart; expansion persistence; exit pause/resume; refresh reset; contact context and unknown routes.

## Human acceptance before publishing

Have three non-technical reviewers complete a demo unaided and explain the problem, what the system handled, what the person approved and the result. Revise any screen that prompts “What do I click?” This user research cannot be substituted by automated tests.

Also review the report's browser print preview and target assistive technologies/browsers. Automated Chrome checks are not a full accessibility or cross-browser audit. Deployment and narrated recordings are separate publishing actions.
