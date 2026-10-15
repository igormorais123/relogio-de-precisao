import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const root = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(root, '../.verify')
const chrome = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const url = process.env.F1_LOOP_URL || 'http://127.0.0.1:5174/'
mkdirSync(outDir, { recursive: true })

const userData = resolve(outDir, 'chrome-profile')
mkdirSync(userData, { recursive: true })

const shot = resolve(outDir, 'hero.png')
const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1440,900',
  `--user-data-dir=${userData}`,
  '--virtual-time-budget=12000',
  `--screenshot=${shot}`,
  url,
]

const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] })
let stderr = ''
child.stderr.on('data', (d) => { stderr += d.toString() })
const code = await new Promise((resolveCode) => child.on('close', resolveCode))
writeFileSync(resolve(outDir, 'chrome.log'), stderr)
if (code !== 0) {
  console.error('chrome saiu com', code)
  console.error(stderr.slice(-800))
  process.exit(code || 1)
}
console.log('screenshot', shot)
