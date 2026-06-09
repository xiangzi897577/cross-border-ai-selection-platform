import http, { getClientId, withClientIdHeader } from './http.js'

const FAVORITES_CACHE_STORAGE_PREFIX = 'phone_holder_analyzer_favorites_cache_v1'
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

function getFavoritesCacheKey() {
  return `${FAVORITES_CACHE_STORAGE_PREFIX}_${getClientId()}`
}

function writeFavoritesCache(favorites) {
  if (Array.isArray(favorites)) {
    writeDataCache(getFavoritesCacheKey(), favorites)
  }
}

function updateFavoritesCache(updater) {
  const currentFavorites = getCachedFavorites()
  const nextFavorites = updater(currentFavorites)

  if (Array.isArray(nextFavorites)) {
    writeFavoritesCache(nextFavorites)
  }
}

export function getCachedFavorites() {
  const favorites = readDataCache(getFavoritesCacheKey())

  if (!Array.isArray(favorites)) {
    return []
  }

  return favorites
}

export async function getFavorites(options = {}) {
  const favorites = await http.get(
    '/api/favorites',
    withClientIdHeader({
      ...options,
      errorMessages: { default: '获取候选池商品失败' },
    }),
  )

  if (!Array.isArray(favorites)) {
    throw new Error('候选池商品数据格式不正确')
  }

  writeFavoritesCache(favorites)

  return favorites
}

export async function addFavorite(productId, options = {}) {
  const favoriteResult = await http.post(
    '/api/favorites',
    { productId },
    withClientIdHeader({
      ...options,
      errorMessages: {
        400: '商品 id 不合法，无法加入候选池',
        404: '商品不存在，无法加入候选池',
        409: '该商品已在候选池中。',
        default: '添加候选商品失败',
      },
    }),
  )

  if (!favoriteResult || typeof favoriteResult !== 'object' || Array.isArray(favoriteResult)) {
    throw new Error('添加候选商品返回数据格式不正确')
  }

  if (favoriteResult.product && typeof favoriteResult.product === 'object') {
    updateFavoritesCache((currentFavorites) => {
      const exists = currentFavorites.some((favorite) => favorite?.id === favoriteResult.product.id)

      return exists ? currentFavorites : [favoriteResult.product, ...currentFavorites]
    })
  }

  return favoriteResult
}

export async function removeFavorite(productId, options = {}) {
  const removeResult = await http.delete(
    `/api/favorites/${productId}`,
    withClientIdHeader({
      ...options,
      errorMessages: {
        400: '商品 id 不合法，无法取消收藏',
        404: '该商品不在候选池中，无法取消收藏',
        default: '取消收藏失败',
      },
    }),
  )

  if (!removeResult || typeof removeResult !== 'object' || Array.isArray(removeResult)) {
    throw new Error('取消收藏返回数据格式不正确')
  }

  updateFavoritesCache((currentFavorites) =>
    currentFavorites.filter((favorite) => favorite?.id !== productId),
  )

  return removeResult
}
