import http from './http.js'

const DASHBOARD_CACHE_STORAGE_KEY = 'phone_holder_analyzer_dashboard_cache_v1'
const DATA_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

function canUseLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function writeDataCache(cacheKey, data) {
  if (!canUseLocalStorage()) {
    return
  }

  try {
    window.localStorage.setItem(
      cacheKey,
      JSON.stringify({
        cachedAt: Date.now(),
        data,
      }),
    )
  } catch {
    // Cache write failure should not block the page.
  }
}

function readDataCache(cacheKey) {
  if (!canUseLocalStorage()) {
    return null
  }

  try {
    const rawCache = window.localStorage.getItem(cacheKey)

    if (!rawCache) {
      return null
    }

    const parsedCache = JSON.parse(rawCache)
    const cachedAt = Number(parsedCache?.cachedAt)
    const data = parsedCache?.data

    if (!Number.isFinite(cachedAt)) {
      return null
    }

    if (Date.now() - cachedAt > DATA_CACHE_MAX_AGE_MS) {
      return null
    }

    return data
  } catch {
    return null
  }
}

export function getCachedDashboard() {
  const dashboard = readDataCache(DASHBOARD_CACHE_STORAGE_KEY)

  if (!dashboard || typeof dashboard !== 'object' || Array.isArray(dashboard)) {
    return null
  }

  return dashboard
}

export async function getDashboard(options = {}) {
  const dashboard = await http.get('/api/dashboard', {
    ...options,
    errorMessages: { default: '获取 Dashboard 数据失败' },
  })

  if (!dashboard || typeof dashboard !== 'object' || Array.isArray(dashboard)) {
    throw new Error('Dashboard 数据格式不正确')
  }

  writeDataCache(DASHBOARD_CACHE_STORAGE_KEY, dashboard)

  return dashboard
}
