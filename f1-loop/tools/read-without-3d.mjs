// Checks "Ler a aula sem 3D" in two moments: while the car downloads and before the download starts.
// The download must stop (or never start), no canvas stays behind, focus lands on the lesson, and
// switching back to cinema still loads the car. node tools/read-without-3d.mjs
import {createRequire} from 'node:module';
const require = createRequire('C:/Users/IgorPC/.claude/skills/playwright-cli/node_modules/');
const {chromium} = require('playwright');
const browser = await chromium.launch({channel: 'chrome', headless: true, args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']});
const slow = {offline: false, latency: 80, downloadThroughput: 250 * 1024 / 8, uploadThroughput: 250 * 1024 / 8};
const fast = {offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1};

async function scenario(name, clickWhen) {
  const context = await browser.newContext({viewport: {width: 1440, height: 900}});
  const page = await context.newPage();
  // One entry per request object: the reload after returning to cinema must not overwrite the first download.
  const glb = new Map();
  let glbStarted;
  const started = new Promise(resolve => { glbStarted = resolve; });
  page.on('request', r => { if (/\.glb/.test(r.url())) { glb.set(r, {url: r.url().split('/').pop(), state: 'pedido'}); glbStarted(); } });
  page.on('requestfailed', r => { if (glb.has(r)) glb.get(r).state = 'cancelado: ' + (r.failure()?.errorText || ''); });
  page.on('requestfinished', r => { if (glb.has(r)) glb.get(r).state = 'concluido'; });
  const glbNow = () => [...glb.values()].map(g => ({...g}));
  const errors = [];
  page.on('pageerror', e => errors.push(e.message.slice(0, 200)));
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
  // Hold only the car: scripts load at full speed, so the click lands on a live page with the download open.
  let release = () => {};
  const held = new Promise(resolve => { release = resolve; });
  if (clickWhen === 'durante') await page.route('**/*.glb', async route => { await Promise.race([held, new Promise(r => setTimeout(r, 20000))]); await route.continue().catch(() => {}); });
  else await cdp.send('Network.emulateNetworkConditions', slow);
  await page.goto('http://127.0.0.1:5198/', {waitUntil: 'domcontentloaded'});
  if (clickWhen === 'durante') { await Promise.race([started, new Promise(r => setTimeout(r, 60000))]); await page.waitForTimeout(800); }
  await page.click('#preload-read');
  await page.waitForTimeout(clickWhen === 'durante' ? 2500 : 8000);
  const reading = await page.evaluate(() => ({
    reading: document.body.classList.contains('reading'),
    loadState: document.getElementById('load-state').textContent,
    canvases: document.querySelectorAll('#stage canvas').length,
    focus: document.activeElement?.id || document.activeElement?.tagName,
  }));
  reading.glb = glbNow();
  release(); await page.unroute('**/*.glb').catch(() => {});
  await cdp.send('Network.emulateNetworkConditions', fast);
  await page.click('#reading');
  const cinemaReady = await page.waitForFunction(() => window.__aula?.ready, null, {timeout: 90000}).then(() => true, () => false);
  const cinema = await page.evaluate(() => ({reading: document.body.classList.contains('reading'), loadState: document.getElementById('load-state').textContent, canvases: document.querySelectorAll('#stage canvas').length}));
  cinema.glb = glbNow();
  await context.close();
  return {name, reading, cinemaReady, cinema, errors};
}

const results = [await scenario('durante o download', 'durante'), await scenario('antes do download', 'antes')];
console.log(JSON.stringify(results, null, 1));
await browser.close();
