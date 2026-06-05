import { getValidNumber } from './number.js'

function toNumber(value, fallback = 0) {
  return getValidNumber(value) ?? fallback
}

function toInteger(value, fallback = 0) {
  return Math.trunc(toNumber(value, fallback))
}

function toStringValue(value, fallback = '') {
  return value === null || value === undefined ? fallback : String(value)
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsedValue = JSON.parse(value)
      return Array.isArray(parsedValue) ? parsedValue : []
    } catch {
      return []
    }
  }

  return []
}

export function mapProductRowToProduct(row) {
  const productRow = row && typeof row === 'object' ? row : {}

  return {
    id: toInteger(productRow.id),
    productName: toStringValue(productRow.product_name),
    category: toStringValue(productRow.category),
    amazonPrice: toNumber(productRow.amazon_price),
    cost1688: toNumber(productRow.cost_1688),
    shippingCost: toNumber(productRow.shipping_cost),
    platformFeeRate: toNumber(productRow.platform_fee_rate, 0.15),
    estimatedMonthlySales: toInteger(productRow.estimated_monthly_sales),
    rating: toNumber(productRow.rating),
    reviewCount: toInteger(productRow.review_count),
    competitionScore: toInteger(productRow.competition_score),
    weight: toNumber(productRow.weight),
    volumeLevel: toStringValue(productRow.volume_level),
    material: toStringValue(productRow.material),
    supplier: toStringValue(productRow.supplier),
    image: toStringValue(productRow.image),
    imageSource: toStringValue(productRow.image_source),
    sourceImageUrl: toStringValue(productRow.source_image_url),
    tags: toArray(productRow.tags),
    riskFactors: toArray(productRow.risk_factors),
    recommendationReason: toStringValue(productRow.recommendation_reason),
  }
}

export function mapProductToRow(product) {
  const productData = product && typeof product === 'object' ? product : {}

  return {
    id: toInteger(productData.id),
    product_name: toStringValue(productData.productName),
    category: toStringValue(productData.category),
    amazon_price: toNumber(productData.amazonPrice),
    cost_1688: toNumber(productData.cost1688),
    shipping_cost: toNumber(productData.shippingCost),
    platform_fee_rate: toNumber(productData.platformFeeRate, 0.15),
    estimated_monthly_sales: toInteger(productData.estimatedMonthlySales),
    rating: toNumber(productData.rating),
    review_count: toInteger(productData.reviewCount),
    competition_score: toInteger(productData.competitionScore),
    weight: toNumber(productData.weight),
    volume_level: toStringValue(productData.volumeLevel),
    material: toStringValue(productData.material),
    supplier: toStringValue(productData.supplier),
    image: toStringValue(productData.image),
    image_source: toStringValue(productData.imageSource),
    source_image_url: toStringValue(productData.sourceImageUrl),
    tags: toArray(productData.tags),
    risk_factors: toArray(productData.riskFactors),
    recommendation_reason: toStringValue(productData.recommendationReason),
    updated_at: new Date().toISOString(),
  }
}
