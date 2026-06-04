import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addFavorite } from '../services/api'

const DEFAULT_PRODUCT_IMAGE = '/images/products/placeholder.png'

const riskLevelTextMap = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
  unknown: '风险未知',
}

function formatMoney(value, symbol) {
  if (typeof value !== 'number') {
    return '-'
  }

  return `${symbol}${value.toFixed(2)}`
}

function formatPercent(value) {
  if (typeof value !== 'number') {
    return '0.0%'
  }

  return `${value.toFixed(1)}%`
}

function formatNumber(value, digits = 0) {
  if (typeof value !== 'number') {
    return digits === 0 ? '0' : (0).toFixed(digits)
  }

  return value.toFixed(digits)
}

function getRiskLevelText(riskLevel) {
  if (typeof riskLevel !== 'string' || riskLevel.trim() === '') {
    return '风险未知'
  }

  return riskLevelTextMap[riskLevel] || riskLevel
}

function ProductCard({ product }) {
  const [imageLoadError, setImageLoadError] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [favoriteMessage, setFavoriteMessage] = useState('')
  const [favoriteMessageType, setFavoriteMessageType] = useState('')
  const hasProductId = product?.id !== undefined && product?.id !== null && product?.id !== ''
  const productImage =
    typeof product?.image === 'string' && product.image.trim() !== '' && !imageLoadError
      ? product.image
      : DEFAULT_PRODUCT_IMAGE
  const productName = product?.productName || '暂无'
  const riskLevel = product?.riskLevel || 'unknown'
  const riskBadgeClassName = `product-card__risk-badge product-card__risk-badge--${riskLevel}`

  async function handleAddFavorite() {
    if (!hasProductId || favoriteLoading) {
      return
    }

    setFavoriteLoading(true)
    setFavoriteMessage('')
    setFavoriteMessageType('')

    try {
      const result = await addFavorite(product.id)
      setFavoriteMessage(result.message || '已加入候选池')
      setFavoriteMessageType('success')
    } catch (requestError) {
      setFavoriteMessage(requestError.message || '添加候选商品失败')
      setFavoriteMessageType('error')
    } finally {
      setFavoriteLoading(false)
    }
  }

  const cardContent = (
    <>
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src={productImage}
          alt={productName}
          onError={() => setImageLoadError(true)}
        />
      </div>

      <div className="product-card__body">
        <div>
          <div className="product-card__tag-row">
            <p className="product-card__category">{product?.category || '暂无'}</p>
            <span className={riskBadgeClassName}>{getRiskLevelText(riskLevel)}</span>
          </div>
          <h3 className="product-card__title">{productName}</h3>
        </div>

        <div className="product-card__metrics">
          <div className="product-card__metric">
            <span className="product-card__metric-label">Amazon 售价</span>
            <strong className="product-card__metric-value">
              {formatMoney(product?.amazonPrice, '$')}
            </strong>
          </div>

          <div className="product-card__metric">
            <span className="product-card__metric-label">1688 成本</span>
            <strong className="product-card__metric-value">
              {formatMoney(product?.cost1688, '¥')}
            </strong>
          </div>

          <div className="product-card__metric product-card__metric--profit">
            <span className="product-card__metric-label">利润率</span>
            <strong className="product-card__metric-value">
              {formatPercent(product?.profitRatePercent)}
            </strong>
          </div>

          <div className="product-card__metric product-card__metric--competition">
            <span className="product-card__metric-label">竞争指数</span>
            <strong className="product-card__metric-value">
              {formatNumber(product?.competitionScore)}
            </strong>
          </div>

          <div className="product-card__metric">
            <span className="product-card__metric-label">评分</span>
            <strong className="product-card__metric-value">
              {formatNumber(product?.rating, 1)}
            </strong>
          </div>

          <div className="product-card__metric product-card__metric--score">
            <span className="product-card__metric-label">推荐评分</span>
            <strong className="product-card__metric-value">
              {formatNumber(product?.recommendationScore)}
            </strong>
          </div>
        </div>

        <div className="product-card__footer">
          <span className="product-card__detail-hint">
            {hasProductId ? `查看商品 #${product.id} 详情` : '缺少商品 id，暂时无法跳转'}
          </span>
        </div>
      </div>
    </>
  )

  const favoriteAction = (
    <div className="product-card__favorite-area">
      <button
        className="product-card__favorite-button"
        type="button"
        disabled={!hasProductId || favoriteLoading}
        onClick={handleAddFavorite}
      >
        {favoriteLoading ? '加入中...' : '加入候选池'}
      </button>

      {favoriteMessage ? (
        <p className={`product-card__favorite-message product-card__favorite-message--${favoriteMessageType}`}>
          {favoriteMessage}
        </p>
      ) : null}
    </div>
  )

  if (!hasProductId) {
    return (
      <article className="product-card product-card--disabled" aria-disabled="true">
        {cardContent}
        {favoriteAction}
      </article>
    )
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        {cardContent}
      </Link>
      {favoriteAction}
    </article>
  )
}

export default ProductCard
