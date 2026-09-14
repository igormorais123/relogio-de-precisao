import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../.verify')
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: [
    '--use-angle=d3d11',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--window-size=1440,900',
  ],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
})

const page = await browser.newPage()
const errors = []
const logs = []
page.on('pageerror', (err) => errors.push(String(err)))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
  else logs.push(`${msg.type()}: ${msg.text()}`)
})

await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle0', timeout: 45000 })
await page.waitForFunction(() => {
  const pre = document.getElementById('preloader')
  return pre?.classList.contains('is-done') || !document.getElementById('unsupported')?.hidden
}, { timeout: 25000 }).catch(() => {})
await new Promise((r) => setTimeout(r, 900))

const state = await page.evaluate(() => {
  const pre = document.getElementById('preloader')
  const unsupported = document.getElementById('unsupported')
  const app = window.__app
  return {
    title: document.title,
    preloaderDone: pre?.classList.contains('is-done') || false,
    unsupported: unsupported ? !unsupported.hidden : null,
    hasApp: Boolean(app),
    chapter: app?.scroll?.chapter ?? null,
    chapters: document.querySelectorAll('#scroll section').length,
    dots: document.querySelectorAll('#dots a').length,
    canvas: Boolean(document.getElementById('gl')),
    canvasW: document.getElementById('gl')?.width || 0,
    canvasH: document.getElementById('gl')?.height || 0,
    fichaEssencia: document.getElementById('ficha-essencia')?.textContent || '',
    clock: document.getElementById('clock')?.textContent || '',
  }
})

await page.screenshot({ path: resolve(outDir, 'cap-0.png'), fullPage: false })

if (state.hasApp) {
  await page.evaluate(() => window.__app.scroll.to(0, 0.22))
  await new Promise((r) => setTimeout(r, 1400))
  await page.screenshot({ path: resolve(outDir, 'cap-0b.png'), fullPage: false })
  await page.evaluate(() => window.__app.scroll.to(2, 0.55))
  await new Promise((r) => setTimeout(r, 1600))
  state.chapterAfterJump = await page.evaluate(() => window.__app.scroll.chapter)
  state.localAfterJump = await page.evaluate(() => window.__app.scroll.local)
  state.fichaAfter = await page.evaluate(() => document.getElementById('ficha-essencia')?.textContent || '')
  state.fichaHidden = await page.evaluate(() => document.getElementById('ficha')?.getAttribute('aria-hidden'))
  await page.screenshot({ path: resolve(outDir, 'cap-2.png'), fullPage: false })

  await page.click('#reg-btn')
  await new Promise((r) => setTimeout(r, 300))
  state.dossieOpen = await page.evaluate(() => !document.getElementById('registro')?.hidden)
  await page.screenshot({ path: resolve(outDir, 'dossie.png'), fullPage: false })
}

await browser.close()
console.log(JSON.stringify({ state, errors, logCount: logs.length }, null, 2))
if (errors.length) process.exitCode = 2
if (!state.hasApp && !state.unsupported) process.exitCode = 3
