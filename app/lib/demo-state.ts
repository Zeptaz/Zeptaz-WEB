import type { WorkSlug } from './work';

export const CHANNELS = ['LinkedIn', 'Instagram', 'X'] as const;
export type Channel = typeof CHANNELS[number];
export const MEDIA_ITEMS = [
  { id: 'S1', name: 'Harbour Ledger', type: 'Web', claim: 'The policy follows a transition period.', duplicateOf: null, conflict: false },
  { id: 'S2', name: 'Transit Brief', type: 'Web', claim: 'Industry groups request clarification.', duplicateOf: null, conflict: false },
  { id: 'S3', name: 'Coastline News', type: 'Video', claim: 'The presenter describes an immediate effective date.', duplicateOf: null, conflict: true },
  { id: 'S4', name: 'Freight Monitor', type: 'Web', claim: 'Guidance is expected before enforcement.', duplicateOf: null, conflict: false },
  { id: 'S5', name: 'Regional Policy Office', type: 'Web', claim: 'The effective date will be confirmed in a separate notice.', duplicateOf: null, conflict: false },
  { id: 'S6', name: 'Port Dispatch', type: 'Web', claim: 'Republished Harbour Ledger coverage.', duplicateOf: 'S1', conflict: false },
  { id: 'S7', name: 'Cargo Review', type: 'Web', claim: 'Syndicated Transit Brief coverage.', duplicateOf: 'S2', conflict: false },
  { id: 'S8', name: 'Logistics Weekly', type: 'Video', claim: 'A video reading of the Policy Office notice.', duplicateOf: 'S5', conflict: false },
];
export const UNIQUE_MEDIA = MEDIA_ITEMS.filter(item => !item.duplicateOf);
export const MEDIA_SUMMARY = 'Eight captured items form five distinct reports. One disagrees on when the policy takes effect. The date remains unconfirmed pending a separate notice [S5]; the immediate-date claim [S3] conflicts with that guidance.';
export const SUPPORTED_COPY: Record<Channel, string> = {
  LinkedIn: 'Explore your next path at our October Open Day. Meet the team on 24 October and ask about current application dates.',
  Instagram: 'Your next chapter starts with a conversation. Join our Open Day on 24 October. #OpenDay',
  X: 'Open Day · 24 October. Explore programmes, meet the team, and ask about current application dates.',
};
export type RunStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'failed' | 'complete';
export interface DemoState {
  slug: WorkSlug; step: number; done: boolean; revision: number;
  name: string; email: string; consent: boolean; reply: string; captured: boolean; assigned: boolean;
  copies: Record<Channel, string>; approved: string | null;
  digest: string; digestPayload: string; digestStatus: 'pending' | 'ready' | 'error';
  writeAllowed: boolean; fixSelected: boolean; summary: string; uncertainty: boolean;
  run: RunStatus; tick: number; failNext: boolean; error: string; notice: string; events: string[];
}
export type DemoAction =
  | { type: 'reset' } | { type: 'advance' } | { type: 'correct' }
  | { type: 'edit'; field: 'name' | 'email' | 'reply' | 'summary'; value: string }
  | { type: 'copy'; channel: Channel; value: string }
  | { type: 'toggle'; field: 'consent' | 'writeAllowed' | 'fixSelected' | 'uncertainty'; value: boolean }
  | { type: 'digest'; payload: string; digest: string; failed?: boolean }
  | { type: 'retryDigest' } | { type: 'tick' } | { type: 'pause' } | { type: 'resume' }
  | { type: 'stop' } | { type: 'retry' } | { type: 'failure'; value: boolean };

export function leadReply(name: string) {
  return `Hi ${name.trim().split(/\s+/)[0] || 'there'}, thanks for your enquiry. Priya can confirm your documents and call you about the September intake.`;
}
export function createDemo(slug: WorkSlug): DemoState {
  return { slug, step: 0, done: false, revision: 1, name: 'Maya Perera', email: 'maya@example.com', consent: false,
    reply: leadReply('Maya Perera'), captured: false, assigned: false,
    copies: { ...SUPPORTED_COPY, LinkedIn: 'Explore our October Open Day. Applications close 30 September.' }, approved: null,
    digest: '', digestPayload: '', digestStatus: 'pending', writeAllowed: true, fixSelected: true,
    summary: MEDIA_SUMMARY, uncertainty: false, run: 'idle', tick: 0, failNext: false,
    error: '', notice: 'Choose the first action to begin.', events: [] };
}
export function payload(s: DemoState): string {
  switch (s.slug) {
    case 'lead-operations': return JSON.stringify({ name: s.name, email: s.email, consent: s.consent, reply: s.reply });
    case 'campaign-operations': return JSON.stringify({ copies: s.copies, artwork: 'open-day-v1', event: '2026-10-24', publishAt: '2026-10-18T09:00:00+05:30' });
    case 'operator-workstation': return JSON.stringify({ write: s.writeAllowed, fix: s.fixSelected, external: false, desktop: false });
    case 'media-intelligence': return JSON.stringify({ summary: s.summary, uncertainty: s.uncertainty, sources: UNIQUE_MEDIA.map(i => i.id) });
  }
}
export function isApproved(s: DemoState) { return s.approved !== null && s.approved === payload(s); }
export function claimError(copies: Record<Channel, string>): string {
  if (CHANNELS.some(c => !copies[c].trim())) return 'Every channel needs copy before review.';
  if (CHANNELS.some(c => /guarantee|applications?\s+close|deadline|tomorrow|30\s+september/i.test(copies[c]))) return 'Approval blocked: this deadline or guarantee has no supporting source.';
  return '';
}
function receipt(s: DemoState, message: string, update: Partial<DemoState> = {}): DemoState {
  return { ...s, ...update, error: '', notice: message, events: [...s.events, message] };
}
function invalidate(s: DemoState, changed: Partial<DemoState>): DemoState {
  const hadApproval = s.approved !== null;
  const reviewStep = s.slug === 'lead-operations' ? 4 : s.slug === 'campaign-operations' ? 4 : s.slug === 'operator-workstation' ? 3 : 4;
  return { ...s, ...changed, approved: null, done: false, run: 'idle', tick: 0, error: '',
    revision: s.revision + 1, digest: '', digestPayload: '', digestStatus: 'pending',
    step: changed.step ?? (hadApproval ? Math.min(s.step, reviewStep) : s.step),
    notice: hadApproval ? 'Content or permissions changed. Review and approve this version again.' : 'Changes saved in this demo.',
    events: hadApproval ? [...s.events, 'Approval revoked; pending work invalidated.'] : s.events };
}
export function demoReducer(s: DemoState, a: DemoAction): DemoState {
  if (a.type === 'reset') return { ...createDemo(s.slug), notice: 'Demo reset to its starting state.' };
  // Stop is terminal for this run: late timers, edits and navigation cannot resurrect it.
  if (s.run === 'stopped') return s;
  if (a.type === 'digest') {
    if (a.payload !== payload(s)) return s;
    return { ...s, digest: a.digest, digestPayload: a.payload, digestStatus: a.failed ? 'error' : 'ready' };
  }
  if (a.type === 'retryDigest') return { ...s, digestStatus: 'pending', error: '' };
  if (a.type === 'pause') return s.run === 'running' ? receipt(s, 'Session paused.', { run: 'paused' }) : s;
  if (a.type === 'resume') return s.run === 'paused' ? receipt(s, 'Session resumed.', { run: 'running' }) : s;
  if (a.type === 'stop') return ['running', 'paused'].includes(s.run) ? receipt(s, 'Session stopped. Partial work is available for review.', { run: 'stopped', done: false }) : s;
  if (a.type === 'failure') return { ...s, failNext: a.value };
  if (a.type === 'retry') return s.run === 'failed' ? receipt(s, 'Retry started; the saved input is unchanged.', { run: 'running', failNext: false }) : s;
  if (a.type === 'tick') {
    if (s.run !== 'running') return s;
    if (s.failNext && s.tick === 1) return receipt(s, 'Simulated worker interruption. Retry from this checkpoint.', { run: 'failed', failNext: false });
    const tick = s.tick + 1;
    if (tick < 4) return receipt(s, runLines(s)[tick - 1], { tick });
    if (s.slug === 'media-intelligence') return receipt(s, '8 items processed; 3 duplicates linked; 5 representative reports grouped.', { tick, run: 'complete', step: 2 });
    if (!isApproved(s)) return { ...s, run: 'idle', error: 'Approval is required before execution.' };
    return receipt(s, s.slug === 'campaign-operations' ? 'Approved version published in the simulation. Example report ready.' : 'Session log saved. Review the files, tests and remaining risk.', { tick, run: 'complete', done: true, step: s.slug === 'campaign-operations' ? 7 : 6 });
  }
  if (['running', 'paused'].includes(s.run)) return s;
  if (a.type === 'edit') {
    const changed: Partial<DemoState> = { [a.field]: a.value };
    if (a.field === 'name' && s.reply === leadReply(s.name)) changed.reply = leadReply(a.value);
    if (['name', 'email'].includes(a.field) && s.captured) Object.assign(changed, { captured: false, assigned: false, step: 2 });
    return invalidate(s, changed);
  }
  if (a.type === 'copy') return invalidate(s, { copies: { ...s.copies, [a.channel]: a.value } });
  if (a.type === 'toggle') {
    const next = invalidate(s, { [a.field]: a.value });
    if (a.field === 'consent' && !a.value) return { ...next, captured: false, assigned: false, step: Math.min(next.step, 2) };
    return next;
  }
  if (a.type === 'correct') return receipt(invalidate(s, { copies: { ...SUPPORTED_COPY } }), 'Unsupported wording replaced with the approved event details.', { step: Math.max(s.step, 2) });
  if (a.type !== 'advance' || s.done || s.run === 'failed') return s;
  const next = (message: string, update: Partial<DemoState> = {}) => receipt(s, message, { step: s.step + 1, ...update });
  const fail = (error: string) => ({ ...s, error, notice: '' });
  if (s.slug === 'lead-operations') {
    if (s.step === 0) return next('Question received. Answer prepared from two approved sources.');
    if (s.step === 1) return next('Source excerpts available. No contact record has been created.');
    if (s.step === 2) {
      if (!s.name.trim()) return fail('Enter a name for the demo contact.');
      if (!/^[^\s@]+@example\.(com|org|net)$/.test(s.email)) return fail('Use a fictional address such as maya@example.com.');
      if (!s.consent) return fail('Select contact permission before requesting a callback.');
      return next('Callback request captured with contact permission.', { captured: true });
    }
    if (s.step === 3) return s.captured ? next('Record checked; assigned to Priya S. Next action: review reply.', { assigned: true }) : fail('Capture a callback request first.');
    if (s.step === 4) return s.reply.trim() ? next('Reply ready for Priya to review.') : fail('Write a reply before continuing.');
    if (s.step === 5) return s.assigned && s.consent && s.reply.trim() ? next(`Priya approved reply v${s.revision}.`, { approved: payload(s) }) : fail('Complete intake and review the reply before approval.');
    if (s.step === 6) return isApproved(s) ? receipt(s, 'Callback scheduled: 10 Sep 2026, 14:30 SLST. Owner: Priya S.', { done: true }) : fail('Approve the current reply first.');
  }
  if (s.slug === 'campaign-operations') {
    if (s.step === 0) return next('Event brief opened. Review the claim before creating channel copy.');
    if (s.step <= 4) {
      const error = claimError(s.copies);
      if (error) return fail(error);
      return next(['', 'Claim checked against the event brief.', 'Supported wording ready for three channels.', 'Channel copy ready for version review.', 'Version ready for a named reviewer.'][s.step]);
    }
    if (s.step === 5) {
      const error = claimError(s.copies);
      if (error) return fail(error);
      if (s.digestStatus !== 'ready' || s.digestPayload !== payload(s)) return fail('Identify the current version before approving. Retry if needed.');
      return next(`Alex approved campaign v${s.revision}.`, { approved: payload(s) });
    }
    if (!isApproved(s)) return fail('Approve the current campaign version first.');
    if (s.step === 6) return next('Approved version scheduled: 18 Oct 2026, 09:00 SLST.');
    if (s.step === 7) return receipt(s, 'Simulated publish window reached. Starting the saved job.', { run: 'running', tick: 0 });
  }
  if (s.slug === 'operator-workstation') {
    if (s.step === 0) return next('Project Atlas context collected. One validation edge case needs attention.');
    if (s.step === 1) return next('Assessment ready. Choose whether to include the proposed fix.');
    if (s.step === 2) return next('Plan selected. Confirm the access this run may use.');
    if (s.step === 3) return next(s.writeAllowed && s.fixSelected ? 'Selected fix requires repository write. External actions remain off.' : 'Read-only assessment selected. No repository changes will be prepared.');
    if (s.step === 4) return next('Operator approved the selected plan and permissions.', { approved: payload(s) });
    if (s.step === 5) return isApproved(s) ? receipt(s, 'Supervised session started.', { run: 'running', tick: 0 }) : fail('Approve the selected plan first.');
  }
  if (s.slug === 'media-intelligence') {
    if (s.step === 0) return next('Eight fictional sources queued for processing.');
    if (s.step === 1) return receipt(s, 'Refresh started. Queue stages will update as they finish.', { run: 'running', tick: 0 });
    if (s.step === 2) return next('Five distinct reports grouped. One conflicts with the source guidance.');
    if (s.step === 3) return next('Conflicting claims retained. Summary prepared with source references.');
    if (s.step === 4) return s.summary.trim() ? next('Draft ready for analyst review.') : fail('Write a summary before review.');
    if (s.step === 5) {
      if (!s.uncertainty || !/\[S3\]/.test(s.summary) || !/\[S5\]/.test(s.summary)) return fail('Keep references [S3] and [S5], and acknowledge the unresolved effective date.');
      return next('Sam K. approved the brief with uncertainty noted.', { approved: payload(s) });
    }
    if (s.step === 6) return isApproved(s) ? receipt(s, 'Report prepared with evidence, uncertainty and reviewer decision.', { done: true }) : fail('Approve the current brief first.');
  }
  return s;
}
export function runLines(s: DemoState): string[] {
  if (s.slug === 'media-intelligence') return ['Six web articles and two video records captured.', 'Eight items validated; three duplicates linked.', 'Five representative items compared; one conflicting claim found.', 'Topic and evidence brief prepared.'];
  if (s.slug === 'campaign-operations') return ['Saved approval checked against the publishing payload.', 'Three channel jobs prepared from the approved version.', 'Simulated channel deliveries recorded.', 'Example report prepared.'];
  return ['Project context locked; external actions remain off.', 'Baseline: 41 tests pass; 1 validation edge case fails.', s.fixSelected && s.writeAllowed ? 'Validation fix and regression test prepared in two files.' : s.fixSelected ? 'Write access off. Assessment prepared; repository unchanged.' : 'Fix not selected. Assessment prepared; repository unchanged.', s.fixSelected && s.writeAllowed ? '42 tests pass in the simulated focused suite.' : '41 tests pass; 1 failure retained for the owner.'];
}
export function actionLabel(s: DemoState): string {
  const labels: Record<WorkSlug, string[]> = {
    'lead-operations': ['Ask about requirements', 'Request a callback', 'Submit callback request', 'Assign to Priya', 'Continue to approval', 'Approve reply', 'Schedule callback'],
    'campaign-operations': ['Review the brief', 'Check claims', 'Create channel copy', 'Review version', 'Continue to approval', 'Approve this version', 'Schedule approved version', 'Simulate publishing'],
    'operator-workstation': ['Assess Project Atlas', 'Review proposed actions', 'Review permissions', 'Review selected plan', 'Approve selected plan', 'Start supervised run', 'Review evidence'],
    'media-intelligence': ['Queue eight sources', 'Process source queue', 'Compare conflicting claims', 'Prepare sourced draft', 'Review brief', 'Approve with uncertainty noted', 'Create report'],
  };
  return labels[s.slug][s.step];
}

// Public guided journey. Stage and generation tokens reject skipped or late actions.
export interface GuidedState {
  slug: WorkSlug; stage: number; generation: number;
  status: 'intro' | 'ready' | 'busy' | 'paused' | 'error' | 'complete';
  evidence: DemoState;
}
export type GuidedAction =
  | { type: 'restart' } | { type: 'pause' } | { type: 'resume' }
  | { type: 'start' | 'next' | 'retry' | 'finish' | 'failed'; stage: number; generation: number; digest?: string };
export function createGuided(slug: WorkSlug): GuidedState {
  return { slug, stage: 0, generation: 0, status: 'intro', evidence: createDemo(slug) };
}
export function guidedReducer(s: GuidedState, a: GuidedAction): GuidedState {
  if (a.type === 'restart') return { ...createGuided(s.slug), generation: s.generation + 1 };
  if (a.type === 'pause') return s.status === 'busy' ? { ...s, status: 'paused', generation: s.generation + 1 } : s;
  if (a.type === 'resume') return s.status === 'paused' ? { ...s, status: 'busy' } : s;
  if (a.generation !== s.generation || a.stage !== s.stage) return s;
  if (a.type === 'start') return s.status === 'intro' ? { ...s, status: 'ready' } : s;
  if (a.type === 'retry') return s.status === 'error' ? { ...s, status: 'busy', generation: s.generation + 1 } : s;
  if (a.type === 'next') return s.status === 'ready' && s.stage < 5 ? { ...s, status: 'busy' } : s;
  if (a.type === 'failed') return s.status === 'busy' ? { ...s, status: 'error' } : s;
  if (a.type !== 'finish' || s.status !== 'busy') return s;
  let e = { ...s.evidence };
  const approve = () => { e.approved = payload(e); };
  if (s.slug === 'lead-operations') {
    if (s.stage === 1) e.consent = true; // The fictional customer requested contact.
    if (s.stage === 2) { e.captured = true; e.assigned = true; }
    if (s.stage === 3) { if (!e.consent || !e.assigned) return { ...s, status: 'error' }; approve(); }
  }
  if (s.slug === 'campaign-operations') {
    if (s.stage === 2) { e.copies = { ...SUPPORTED_COPY }; e.revision = 2; }
    if (s.stage === 3) {
      if (claimError(e.copies) || !/^[a-f0-9]{64}$/.test(a.digest ?? '')) return { ...s, status: 'error' };
      e.digest = a.digest!; e.digestPayload = payload(e); e.digestStatus = 'ready'; approve();
    }
  }
  if (s.slug === 'operator-workstation' && s.stage === 2) {
    if (!e.writeAllowed || !e.fixSelected) return { ...s, status: 'error' };
    approve();
  }
  if (s.slug === 'operator-workstation' && s.stage === 3 && !isApproved(e)) return { ...s, status: 'error' };
  if (s.slug === 'media-intelligence' && s.stage === 4) {
    if (!e.summary.includes('[S3]') || !e.summary.includes('[S5]')) return { ...s, status: 'error' };
    e.uncertainty = true; approve();
  }
  if (s.stage === 4 && !isApproved(e)) return { ...s, status: 'error' };
  e = { ...e, done: s.stage === 4, events: [...e.events, `Step ${s.stage + 1} completed${isApproved(e) ? ' · approved snapshot retained' : ''}.`] };
  return { ...s, stage: s.stage + 1, status: s.stage === 4 ? 'complete' : 'ready', evidence: e };
}
