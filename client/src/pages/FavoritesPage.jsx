import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../services/api'

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

function FavoriteProductItem({ product, removingProductId, onRemove }) {
  const [imageLoadError, setImageLoadError] = useState(false)
  const hasProductId = product?.id !== undefined && product?.id !== null && product?.id !== ''
  const isRemoving = hasProductId && removingProductId === product.id
  const productName = product?.productName || '暂无'
  const productImage =
    typeof product?.image === 'string' && product.image.trim() !== '' && !imageLoadError
      ? product.image
      : DEFAULT_PRODUCT_IMAGE
  const riskLevel = product?.riskLevel || 'unknown'
  const riskBadgeClassName = `favorite-card__risk-badge favorite-card__risk-badge--${riskLevel}`

  return (
    <article className="favorite-card">
      <Link
        to={hasProductId ? `/products/${product.id}` : '/products'}
        className="favorite-card__link"
      >
        <div className="favorite-card__image-wrapper">
          <img
            className="favorite-card__image"
            src={productImage}
            alt={productName}
            onError={() => setImageLoadError(true)}
          />
        </div>

        <div className="favorite-card__content">
          <div className="favorite-card__header">
            <div className="favorite-card__tag-row">
              <p className="favorite-card__category">{product?.category || '暂无'}</p>
              <span className={riskBadgeClassName}>{getRiskLevelText(riskLevel)}</span>
            </div>
            <h3 className="favorite-card__title">{productName}</h3>
          </div>

          <div className="favorite-card__metrics">
            <div className="favorite-card__metric">
              <span className="favorite-card__metric-label">Amazon 售价</span>
              <strong className="favorite-card__metric-value">
                {formatMoney(product?.amazonPrice, '$')}
              </strong>
            </div>

            <div className="favorite-card__metric">
              <span className="favorite-card__metric-label">1688 成本</span>
              <strong className="favorite-card__metric-value">
                {formatMoney(product?.cost1688, '¥')}
              </strong>
            </div>

            <div className="favorite-card__metric favorite-card__metric--profit">
              <span className="favorite-card__metric-label">利润率</span>
              <strong className="favorite-card__metric-value">
                {formatPercent(product?.profitRatePercent)}
              </strong>
            </div>

            <div className="favorite-card__metric">
              <span className="favorite-card__metric-label">评分</span>
              <strong className="favorite-card__metric-value">
                {formatNumber(product?.rating, 1)}
              </strong>
            </div>

            <div className="favorite-card__metric favorite-card__metric--competition">
              <span className="favorite-card__metric-label">竞争指数</span>
              <strong className="favorite-card__metric-value">
                {formatNumber(product?.competitionScore)}
              </strong>
            </div>

            <div className="favorite-card__metric favorite-card__metric--score">
              <span className="favorite-card__metric-label">推荐评分</span>
              <strong className="favorite-card__metric-value">
                {formatNumber(product?.recommendationScore)}
              </strong>
            </div>
          </div>

          <span className="favorite-card__detail-hint">
            {hasProductId ? `查看商品 #${product.id} 详情` : '缺少商品 id'}
          </span>
        </div>
      </Link>

      <div className="favorite-card__actions">
        <button
          className="favorite-card__remove-button"
          type="button"
          disabled={!hasProductId || isRemoving}
          onClick={() => onRemove(product)}
        >
          {isRemoving ? '取消中...' : '取消收藏'}
        </button>
      </div>
    </article>
  )
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removeError, setRemoveError] = useState('')
  const [removingProductId, setRemovingProductId] = useState(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function fetchFavorites() {
      setLoading(true)
      setError('')
      setRemoveError('')
      setFavorites([])

      try {
        const favoritesData = await getFavorites({ signal: abortController.signal })
        setFavorites(favoritesData)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || '获取候选池商品失败')
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchFavorites()

    return () => {
      abortController.abort()
    }
  }, [])

  async function handleRemoveFavorite(product) {
    if (!product?.id || removingProductId !== null) {
      return
    }

    setRemovingProductId(product.id)
    setRemoveError('')

    try {
      await removeFavorite(product.id)
      setFavorites((currentFavorites) =>
        currentFavorites.filter((favoriteProduct) => favoriteProduct.id !== product.id),
      )
    } catch (requestError) {
      setRemoveError(requestError.message || '取消收藏失败')
    } finally {
      setRemovingProductId(null)
    }
  }

  const hasFavorites = favorites.length > 0

  return (
    <section className="page favorites-page">
      {loading ? <p className="page-note page-note--loading">候选池加载中...</p> : null}

      {!loading && error ? <p className="page-note page-note--error">请求失败：{error}</p> : null}

      {!loading && !error && removeError ? (
        <p className="page-note page-note--error">取消收藏失败：{removeError}</p>
      ) : null}

      {!loading && !error && !hasFavorites ? (
        <p className="page-note page-note--empty">候选池暂无商品，可先从商品列表选择高潜力款加入跟进。</p>
      ) : null}

      {!loading && !error && hasFavorites ? (
        <>
          <p className="page-note page-note--info">
            当前候选池共有 <strong>{favorites.length}</strong> 件商品，点击商品内容可进入详情页。
          </p>

          <div className="favorites-page__list">
            {favorites.map((product) => (
              <FavoriteProductItem
                key={product.id ?? product.productName}
                product={product}
                removingProductId={removingProductId}
                onRemove={handleRemoveFavorite}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}

export default FavoritesPage
