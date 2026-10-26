const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const test = require('node:test');
const ts = require('typescript');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<html><body></body></html>', { url: 'http://localhost/' });
global.window = dom.window;
global.self = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
dom.window.HTMLElement.prototype.scrollIntoView = function () {};
global.PopStateEvent = dom.window.PopStateEvent;
global.localStorage = dom.window.localStorage;
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
global.requestAnimationFrame = callback => setTimeout(callback, 0);
require.extensions['.css'] = module => { module.exports = new Proxy({}, { get: (_, name) => String(name) }); };
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
  }).outputText, filename);
};
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.join(__dirname, '..', name.slice(2)) : name, ...args);
};
const React = require('react');
const { act, createElement: h } = React;
const { createRoot } = require('react-dom/client');
const { selectedGuideRoute } = require('../components/CompanyGuideShell.tsx');
async function settle(callback = () => {}) {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  try { await act(callback); } finally { global.IS_REACT_ACT_ENVIRONMENT = false; }
}
async function mount(name, url, props = {}) {
  window.history.replaceState(null, '', url);
  const host = document.createElement('div'); document.body.append(host);
  const root = createRoot(host);
  const Component = require(`../components/${name}.tsx`).default;
  await settle(() => root.render(h(Component, props)));
  return { host, close: async () => { await settle(() => root.unmount()); host.remove(); } };
}
function menu(host) { return host.querySelector('nav'); }
function current(host) { return menu(host)?.querySelector('[aria-current="page"]'); }

test('route selection honors valid IDs, falls back on invalid/absent IDs, and tolerates an empty group', () => {
  const items = [{ id: 'download', title: 'Download' }, { id: 'delete', title: 'Delete' }];
  assert.equal(selectedGuideRoute(items, 'delete'), items[1]);
  assert.equal(selectedGuideRoute(items, null), items[0]);
  assert.equal(selectedGuideRoute(items, 'bad'), items[0]);
  assert.equal(selectedGuideRoute([], null), undefined);
});

for (const prefix of ['', 'English']) for (const company of ['Google', 'Apple', 'Naver']) {
  test(`${prefix}${company}: entry, query goal, grouped jumps, focus, hash and root restore`, async () => {
    const base = `/${prefix ? 'en/' : ''}company/${company.toLowerCase()}`;
    const { host, close } = await mount(`${prefix}${company}AccountFlow`, base);
    try {
      assert.equal(menu(host), null, 'entry keeps the audience cards');
      const buttons = [...host.querySelectorAll('button')];
      await settle(() => buttons[0].click());
      assert.ok(menu(host));
      assert.ok(current(host));
      assert.equal(host.querySelectorAll('main').length, 1);
      assert.equal(host.querySelector('select'), null);
      const groups = menu(host).querySelectorAll('ul');
      await settle(() => groups[0].querySelectorAll('button')[1].click());
      assert.equal(current(host), groups[0].querySelectorAll('button')[1]);
      await settle(() => groups[1].querySelector('button').click());
      assert.equal(current(host), groups[1].querySelector('button'));
      assert.equal(host.querySelectorAll('main').length, 1);
      await new Promise(resolve => setTimeout(resolve, 10));
      assert.equal(document.activeElement, host.querySelector('main h1'));
      // Simulate a fresh deep link, including home query goal.
      window.history.replaceState(null, '', `${base}?audience=mine&goal=download`);
      await settle(() => window.dispatchEvent(new PopStateEvent('popstate')));
      assert.match(current(host).textContent, /download|Save my data|내 데이터를|보관/i);
      window.history.replaceState(null, '', `${base}#account=deceased&route=${company === 'Google' ? 'close-deceased' : company === 'Apple' ? 'delete-account' : 'delete'}${company === 'Naver' ? '&knows-id=yes' : ''}`);
      await settle(() => window.dispatchEvent(new dom.window.HashChangeEvent('hashchange')));
      assert.match(current(host).textContent, /닫고|삭제|탈퇴|deletion|close|delete/i);
      assert.equal(host.querySelectorAll('main').length, 1);
      // Reset must remove home query context, and remain at entry after a refresh-style event.
      await settle(() => host.querySelector('section > button').click());
      assert.equal(window.location.search, '');
      await settle(() => window.dispatchEvent(new PopStateEvent('popstate')));
      assert.equal(menu(host), null);
    } finally { await close(); }
  });
}

for (const prefix of ['', 'English']) test(`${prefix}standard company: download query, all five companies and cross-audience routes`, async () => {
  const { companies } = require('../lib/data.ts');
  for (const slug of ['kakao', 'meta', 'instagram', 'samsung', 'x']) {
    const company = companies.find(company => company.slug === slug);
    assert.ok(company);
    const { getCompanySteps } = require('../lib/company-guidance.ts');
    const { xApplicationSteps } = require('../lib/x-guidance.ts');
    const allSteps = slug === 'x' ? xApplicationSteps : getCompanySteps(company);
    const steps = { preDeathSteps: allSteps.filter(step => step.journey === 'pre_death'), postDeathSteps: allSteps.filter(step => step.journey === 'post_death') };
    const { host, close } = await mount(`${prefix}CompanyAccountFlow`, `/${prefix ? 'en/' : ''}company/${slug}?audience=mine&goal=download`, { company, initialAudience: 'mine', preDeathSteps: steps.preDeathSteps, postDeathSteps: steps.postDeathSteps });
    try {
      assert.ok(current(host));
      assert.match(current(host).textContent, /다운로드|download|archive/i);
      assert.equal(host.querySelector('select'), null);
      window.history.replaceState(null, '', `/${prefix ? 'en/' : ''}company/${slug}?audience=mine&goal=delete`);
      await settle(() => window.dispatchEvent(new PopStateEvent('popstate')));
      assert.match(current(host).textContent, /삭제|비활성화|delete/i);
      for (const item of menu(host).querySelectorAll('li button')) {
        await settle(() => item.click());
        assert.equal(current(host), item);
        assert.equal(host.querySelectorAll('main').length, 1);
      }
    } finally { await close(); }
  }
});

test('Naver keeps the selected parent topic while answering the ID question', async () => {
  const { host, close } = await mount('NaverAccountFlow', '/company/naver#account=deceased&route=npay');
  try {
    assert.match(current(host).textContent, /네이버페이/);
    assert.match(host.querySelector('main h1').textContent, /아이디/);
    await settle(() => host.querySelector('main button').click());
    assert.match(host.querySelector('main h1').textContent, /금액/);
    assert.match(window.location.hash, /route=npay/);
    assert.match(window.location.hash, /knows-id=yes/);
  } finally { await close(); }
});
