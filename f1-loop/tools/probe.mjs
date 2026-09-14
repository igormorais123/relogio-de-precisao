// Isolate a look problem: node tools/probe.mjs <progress> <tag> "js expression run in page before capture"
import {createRequire} from 'node:module';
import {mkdirSync} from 'node:fs';
const require = createRequire('C:/Users/IgorPC/.claude/skills/playwright-cli/node_modules/');
const {chromium} = require('playwright');
const [p = '0.2', tag = 'probe', code = ''] = process.argv.slice(2);
mkdirSync('shots/probe', {recursive: true});
const browser = await chromium.launch({channel: 'chrome', headless: true, args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']});
const page = await (await browser.newContext({viewport: {width: 1440, height: 900}})).newPage();
page.on('console', m => { if (m.type() === 'log') console.log('page:', m.text()); });
await page.goto('http://127.0.0.1:5198/?quality=high&debug=1');
await page.waitForFunction(() => window.__aula?.ready, null, {timeout: 90000});
await page.evaluate(v => window.__aula.goto(v), Number(p));
await page.waitForTimeout(900);
if (code) console.log('result:', await page.evaluate(code));
await page.waitForTimeout(Number(process.argv[5] ?? 900));
await page.screenshot({path: `shots/probe/${tag}.jpg`, type: 'jpeg', quality: 86});
await browser.close();
