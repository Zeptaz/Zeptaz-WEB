import assert from 'node:assert/strict';
import test from 'node:test';

import { CASE_STUDIES, clampDemoStep, isWorkSlug } from './work.ts';

test('publishes exactly four distinct portfolio projects', () => {
  assert.equal(CASE_STUDIES.length, 4);
  assert.equal(new Set(CASE_STUDIES.map(({ slug }) => slug)).size, 4);
});

test('each project has a complete guided demo and honest implementation note', () => {
  for (const study of CASE_STUDIES) {
    assert.equal(study.demoSteps.length, 6, `${study.slug} must keep the fixed six-screen flow`);
    assert.equal(study.demoSteps.at(-1)?.action, null, `${study.slug} result screen must not advance`);
    assert.ok(study.demoSteps.slice(0, -1).every((step) => step.action), `${study.slug} needs one action per working screen`);
    assert.ok(study.features.length >= 4, `${study.slug} needs enough feature detail`);
    assert.match(study.implementationNote, /simulat|synthetic|working/i);
    assert.ok(study.workflow.length >= 5);
  }
});

test('slug validation and step bounds are deterministic', () => {
  assert.equal(isWorkSlug('lead-operations'), true);
  assert.equal(isWorkSlug('not-a-project'), false);
  assert.equal(clampDemoStep(-5, 7), 0);
  assert.equal(clampDemoStep(99, 7), 6);
  assert.equal(clampDemoStep(3, 7), 3);
});
