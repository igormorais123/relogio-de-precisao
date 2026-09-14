// Visual QA capture: node tools/shot.mjs --tag r1 [--points 0,0.3,...] [--mobile] [--url http://127.0.0.1:5198/]
import {createRequire} from 'node:module';
import {mkdirSync, writeFileSync} from 'node:fs';
const require = createRequire('C:/Users/IgorPC/.claude/skills/playwright-cli/node_modules/');
const {chromium} = require('playwright');

const arg = (name, fallback) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : fallback; };
const tag = arg('tag', 'shot'), mobile = process.argv.includes('--mobile');
const url = arg('url', 'http://127.0.0.1:5198/') + '?quality=high';
const points = arg('points', mobile ? '0.2,1.2,2.3,3.35,4.25,5' : '0.2,0.7,1.25,1.95,2.3,2.7,3.0,3.35,3.8,4.25,4.7,5').split(',').map(Number);
const out = `shots/${tag}`;
mkdirSync(out, {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true, args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']});
const context = await browser.newContext({viewport: mobile ? {width: 390, height: 844} : {width: 1440, height: 900}, deviceScaleFactor: 1});
const page = await context.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text().slice(0, 240)}`); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
const started = Date.now();
await page.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000});
await page.waitForTimeout(350);
await page.screenshot({path: `${out}/${mobile ? 'm' : 'd'}-preloader.jpg`, type: 'jpeg', quality: 86});
await page.waitForFunction(() => window.__aula?.ready, null, {timeout: 90000}).catch(() => errors.push('cena não ficou pronta'));
const loadMs = Date.now() - started;
const report = {tag, mobile, loadMs, shots: []};
for (const p of points) {
  await page.evaluate(v => window.__aula.goto(v), p);
  await page.waitForTimeout(1300);
  const file = `${out}/${mobile ? 'm' : 'd'}-${p.toFixed(2)}.jpg`;
  await page.screenshot({path: file, type: 'jpeg', quality: 86});
  const calls = await page.evaluate(() => document.getElementById('stage').dataset.calls);
  report.shots.push({p, file, calls: Number(calls)});
}
report.fps = await page.evaluate(() => new Promise(r => { let f = 0; const t0 = performance.now(); const loop = () => { f++; if (performance.now() - t0 < 1500) requestAnimationFrame(loop); else r(Math.round(f / 1.5)); }; requestAnimationFrame(loop); }));
report.stage = await page.evaluate(() => ({...document.getElementById('stage').dataset}));
report.errors = errors;
writeFileSync(`${out}/${mobile ? 'mobile' : 'desktop'}-report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({tag, mobile, loadMs, fps: report.fps, stage: report.stage, calls: report.shots.map(s => s.calls), errors: errors.slice(0, 10)}, null, 1));
await browser.close();
