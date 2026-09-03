import assert from 'node:assert/strict';
import test from 'node:test';

import { CASE_STUDIES, clampDemoStep, isWorkSlug } from './work.ts';

test('publishes exactly four distinct portfolio projects', () => {
  assert.equal(CASE_STUDIES.length, 4);
  assert.equal(new Set(CASE_STUDIES.map(({ slug }) => slug)).size, 4);
});

test('each project has a complete guided demo and honest implementation note', () => {
  for (const study of CASE_STUDIES) {
    assert.ok(study.demoSteps.length >= 6, `${study.slug} needs at least six demo steps`);
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
