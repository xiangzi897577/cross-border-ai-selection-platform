import { existsSync } from 'node:fs'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'

const DEFAULT_BASE_URL = 'http://127.0.0.1:5176'
const DEFAULT_PRODUCT_ID = '1'
const DEFAULT_SLOW_API_DELAY_MS = 4000
const DEFAULT_TIMEOUT_MS = 45000

const PAGE_TARGETS = [
  {
    name: 'Dashboard',
    path: '/',
    selectors: ['.dashboard-page__hero'],
  },
  {
    name: 'Products',
    path: '/products',
    selectors: ['.product-card'],
  },
  {
    name: 'Analysis',
    path: '/analysis',
    selectors: ['.analysis-card'],
  },
  {
    name: 'ProductDetail',
    path: `/products/${process.env.PERF_PRODUCT_ID || DEFAULT_PRODUCT_ID}`,
    selectors: ['.detail-page__hero'],
  },
  {
    name: 'Favorites',
    path: '/favorites',
    selectors: ['.favorite-card', '.page-note--empty'],
  },
]

function parseOptions() {
  const args = new Set(process.argv.slice(2))
  const slow = args.has('--slow') || process.env.PERF_SLOW === '1'
  const baseUrl = normalizeBaseUrl(process.env.PERF_BASE_URL || DEFAULT_BASE_URL)
  const apiDelayMs = slow
    ? Number(process.env.PERF_SLOW_API_DELAY_MS || DEFAULT_SLOW_API_DELAY_MS)
    : 0

  return {
    apiDelayMs: Number.isFinite(apiDelayMs) ? apiDelayMs : DEFAULT_SLOW_API_DELAY_MS,
    baseUrl,
    browserChannel: process.env.PERF_BROWSER_CHANNEL || 'msedge',
    slow,
    timeoutMs: Number(process.env.PERF_TIMEOUT_MS || DEFAULT_TIMEOUT_MS),
  }
}

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || '').replace(/\/+$/, '')
}

function toPageUrl(baseUrl, pagePath) {
  return `${baseUrl}${pagePath}`
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function loadPlaywright() {
  try {
    return await import('playwright')
  } catch (error) {
    const fallback = await loadPlaywrightFromKnownModulePaths()

    if (fallback) {
      return fallback
    }

    throw new Error(
      'Playwright is not installed. Run npm install in the package that owns the perf script, then retry.',
      { cause: error },
    )
  }
}

async function loadPlaywrightFromKnownModulePaths() {
  const moduleDirs = [
    path.join(process.cwd(), 'node_modules'),
    process.env.PLAYWRIGHT_MODULE_DIR,
    ...String(process.env.NODE_PATH || '')
      .split(path.delimiter)
      .filter(Boolean),
  ].filter(Boolean)

  for (const moduleDir of moduleDirs) {
    const playwrightPath = path.join(moduleDir, 'playwright', 'index.mjs')

    if (existsSync(playwrightPath)) {
      return import(pathToFileURL(playwrightPath).href)
    }
  }

  return null
}

async function waitForFirstMeaningfulContent(page, target, timeoutMs) {
  const selectorPromises = target.selectors.map((selector) =>
    page.waitForSelector(selector, { state: 'visible', timeout: timeoutMs }).then(() => selector),
  )

  try {
    return await Promise.any(selectorPromises)
  } catch (error) {
    throw new Error(
      `${target.name} did not show any expected selector within ${timeoutMs}ms: ${target.selectors.join(', ')}`,
      { cause: error },
    )
  }
}

async function measurePage(context, target, options) {
  const page = await context.newPage()
  const url = toPageUrl(options.baseUrl, target.path)
  const startedAt = performance.now()

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: options.timeoutMs })
    const matchedSelector = await waitForFirstMeaningfulContent(page, target, options.timeoutMs)

    return {
      matchedSelector,
      ms: Math.round(performance.now() - startedAt),
      url,
    }
  } finally {
    await page.close()
  }
}

async function createMeasuredContext(browser, options) {
  const context = await browser.newContext()

  if (options.slow) {
    await context.route('**/api/**', async (route) => {
      await delay(options.apiDelayMs)
      await route.continue()
    })
  }

  return context
}

async function measureTarget(browser, target, options) {
  const context = await createMeasuredContext(browser, options)

  try {
    const noClientCache = await measurePage(context, target, options)
    const cacheHit = await measurePage(context, target, options)
    const savedMs = noClientCache.ms - cacheHit.ms
    const improvement = noClientCache.ms > 0 ? Math.round((savedMs / noClientCache.ms) * 100) : 0

    return {
      page: target.name,
      noClientCacheMs: noClientCache.ms,
      cacheHitMs: cacheHit.ms,
      savedMs,
      improvement: `${improvement}%`,
      firstSelector: noClientCache.matchedSelector,
      cacheSelector: cacheHit.matchedSelector,
    }
  } finally {
    await context.close()
  }
}

async function main() {
  const options = parseOptions()
  const { chromium } = await loadPlaywright()
  const browser = await chromium.launch({
    channel: options.browserChannel,
    headless: true,
  })

  try {
    const results = []

    for (const target of PAGE_TARGETS) {
      results.push(await measureTarget(browser, target, options))
    }

    console.log(
      `Performance measurement: ${options.slow ? `slow API (${options.apiDelayMs}ms)` : 'normal API'}`,
    )
    console.log(`Base URL: ${options.baseUrl}`)
    console.log(`Browser: Microsoft Edge Headless (${options.browserChannel})`)
    console.table(results)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error.message)

  if (error.cause?.message) {
    console.error(error.cause.message)
  }

  process.exitCode = 1
})
