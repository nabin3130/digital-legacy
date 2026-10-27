const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.InputEvent = dom.window.InputEvent;
global.CompositionEvent = dom.window.CompositionEvent;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = clearTimeout;
dom.window.HTMLElement.prototype.scrollIntoView = function () {};
let reduceMotion = false;
dom.window.matchMedia = () => ({ matches: reduceMotion });

require.extensions['.css'] = module => { module.exports = new Proxy({}, { get: (_, name) => String(name) }); };
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
  });
  module._compile(output.outputText, filename);
};

const React = require('react');
const { act, createElement: h } = React;
const { createRoot } = require('react-dom/client');
const Stage = require('../components/HomeWizardStage.tsx').default;
const Module = require('node:module');
const path = require('node:path');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.join(__dirname, '..', name.slice(2)) : name, ...args);
};
const { useHomeJourney } = require('../components/useHomeJourney.ts');
global.localStorage = dom.window.localStorage;
let stageScrolls = 0;
let topScrolls = 0;
dom.window.HTMLElement.prototype.scrollIntoView = function () { stageScrolls++; };
dom.window.scrollTo = ({ top }) => { assert.equal(top, 0); topScrolls++; };

async function settle(callback = () => {}) {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  try { await act(callback); } finally { global.IS_REACT_ACT_ENVIRONMENT = false; }
}

function Harness({ english }) {
  const journey = useHomeJourney(english);
  return h(React.Fragment, null,
    h('a', { href: '#start' }, '안내 시작하기'),
    h(Stage, { step: journey.step, scrollOnChange: journey.scrollOnChange },
      h('section', null, h('h2', null, journey.step),
        h('button', { onClick: () => journey.chooseAudience('mine') }, 'audience'),
        h('button', { onClick: () => journey.chooseGoal('download') }, 'goal'),
        h('button', { onClick: journey.goBack }, 'back'))),
    h('button', { onClick: journey.resetJourney }, 'reset'));
}
async function finishTransition() { await settle(() => new Promise(resolve => setTimeout(resolve, 300))); }

for (const english of [false, true]) test(`${english ? 'EN' : 'KO'}: stored hydration stays silent, active steps focus, reset clears hash and returns to top`, async () => {
  const pathname = english ? '/en' : '/';
  const key = english ? 'logout-guide-state-en' : 'logout-guide-state';
  window.history.replaceState(null, '', pathname);
  localStorage.clear();
  localStorage.setItem(key, JSON.stringify({ audience: 'deceased', goal: 'delete' }));
  stageScrolls = 0; topScrolls = 0;
  const host = document.createElement('div'); document.body.append(host);
  const root = createRoot(host);
  try {
    await settle(() => root.render(h(Harness, { english })));
    await finishTransition();
    assert.equal(host.querySelector('[data-wizard-step]').dataset.wizardStep, 'services');
    assert.equal(stageScrolls, 0, 'restoration must not scroll the stage');
    assert.equal(topScrolls, 1, 'a hash-free open starts at the hero');
    assert.notEqual(document.activeElement, host.querySelector('h2'));
    assert.equal(window.location.hash, '');
    assert.equal(host.querySelector('a').getAttribute('href'), '#start');
    await settle(() => host.querySelectorAll('button')[0].click());
    await finishTransition();
    assert.ok(stageScrolls > 0);
    assert.equal(document.activeElement.textContent, 'goal');
    assert.equal(window.location.hash, '#audience=mine');
    await settle(() => host.querySelectorAll('button')[1].click());
    await finishTransition();
    assert.equal(document.activeElement.textContent, 'services');
    const scrolls = stageScrolls;
    await settle(() => host.querySelectorAll('button')[3].click());
    await finishTransition();
    assert.equal(localStorage.getItem(key), null);
    assert.equal(window.location.pathname, pathname);
    assert.equal(window.location.hash, '');
    assert.equal(topScrolls, 2);
    assert.equal(stageScrolls, scrolls, 'reset must not scroll back down after returning to top');
    assert.equal(host.querySelector('[data-wizard-step]').dataset.wizardStep, 'audience');
  } finally { await settle(() => root.unmount()); host.remove(); }
});

for (const reduce of [false, true]) test(`audience hash hydration is silent; later history transitions focus (reduced motion: ${reduce})`, async () => {
  reduceMotion = reduce;
  window.history.replaceState(null, '', '/#audience=unsure&guide=safe');
  localStorage.clear();
  localStorage.setItem('logout-guide-state', JSON.stringify({ audience: 'deceased', goal: 'delete' }));
  stageScrolls = 0; topScrolls = 0;
  const host = document.createElement('div'); document.body.append(host);
  const root = createRoot(host);
  try {
    await settle(() => root.render(h(Harness)));
    await finishTransition();
    assert.equal(host.querySelector('[data-wizard-step]').dataset.wizardStep, 'safe');
    assert.equal(stageScrolls, 0); assert.equal(topScrolls, 0);
    assert.notEqual(document.activeElement, host.querySelector('h2'));
    for (const [hash, step] of [['#audience=mine&goal=download', 'services'], ['#audience=mine', 'goal'], ['', 'audience']]) {
      window.history.replaceState(null, '', '/' + hash);
      await settle(() => window.dispatchEvent(new dom.window.PopStateEvent('popstate')));
      await finishTransition();
      assert.equal(host.querySelector('[data-wizard-step]').dataset.wizardStep, step);
      assert.equal(document.activeElement.textContent, step);
    }
    assert.ok(stageScrolls > 0);
    assert.equal(window.location.hash, '');
  } finally { reduceMotion = false; await settle(() => root.unmount()); host.remove(); }
});
