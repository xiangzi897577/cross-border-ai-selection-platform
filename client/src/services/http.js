import axios from 'axios'

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export const API_BASE_URL = normalizeBaseUrl(RAW_API_BASE_URL)
const BACKEND_CONNECTION_ERROR = `无法连接到后端服务，请确认 ${API_BASE_URL} 已启动或配置正确`
const CLIENT_ID_STORAGE_KEY = 'phone_holder_analyzer_client_id'
const DEFAULT_TIMEOUT_MS = 10000

let memoryClientId = ''

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || '').replace(/\/+$/, '')
}

function createClientId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function getClientId() {
  if (typeof window === 'undefined' || !window.localStorage) {
    if (!memoryClientId) {
      memoryClientId = createClientId()
    }

    return memoryClientId
  }

  const storedClientId = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY)

  if (storedClientId) {
    return storedClientId
  }

  const nextClientId = createClientId()
  window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, nextClientId)

  return nextClientId
}

export function createHeaders(...headersList) {
  const headers = {}

  headersList.forEach((headersSource) => {
    if (!headersSource) {
      return
    }

    if (typeof Headers !== 'undefined' && headersSource instanceof Headers) {
      headersSource.forEach((value, key) => {
        headers[key] = value
      })
      return
    }

    Object.entries(headersSource).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        headers[key] = value
      }
    })
  })

  return headers
}

export function withClientIdHeader(config = {}) {
  return {
    ...config,
    headers: createHeaders(config.headers, {
      'x-client-id': getClientId(),
    }),
  }
}

function isErrorResponseData(data) {
  return Boolean(
    data &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      (data.success === false || data.status === 'error'),
  )
}

function getRequestErrorMessage(status, errorMessages, data) {
  if (errorMessages && typeof errorMessages[status] === 'string') {
    return errorMessages[status]
  }

  if (data && typeof data === 'object' && typeof data.message === 'string') {
    return data.message
  }

  if (errorMessages && typeof errorMessages.default === 'string') {
    return errorMessages.default
  }

  return status ? `请求失败，HTTP 状态码 ${status}` : '请求失败'
}

function createRequestError(message, cause) {
  return new Error(message, { cause })
}

function createAbortError(cause) {
  const abortError = createRequestError('请求已取消', cause)
  abortError.name = 'AbortError'
  return abortError
}

function normalizeAxiosError(error) {
  const errorMessages = error.config?.errorMessages

  if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
    return createAbortError(error)
  }

  if (error.code === 'ECONNABORTED' || String(error.message || '').includes('timeout')) {
    return createRequestError(
      error.config?.timeoutErrorMessage || '请求超时，请稍后重试',
      error,
    )
  }

  if (error.response) {
    return createRequestError(
      getRequestErrorMessage(error.response.status, errorMessages, error.response.data),
      error,
    )
  }

  if (error.request) {
    return createRequestError(BACKEND_CONNECTION_ERROR, error)
  }

  return createRequestError(error.message || '请求失败', error)
}

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
})

http.interceptors.response.use(
  (response) => {
    if (isErrorResponseData(response.data)) {
      throw createRequestError(
        getRequestErrorMessage(response.status, response.config?.errorMessages, response.data),
      )
    }

    return response.data
  },
  (error) => {
    throw normalizeAxiosError(error)
  },
)

export default http
