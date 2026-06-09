import http, { withClientIdHeader } from './http.js'

const MAX_AI_REQUEST_MESSAGES = 6
const MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH = 700
const AI_CHAT_REQUEST_TIMEOUT_MS = 45000
const AI_PRODUCT_REPORT_REQUEST_TIMEOUT_MS = 60000
const AI_TEMPORARY_ERROR_MESSAGE = 'AI 服务暂时不可用，请稍后再试'

function normalizeAiMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('请输入要咨询的问题')
  }

  return messages.slice(-MAX_AI_REQUEST_MESSAGES).map((message) => {
    const role = message?.role
    let content = typeof message?.content === 'string' ? message.content.trim() : ''

    if (role !== 'user' && role !== 'assistant') {
      throw new Error('AI 消息角色格式不正确')
    }

    if (!content) {
      throw new Error('请输入要咨询的问题')
    }

    if (role === 'assistant' && content.length > MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH) {
      content = `${content.slice(0, MAX_AI_REQUEST_ASSISTANT_CONTENT_LENGTH)}...`
    }

    return {
      role,
      content,
    }
  })
}

export async function chatWithAi(messages, options = {}) {
  const normalizedMessages = normalizeAiMessages(messages)

  if (!normalizedMessages.some((message) => message.role === 'user')) {
    throw new Error('请输入要咨询的问题')
  }

  try {
    const chatResult = await http.post(
      '/api/ai/chat',
      { messages: normalizedMessages },
      withClientIdHeader({
        ...options,
        timeout: AI_CHAT_REQUEST_TIMEOUT_MS,
        timeoutErrorMessage: AI_TEMPORARY_ERROR_MESSAGE,
        errorMessages: {
          default: AI_TEMPORARY_ERROR_MESSAGE,
        },
      }),
    )

    if (typeof chatResult === 'string') {
      return {
        reply: chatResult,
      }
    }

    if (typeof chatResult?.data?.reply === 'string') {
      return {
        reply: chatResult.data.reply,
        provider: chatResult.data.provider,
        model: chatResult.data.model,
      }
    }

    if (typeof chatResult?.reply === 'string') {
      return {
        reply: chatResult.reply,
        provider: chatResult.provider,
        model: chatResult.model,
      }
    }

    if (typeof chatResult?.data === 'string') {
      return {
        reply: chatResult.data,
      }
    }

    throw new Error('AI 回复数据格式不正确')
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(AI_TEMPORARY_ERROR_MESSAGE, { cause: error })
    }

    throw error
  }
}

export async function generateAiProductReport(productId, options = {}) {
  const normalizedProductId = Number(productId)

  if (!Number.isInteger(normalizedProductId) || normalizedProductId <= 0) {
    throw new Error('商品 id 不合法，无法生成 AI 报告')
  }

  try {
    const reportResult = await http.post(
      '/api/ai/product-report',
      { productId: normalizedProductId },
      withClientIdHeader({
        ...options,
        timeout: AI_PRODUCT_REPORT_REQUEST_TIMEOUT_MS,
        timeoutErrorMessage: 'AI 深度报告暂时不可用',
        errorMessages: {
          400: '商品 id 不合法，无法生成 AI 报告',
          404: '商品不存在，无法生成 AI 报告',
          default: 'AI 深度报告暂时不可用',
        },
      }),
    )

    const report =
      typeof reportResult?.data?.report === 'string'
        ? reportResult.data.report
        : typeof reportResult?.report === 'string'
          ? reportResult.report
          : ''

    if (!report.trim()) {
      throw new Error('AI 深度报告返回数据格式不正确')
    }

    return {
      report,
      provider: reportResult?.data?.provider || reportResult?.provider,
      model: reportResult?.data?.model || reportResult?.model,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      if (options.signal?.aborted) {
        throw error
      }

      throw new Error('AI 深度报告暂时不可用', { cause: error })
    }

    throw error
  }
}
