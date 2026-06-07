import { getValidNumber } from '../utils/number.js'

function formatPercent(value) {
  const numberValue = getValidNumber(value)

  if (numberValue === null) {
    return '暂无'
  }

  return `${numberValue.toFixed(1)}%`
}

function formatNumber(value, digits = 0) {
  const numberValue = getValidNumber(value)

  if (numberValue === null) {
    return '暂无'
  }

  return numberValue.toFixed(digits)
}

function formatText(value, emptyText = '暂无') {
  if (value === null || value === undefined) {
    return emptyText
  }

  if (typeof value === 'string') {
    return value.trim() || emptyText
  }

  return String(value)
}

function formatRiskFactors(product) {
  return Array.isArray(product?.riskFactors) && product.riskFactors.length > 0
    ? product.riskFactors.filter(Boolean).join('、')
    : '暂无明显风险因素'
}

function buildProductDataText(product) {
  return `
- 商品名称：${formatText(product?.productName)}
- 类目：${formatText(product?.category)}
- Amazon 售价：$${formatNumber(product?.amazonPrice, 2)}
- 1688 成本：¥${formatNumber(product?.cost1688, 2)}
- 物流成本：¥${formatNumber(product?.shippingCost, 2)}
- 利润率：${formatPercent(product?.profitRatePercent)}
- 预估月销量：${formatNumber(product?.estimatedMonthlySales)}
- 评分：${formatNumber(product?.rating, 1)}
- 评论数：${formatNumber(product?.reviewCount)}
- 竞争度：${formatNumber(product?.competitionScore)}
- 推荐分：${formatNumber(product?.recommendationScore)}
- 风险因素：${formatRiskFactors(product)}
- 当前推荐说明：${formatText(product?.recommendationReason)}
`.trim()
}

export function buildProductReportMessages(product) {
  const productDataText = buildProductDataText(product)
  const systemPrompt = `
你是极瑞AI跨境选品分析平台的资深跨境电商轻小件选品分析顾问。请基于平台当前商品资料和已计算指标生成面向业务决策的选品分析报告，不要编造当前商品资料中不存在的数据。
报告必须使用 Markdown 格式，语气清晰、具体、可执行，适合正常公司内部选品评估和商品跟进决策。
不要在报告正文中输出免责声明、资料来源限制、系统实现细节或使用场景声明；直接从商品结论和业务分析开始。

商品数据如下：
${productDataText}

报告必须包含以下小节：
1. 综合结论
2. 利润表现分析
3. 市场需求分析
4. 竞争风险分析
5. 风险因素总结
6. 适合卖家类型
7. 是否建议上架
8. 下一步操作建议

请避免空泛表述，尽量引用利润率、销量、评分、竞争度、推荐分和风险因素进行判断。
`.trim()

  return [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: '请为这一个商品生成 AI 深度选品分析报告，直接输出业务分析内容。',
    },
  ]
}
