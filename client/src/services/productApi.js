import http from './http.js'

const PRODUCTS_CACHE_STORAGE_KEY = 'phone_holder_analyzer_products_cache_v1'
const PRODUCT_DETAIL_CACHE_STORAGE_PREFIX = 'phone_holder_analyzer_product_detail_cache_v1'
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

function hasProductFilters(filters = {}) {
  const { keyword = '', category = '', minProfitRate = '', sort = '' } = filters || {}

  return Boolean(
    String(keyword || '').trim() ||
      String(category || '').trim() ||
      String(minProfitRate || '').trim() ||
      String(sort || '').trim(),
  )
}

function getProductDetailCacheKey(id) {
  return `${PRODUCT_DETAIL_CACHE_STORAGE_PREFIX}_${id}`
}

function writeProductsCache(products) {
  writeDataCache(PRODUCTS_CACHE_STORAGE_KEY, products)
}

function buildProductParams(filters = {}) {
  const { keyword = '', category = '', minProfitRate = '', sort = '' } = filters || {}
  const normalizedKeyword = String(keyword || '').trim()
  const normalizedCategory = String(category || '').trim()
  const normalizedMinProfitRate = String(minProfitRate || '').trim()
  const normalizedSort = String(sort || '').trim()
  const params = {}

  if (normalizedKeyword) {
    params.keyword = normalizedKeyword
  }

  if (normalizedCategory) {
    params.category = normalizedCategory
  }

  if (normalizedMinProfitRate) {
    params.minProfitRate = normalizedMinProfitRate
  }

  if (normalizedSort) {
    params.sort = normalizedSort
  }

  return params
}

export function getCachedProducts() {
  const products = readDataCache(PRODUCTS_CACHE_STORAGE_KEY)

  if (!Array.isArray(products)) {
    return []
  }

  return products
}

export function getCachedProductById(id) {
  const normalizedProductId = Number(id)

  if (!Number.isInteger(normalizedProductId) || normalizedProductId <= 0) {
    return null
  }

  const product = readDataCache(getProductDetailCacheKey(normalizedProductId))

  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    return (
      getCachedProducts().find((cachedProduct) => cachedProduct?.id === normalizedProductId) ||
      null
    )
  }

  return product
}

export async function getProducts(filters = {}, options = {}) {
  const products = await http.get('/api/products', {
    ...options,
    params: buildProductParams(filters),
    errorMessages: { default: '获取商品列表失败' },
  })

  if (!Array.isArray(products)) {
    throw new Error('商品列表数据格式不正确')
  }

  if (!hasProductFilters(filters)) {
    writeProductsCache(products)
  }

  return products
}

export async function getProductDetail(id, options = {}) {
  const product = await http.get(`/api/products/${id}`, {
    ...options,
    errorMessages: {
      400: '商品 id 不合法',
      404: '商品不存在',
      default: '获取商品详情失败',
    },
  })

  if (!product || typeof product !== 'object' || Array.isArray(product)) {
    throw new Error('商品详情数据格式不正确')
  }

  writeDataCache(getProductDetailCacheKey(product.id ?? id), product)

  return product
}

export const getProductById = getProductDetail
