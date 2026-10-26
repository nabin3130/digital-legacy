const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

// Compile these two pure TypeScript modules for Node's built-in runner; no new test dependency.
require.extensions['.ts'] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }, fileName: filename,
  });
  module._compile(output.outputText, filename);
};
const { emptyJourney, normalizeJourney, previousJourney, homeStep, journeyHash, journeyFromHash, companyJourneyHref, restoreJourney } = require('../lib/home-journey.ts');

test('normal journey exposes a single logical step and goes back without an external history entry', () => {
  const audience = normalizeJourney({ audience: 'deceased' });
  const services = normalizeJourney({ ...audience, goal: 'delete' });
  assert.equal(homeStep(emptyJourney), 'audience');
  assert.equal(homeStep(audience), 'goal');
  assert.equal(homeStep(services), 'services');
  assert.deepEqual(previousJourney(services), audience);
  assert.deepEqual(previousJourney(audience), emptyJourney);
});

test('SafeGuide survives reload, then services goes back to safe, goals and audience', () => {
  const safe = journeyFromHash('#audience=unsure&guide=safe');
  assert.equal(homeStep(safe), 'safe');
  const services = normalizeJourney({ ...safe, goal: 'download', safe: false });
  assert.equal(journeyHash(services), '#audience=unsure&goal=download&via=safe');
  assert.deepEqual(journeyFromHash(journeyHash(services)), services);
  assert.deepEqual(previousJourney(services), safe);
  const goals = previousJourney(safe);
  assert.equal(homeStep(goals), 'goal');
  assert.deepEqual(previousJourney(goals), emptyJourney);
});

test('old localStorage shape and hash links remain compatible; invalid state is normalized', () => {
  assert.equal(homeStep(normalizeJourney({ audience: 'mine', goal: 'download' })), 'services');
  assert.deepEqual(journeyFromHash('#start'), emptyJourney);
  assert.deepEqual(journeyFromHash('#audience=invalid&goal=download'), emptyJourney);
  assert.equal(journeyFromHash('#audience=mine&goal=memorial').goal, null);
  assert.equal(journeyFromHash('#audience=mine&guide=safe').safe, false);
  assert.equal(journeyFromHash('#goal=delete').goal, null);
});

test('company links carry audience and goal in both languages; unsure is never silently deceased', () => {
  assert.equal(companyJourneyHref('kakao', 'deceased', 'delete'), '/company/kakao?audience=deceased&goal=delete');
  assert.equal(companyJourneyHref('kakao', 'mine', 'download', true), '/en/company/kakao?audience=mine&goal=download');
  assert.equal(companyJourneyHref('google', 'unsure', 'download'), '/company/google?audience=unsure&goal=download');
  assert.equal(companyJourneyHref('apple', null, null), '/company/apple');
});

test('first load resumes localStorage even at #start; refresh hash and browser back take precedence', () => {
  const saved = { audience: 'deceased', goal: 'delete' };
  assert.equal(homeStep(restoreJourney('', saved)), 'services');
  assert.equal(homeStep(restoreJourney('#start', saved)), 'services');
  assert.equal(restoreJourney('#audience=mine&goal=download', saved).audience, 'mine');
  assert.equal(homeStep(restoreJourney('#audience=unsure&guide=safe', saved)), 'safe');
  assert.deepEqual(restoreJourney('#start', saved, true), emptyJourney);
  assert.deepEqual(restoreJourney('', saved, true), emptyJourney);
  assert.deepEqual(restoreJourney('', null), emptyJourney);
});
