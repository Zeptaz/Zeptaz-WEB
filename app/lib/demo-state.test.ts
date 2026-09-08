import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemo, demoReducer, payload, isApproved, claimError, runLines, MEDIA_ITEMS, UNIQUE_MEDIA, type DemoState } from './demo-state.ts';
import type { WorkSlug } from './work.ts';
import { createGuided, guidedReducer, type GuidedState } from './demo-state.ts';
import { CASE_STUDIES } from './work.ts';

function guidedAction(s: GuidedState, type: 'start' | 'next' | 'finish' | 'failed' | 'retry') {
  return { type, stage: s.stage, generation: s.generation, digest: 'a'.repeat(64) };
}
function guidedNext(s: GuidedState) {
  return guidedReducer(guidedReducer(s, guidedAction(s, 'next')), guidedAction(s, 'finish'));
}
for (const study of CASE_STUDIES) {
  test(`${study.slug}: six ordered screens, explicit approval and no duplicate advancement`, () => {
    assert.equal(study.demoSteps.length, 6);
    assert.equal(study.demoSteps[5].action, null);
    let s = createGuided(study.slug);
    assert.equal(guidedReducer(s, guidedAction(s, 'next')), s);
    s = guidedReducer(s, guidedAction(s, 'start'));
    const approval = study.slug === 'operator-workstation' ? 2 : study.slug === 'media-intelligence' ? 4 : 3;
    for (let stage = 0; stage < 5; stage++) {
      assert.equal(s.stage, stage);
      assert.equal(isApproved(s.evidence), stage > approval);
      assert.equal(guidedReducer(s, { ...guidedAction(s, 'next'), stage: stage + 1 }), s);
      const stale = guidedAction(s, 'finish');
      assert.equal(guidedReducer(s, stale), s, 'a timer alone cannot authorize advancement');
      s = guidedNext(s);
      assert.equal(guidedReducer(s, stale), s, 'duplicate completion does not advance twice');
    }
    assert.equal(s.status, 'complete');
    assert.equal(s.evidence.done, true);
    assert.equal(isApproved(s.evidence), true);
    assert.equal(guidedReducer(s, guidedAction(s, 'next')), s);
  });
}
test('guided restart and pause invalidate old callbacks, even at the same step', () => {
  let s = createGuided('lead-operations');
  s = guidedReducer(s, guidedAction(s, 'start'));
  s = guidedReducer(s, guidedAction(s, 'next'));
  const old = guidedAction(s, 'finish');
  s = guidedReducer(s, { type: 'pause' });
  assert.equal(guidedReducer(s, old), s);
  s = guidedReducer(s, { type: 'resume' });
  assert.equal(guidedReducer(s, old), s);
  s = guidedReducer(s, { type: 'restart' });
  assert.equal(s.status, 'intro');
  s = guidedReducer(s, guidedAction(s, 'start'));
  s = guidedReducer(s, guidedAction(s, 'next'));
  assert.equal(guidedReducer(s, old), s);
});
test('guided failures retry the same step without fabricating success', () => {
  let s = createGuided('campaign-operations');
  s = guidedReducer(s, guidedAction(s, 'start'));
  for (let i = 0; i < 3; i++) s = guidedNext(s);
  s = guidedReducer(s, guidedAction(s, 'next'));
  s = guidedReducer(s, { ...guidedAction(s, 'finish'), digest: '' });
  assert.equal(s.status, 'error');
  assert.equal(s.stage, 3);
  assert.equal(isApproved(s.evidence), false);
  s = guidedReducer(s, guidedAction(s, 'retry'));
  s = guidedReducer(s, guidedAction(s, 'finish'));
  assert.equal(s.stage, 4);
  assert.equal(isApproved(s.evidence), true);
});
test('guided execution rejects missing consent, permissions, or changed approval', () => {
  let s = createGuided('lead-operations');
  s = guidedReducer(s, guidedAction(s, 'start'));
  for (let i = 0; i < 3; i++) s = guidedNext(s);
  const noConsent = guidedNext({ ...s, evidence: { ...s.evidence, consent: false } });
  assert.equal(noConsent.status, 'error');
  s = guidedNext(s);
  const changed = guidedNext({ ...s, evidence: { ...s.evidence, reply: 'Changed after approval' } });
  assert.equal(changed.status, 'error');
  let w = createGuided('operator-workstation');
  w = guidedReducer(w, guidedAction(w, 'start'));
  w = guidedNext(guidedNext(w));
  assert.equal(guidedNext({ ...w, evidence: { ...w.evidence, writeAllowed: false } }).status, 'error');
});

function identify(s: DemoState) { return demoReducer(s, { type: 'digest', payload: payload(s), digest: 'a'.repeat(64) }); }
function ready(slug: WorkSlug, step: number) {
  let s = createDemo(slug);
  s = demoReducer(s, { type: 'toggle', field: 'consent', value: true });
  s = demoReducer(s, { type: 'toggle', field: 'uncertainty', value: true });
  for (let i = 0; i < 40 && s.step < step; i++) {
    if (slug === 'campaign-operations' && claimError(s.copies)) s = demoReducer(s, { type: 'correct' });
    s = identify(s);
    s = demoReducer(s, { type: s.run === 'running' ? 'tick' : 'advance' });
  }
  assert.equal(s.step, step);
  return s;
}
function finishRun(s: DemoState) { for (let i = 0; i < 4; i++) s = demoReducer(s, { type: 'tick' }); return s; }

test('lead capture requires a nonempty name, fictional email and consent', () => {
  let s = demoReducer(demoReducer(createDemo('lead-operations'), { type: 'advance' }), { type: 'advance' });
  assert.match(demoReducer(s, { type: 'advance' }).error, /permission/);
  s = demoReducer(s, { type: 'toggle', field: 'consent', value: true });
  s = demoReducer(s, { type: 'edit', field: 'name', value: ' ' });
  assert.match(demoReducer(s, { type: 'advance' }).error, /name/);
  s = demoReducer(s, { type: 'edit', field: 'name', value: 'Jordan Lee' });
  s = demoReducer(s, { type: 'edit', field: 'email', value: 'invalid' });
  assert.match(demoReducer(s, { type: 'advance' }).error, /fictional/);
  assert.equal(s.captured, false);
  s = demoReducer(s, { type: 'edit', field: 'email', value: 'jordan@example.com' });
  s = demoReducer(s, { type: 'advance' });
  assert.equal(s.captured, true);
  assert.match(s.reply, /^Hi Jordan,/);
});
test('viewing an approval chapter does not approve; its action does', () => {
  let s = ready('lead-operations', 5);
  assert.equal(isApproved(s), false);
  s = demoReducer(s, { type: 'advance' });
  assert.equal(isApproved(s), true);
  assert.equal(s.done, false);
  s = demoReducer(s, { type: 'advance' });
  assert.equal(s.done, true);
  assert.match(s.notice, /14:30 SLST/);
});
test('editing a captured contact returns to intake and invalidates prior approval', () => {
  let s = ready('lead-operations', 6);
  s = demoReducer(s, { type: 'edit', field: 'name', value: 'Jordan Lee' });
  assert.equal(s.step, 2); assert.equal(s.assigned, false); assert.equal(s.captured, false); assert.equal(isApproved(s), false);
});
test('revoking contact consent removes eligibility for a callback', () => {
  const s = demoReducer(ready('lead-operations', 6), { type: 'toggle', field: 'consent', value: false });
  assert.equal(isApproved(s), false); assert.equal(s.captured, false); assert.equal(s.step, 2);
});
test('every channel is checked, not only the active editor', () => {
  const s = ready('campaign-operations', 4);
  const changed = demoReducer(s, { type: 'copy', channel: 'Instagram', value: 'Guaranteed outcomes tomorrow' });
  assert.match(claimError(changed.copies), /blocked/);
  assert.equal(demoReducer(changed, { type: 'advance' }).step, 4);
});
test('an approved and scheduled campaign loses its approval on any variant edit', () => {
  let s = ready('campaign-operations', 7);
  assert.equal(isApproved(s), true);
  s = demoReducer(s, { type: 'copy', channel: 'X', value: 'Join our Open Day on 24 October.' });
  assert.equal(s.step, 4); assert.equal(s.approved, null); assert.equal(s.done, false); assert.equal(s.digestStatus, 'pending');
});
test('stale fingerprints are ignored and unavailable fingerprints block approval', () => {
  let s = ready('campaign-operations', 5);
  const stale = payload(s);
  s = demoReducer(s, { type: 'copy', channel: 'X', value: 'Meet the team on 24 October.' });
  assert.equal(demoReducer(s, { type: 'digest', payload: stale, digest: 'old' }).digestStatus, 'pending');
  s = demoReducer(s, { type: 'digest', payload: payload(s), digest: '', failed: true });
  assert.equal(demoReducer(s, { type: 'advance' }).approved, null);
  assert.equal(demoReducer(s, { type: 'retryDigest' }).digestStatus, 'pending');
});
test('scheduled campaign completes only after the simulated worker finishes', () => {
  let s = ready('campaign-operations', 7);
  assert.equal(s.done, false);
  s = demoReducer(s, { type: 'advance' });
  assert.equal(s.run, 'running'); assert.equal(s.done, false);
  s = finishRun(s); assert.equal(s.done, true); assert.equal(s.run, 'complete');
});
test('denying write produces an assessment with the failing test retained', () => {
  let s = ready('operator-workstation', 3);
  s = demoReducer(s, { type: 'toggle', field: 'writeAllowed', value: false });
  for (let i = 0; i < 3; i++) s = demoReducer(s, { type: 'advance' });
  s = finishRun(s);
  assert.equal(s.done, true); assert.match(runLines(s)[2], /repository unchanged/); assert.match(runLines(s)[3], /1 failure retained/);
});
test('approved selected fix produces two files and passing test evidence', () => {
  const s = finishRun(demoReducer(ready('operator-workstation', 5), { type: 'advance' }));
  assert.equal(s.done, true); assert.match(runLines(s)[2], /two files/); assert.match(runLines(s)[3], /42 tests pass/);
});
test('pause stops progress until explicit resume', () => {
  let s = demoReducer(ready('operator-workstation', 5), { type: 'advance' });
  s = demoReducer(s, { type: 'pause' });
  assert.strictEqual(demoReducer(s, { type: 'tick' }), s);
  s = demoReducer(s, { type: 'resume' });
  assert.equal(demoReducer(s, { type: 'tick' }).tick, 1);
});
test('stop is terminal against timers, navigation, permissions and resume', () => {
  let s = demoReducer(ready('operator-workstation', 5), { type: 'advance' });
  s = demoReducer(s, { type: 'tick' }); s = demoReducer(s, { type: 'stop' });
  for (const type of ['tick', 'advance', 'resume'] as const) assert.strictEqual(demoReducer(s, { type }), s);
  assert.strictEqual(demoReducer(s, { type: 'toggle', field: 'writeAllowed', value: false }), s);
  assert.equal(s.done, false); assert.equal(s.tick, 1);
});
test('reset restores the fixture after completion or interruption; late ticks do nothing', () => {
  for (const slug of ['lead-operations', 'campaign-operations', 'operator-workstation', 'media-intelligence'] as const) {
    const s = demoReducer(ready(slug, 5), { type: 'reset' });
    assert.deepEqual({ ...s, notice: '' }, { ...createDemo(slug), notice: '' });
    assert.strictEqual(demoReducer(s, { type: 'tick' }), s);
  }
});
test('media fixtures reconcile eight items, three duplicates, five representatives and one conflict', () => {
  assert.equal(MEDIA_ITEMS.length, 8); assert.equal(UNIQUE_MEDIA.length, 5);
  assert.equal(MEDIA_ITEMS.filter(x => x.duplicateOf).length, 3);
  assert.equal(UNIQUE_MEDIA.filter(x => x.conflict).length, 1);
  for (const item of MEDIA_ITEMS.filter(x => x.duplicateOf)) assert.ok(UNIQUE_MEDIA.some(x => x.id === item.duplicateOf));
});
test('failed processing can retry without fabricating completed stages', () => {
  let s = ready('media-intelligence', 1);
  s = demoReducer(s, { type: 'failure', value: true }); s = demoReducer(s, { type: 'advance' });
  s = demoReducer(s, { type: 'tick' }); s = demoReducer(s, { type: 'tick' });
  assert.equal(s.run, 'failed'); assert.equal(s.tick, 1); assert.equal(s.step, 1);
  s = demoReducer(s, { type: 'retry' }); s = finishRun(s);
  assert.equal(s.step, 2); assert.equal(s.run, 'complete');
});
test('media approval requires uncertainty and citations; edits revoke it', () => {
  let s = ready('media-intelligence', 5);
  s = demoReducer(s, { type: 'toggle', field: 'uncertainty', value: false });
  assert.match(demoReducer(s, { type: 'advance' }).error, /references/);
  s = demoReducer(s, { type: 'toggle', field: 'uncertainty', value: true });
  s = demoReducer(s, { type: 'advance' }); assert.equal(isApproved(s), true);
  s = demoReducer(s, { type: 'advance' }); assert.equal(s.done, true);
  s = demoReducer(s, { type: 'edit', field: 'summary', value: 'Changed after approval' });
  assert.equal(isApproved(s), false); assert.equal(s.done, false); assert.equal(s.step, 4);
});
