// Run a production server on 3107 and headless Chrome with remote debugging on 9227.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const origin = process.env.WORK_TEST_ORIGIN || 'http://localhost:3107';
const tabs = await (await fetch('http://127.0.0.1:9227/json')).json();
const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) { pending.get(message.id)?.(message); pending.delete(message.id); }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
});
const call = (method, params = {}) => new Promise(resolve => { const key = ++id; pending.set(key, resolve); ws.send(JSON.stringify({ id: key, method, params })); });
const evaluate = async expression => {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.result?.exceptionDetails) throw new Error(JSON.stringify(result.result.exceptionDetails));
  return result.result?.result?.value;
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const wait = async expression => {
  for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await delay(150); }
  throw new Error(`Timed out: ${expression}`);
};
const text = () => evaluate('document.body.innerText');
const includes = value => wait(`document.body.innerText.includes(${JSON.stringify(value)})`);
const button = async value => { await evaluate(`(() => { const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(value)}); if (!b) throw Error('Missing button: ' + ${JSON.stringify(value)}); b.click(); })()`); await delay(150); };
const advance = async () => { await evaluate(`document.querySelector('[class*="taskAction"] button').click()`); await delay(150); };
const checkbox = async label => { await evaluate(`(() => { const l = [...document.querySelectorAll('label')].find(l => l.textContent.includes(${JSON.stringify(label)})); l.querySelector('input').click(); })()`); await delay(150); };
const edit = async (label, value) => {
  await evaluate(`(() => { const l = [...document.querySelectorAll('label')].find(l => l.textContent.includes(${JSON.stringify(label)})); const e = l.querySelector('input,textarea'); const proto = e.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, ${JSON.stringify(value)}); e.dispatchEvent(new Event('input', {bubbles:true})); })()`);
  await delay(150);
};
const navigate = async path => { await call('Page.navigate', { url: origin + path }); await wait('document.readyState === "complete"'); await delay(650); };
const viewport = (width, height = 1000) => call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
const screenshot = async name => { const shot = await call('Page.captureScreenshot', { format: 'png' }); const path = join(tmpdir(), `zeptaz-${name}.png`); writeFileSync(path, Buffer.from(shot.result.data, 'base64')); console.log('Screenshot:', path); };
const primary = async () => {
  await wait('document.querySelector("[data-testid=guided-next]") && !document.querySelector("[data-testid=guided-next]").disabled');
  await evaluate('document.querySelector("[data-testid=guided-next]").click()');
};
const at = async stage => {
  await wait(`document.querySelector('[data-testid="portfolio-demo"]')?.dataset.stage === '${stage}' && ['ready','complete','intro'].includes(document.querySelector('[data-testid="portfolio-demo"]').dataset.status)`);
  await delay(450);
};
try {
  await call('Page.enable'); await call('Runtime.enable');
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await viewport(1440);
  await navigate('/work');
  assert.equal(await evaluate('document.querySelectorAll(`a[href$="/demo"]`).length'), 0, 'Work index must not link directly to demos');
  assert.equal(await evaluate('document.querySelectorAll(`.work-card-actions a`).length'), 4, 'Each Work card has one case-study action');
  assert.equal(await evaluate('[...document.querySelectorAll(`.work-card-actions a`)].every(a => !a.getAttribute("href").endsWith("/demo"))'), true);
  for (const width of [320,375,768,1024,1440]) {
    await viewport(width); await delay(150);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Work overflow ' + width);
  }
  const slugs = ['lead-operations','campaign-operations','operator-workstation','media-intelligence'];
  for (const slug of slugs) {
    await navigate('/work/' + slug + '/demo'); await at('intro');
    await primary(); await at(1);
    for (let stage = 1; stage <= 6; stage++) {
      await at(stage);
      assert.equal(await evaluate('document.querySelectorAll("[data-testid=portfolio-demo] input, [data-testid=portfolio-demo] textarea, [data-testid=portfolio-demo] select").length'), 0);
      assert.equal(await evaluate('document.querySelectorAll("[aria-label=\\"Walkthrough chapters\\"]").length'), 0);
      if (stage < 6) {
        assert.equal(await evaluate('[...document.querySelectorAll("button")].some(b=>b.textContent.includes("See supporting details"))'), false);
        assert.equal(await evaluate('document.querySelectorAll("[data-testid=guided-next]").length'), 1);
      }
      for (const width of [320,768,1440]) {
        await viewport(width); await delay(120);
        assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), slug + ' step ' + stage + ' overflow ' + width);
        if (width === 320 && stage === 3) {
          await evaluate('document.querySelector("[data-testid=portfolio-demo]").scrollIntoView()');
          await screenshot('guided-mobile-' + slug);
        }
      }
      if (stage === 3 || stage === 6) {
        await evaluate('document.querySelector("[data-testid=portfolio-demo]").scrollIntoView()');
        await screenshot('guided-' + slug + '-' + stage);
      }
      if (stage < 6) {
        if (slug === 'campaign-operations' && stage === 4) {
          await evaluate('window.savedDigest = crypto.subtle.digest; crypto.subtle.digest = () => Promise.reject(new Error("Simulated unavailable digest"))');
          await primary();
          await includes('This step could not finish');
          assert.equal(await evaluate('document.querySelector("[data-testid=portfolio-demo]").dataset.stage'), '4');
          await evaluate('crypto.subtle.digest = window.savedDigest; delete window.savedDigest');
        }
        await primary();
        // Repeated clicks during processing must not queue another action.
        await evaluate('document.querySelector("[data-testid=guided-next]").click()');
        await at(stage + 1);
        await delay(1000);
        assert.equal(await evaluate('document.querySelector("[data-testid=portfolio-demo]").dataset.stage'), String(stage + 1));
      }
    }
    await button('See supporting details');
    await wait('document.querySelector("dialog").open');
    await includes('Fictional evidence');
    assert.equal(await evaluate('document.querySelectorAll("dialog input,dialog textarea").length'), 0);
    await call('Input.dispatchKeyEvent', {type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await call('Input.dispatchKeyEvent', {type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await wait('!document.querySelector("dialog").open');
    await wait('document.activeElement.textContent.trim() === "See supporting details"');
    await button('Replay walkthrough'); await at('intro');
  }
  await navigate('/work/lead-operations');
  await wait('!!document.querySelector("[data-testid=guided-next]")');
  await evaluate('document.querySelector("[data-testid=portfolio-demo]").scrollIntoView()');
  await primary(); await at(1); await primary(); await at(2);
  await button('Start over'); await includes('This clears your progress');
  await button('Keep my place'); await at(2);
  await button('Start over'); await button('Yes, start over'); await at('intro');
  await primary(); await at(1); await primary(); await at(2);
  await evaluate('[...document.querySelectorAll("a")].find(a=>a.textContent.includes("Expand view")).click()');
  await wait('location.pathname.endsWith("/demo")'); await at(2);
  await evaluate('[...document.querySelectorAll("a")].find(a=>a.textContent.includes("Back to case study")).click()');
  await wait('!location.pathname.endsWith("/demo")'); await at(2);
  await primary();
  await evaluate('[...document.querySelectorAll("a")].find(a=>a.textContent.includes("Exit walkthrough")).click()');
  await wait('location.pathname === "/work"');
  await delay(1300);
  await evaluate('[...document.querySelectorAll(".work-card-actions a")].find(a=>a.getAttribute("href")==="/work/lead-operations").click()');
  await wait('location.pathname === "/work/lead-operations"');
  await evaluate('document.querySelector("[data-testid=portfolio-demo]").scrollIntoView()');
  await includes('Continue walkthrough');
  assert.equal(await evaluate('document.querySelector("[data-testid=portfolio-demo]").dataset.stage'),'2');
  await primary(); await at(3);
  await navigate('/work/lead-operations/demo'); await at('intro');
  assert.equal(await evaluate('fetch("/work/not-a-project").then(r=>r.status)'),404);
  await navigate('/contact?project=media-intelligence');
  await wait('document.querySelector("textarea")?.value.includes("Media intelligence desk")');
  assert.deepEqual(errors, []);
  console.log('PASS: Four fixed six-screen journeys, every-stage responsive checks, no sandbox controls, double clicks, end-only details, keyboard dismissal/focus, confirmed restart, expand/back persistence, exit pause/resume, refresh reset and contact context.');
} finally { ws.close(); }
