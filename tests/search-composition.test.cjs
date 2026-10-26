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
const { useCompositionSearch } = require('../components/useCompositionSearch.ts');

async function settle(callback = () => {}) {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  try { await act(callback); } finally { global.IS_REACT_ACT_ENVIRONMENT = false; }
}

function Harness({ wizard }) {
  const search = useCompositionSearch();
  const screen = h('section', null,
    h('h2', null, '검색'),
    h('input', { ...search.inputProps, 'aria-label': '회사 검색' }),
    h('output', null, search.query),
    h('ul', null, ...['카카오', '구글'].filter(name => !search.query || name.includes(search.query)).map(name => h('li', { key: name }, name))),
    h('button', { onClick: () => search.reset('') }, '초기화'),
  );
  return wizard ? h(Stage, { step: 'audience' }, screen) : screen;
}

for (const wizard of [true, false]) test(`${wizard ? 'home stage' : 'directory'}: Hangul draft remains visible, filters only after compositionend, and English updates immediately`, async () => {
  const host = document.createElement('div'); document.body.append(host);
  const root = createRoot(host);
  try {
    await settle(() => root.render(h(Harness, { wizard })));
    const input = host.querySelector('input'); input.focus();
    const nativeSetter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set;
    const change = async (value, composing) => {
      nativeSetter.call(input, value);
      input.dispatchEvent(new dom.window.InputEvent('input', { bubbles: true, data: value, inputType: composing ? 'insertCompositionText' : 'insertText', isComposing: composing }));
      // Assert before passive effects can catch up: this reproduces the original stage snapshot rollback.
      assert.equal(input.value, value, 'React must not restore the previous rendered value');
      await settle();
      assert.equal(host.querySelector('input'), input, 'typing must not remount the DOM input');
      assert.equal(document.activeElement, input, 'typing must preserve focus');
    };
    input.dispatchEvent(new dom.window.CompositionEvent('compositionstart', { bubbles: true }));
    for (const partial of ['ㅋ', '카', '카ㅋ', '카카', '카카오']) {
      await change(partial, true);
      assert.equal(host.querySelector('output').textContent, '');
      assert.equal(host.querySelectorAll('li').length, 2);
    }
    const confirm = new dom.window.KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', keyCode: 229, isComposing: true });
    input.dispatchEvent(confirm); assert.equal(confirm.defaultPrevented, true, 'IME Enter must not submit a search');
    await settle(() => input.dispatchEvent(new dom.window.CompositionEvent('compositionend', { bubbles: true, data: '카카오' })));
    assert.equal(input.value, '카카오');
    assert.equal(host.querySelector('output').textContent, '카카오');
    assert.equal(host.querySelectorAll('li').length, 1);
    // Some browsers send a final input after compositionend; keep the committed result.
    await change('카카오', false);
    const safariConfirm = new dom.window.KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', keyCode: 229 });
    input.dispatchEvent(safariConfirm); assert.equal(safariConfirm.defaultPrevented, true);
    const submit = new dom.window.KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', keyCode: 13 });
    input.dispatchEvent(submit); assert.equal(submit.defaultPrevented, false);
    await settle(() => host.querySelector('button').click());
    for (const value of ['k', 'ka', 'kakao']) {
      await change(value, false);
      assert.equal(host.querySelector('output').textContent, value);
    }
  } finally { await settle(() => root.unmount()); host.remove(); }
});

test('native isComposing protects the draft even when compositionstart was not delivered', async () => {
  const host = document.createElement('div'); document.body.append(host);
  const root = createRoot(host);
  try {
    await settle(() => root.render(h(Harness, { wizard: false })));
    const input = host.querySelector('input');
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set.call(input, '카');
    await settle(() => input.dispatchEvent(new dom.window.InputEvent('input', { bubbles: true, isComposing: true })));
    assert.equal(input.value, '카'); assert.equal(host.querySelector('output').textContent, '');
    await settle(() => input.dispatchEvent(new dom.window.CompositionEvent('compositionend', { bubbles: true })));
    assert.equal(host.querySelector('output').textContent, '카');
  } finally { await settle(() => root.unmount()); host.remove(); }
});

test('a same-step parent update cannot cancel an entering screen timer; reduced motion swaps immediately', async () => {
  const host = document.createElement('div'); document.body.append(host);
  const root = createRoot(host);
  const screen = (step, label) => h(Stage, { step }, h('section', null, h('h2', null, label), h('input', { defaultValue: '' })));
  try {
    await settle(() => root.render(screen('audience', '상황')));
    await settle(() => root.render(screen('goal', '목적')));
    await settle(() => new Promise(resolve => setTimeout(resolve, 150)));
    await settle(() => root.render(screen('goal', '목적 갱신')));
    await settle(() => new Promise(resolve => setTimeout(resolve, 150)));
    assert.equal(host.querySelector('[inert]'), null);
    assert.equal(host.querySelectorAll('section').length, 1);
    assert.equal(document.activeElement.textContent, '목적 갱신');
    reduceMotion = true;
    await settle(() => root.render(screen('audience', '상황')));
    assert.equal(host.querySelector('[data-wizard-step]').dataset.wizardStep, 'audience');
    assert.equal(host.querySelector('[inert]'), null);
  } finally { reduceMotion = false; await settle(() => root.unmount()); host.remove(); }
});
