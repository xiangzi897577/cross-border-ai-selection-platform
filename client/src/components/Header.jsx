import { useLocation } from 'react-router-dom'

const headerConfig = {
  '/': {
    eyebrow: 'Dashboard',
    title: '数据看板',
    description: '汇总商品池规模、利润表现、潜力商品和风险商品，快速判断当前选品盘面。',
  },
  '/products': {
    eyebrow: 'Products',
    title: '商品列表',
    description: '按关键词、类目、利润率和排序维度筛选轻小件候选商品，优先锁定值得跟进的款式。',
  },
  '/analysis': {
    eyebrow: 'Analysis',
    title: '选品分析',
    description: '从高潜力、高风险、低竞争高利润三个角度拆解商品机会，辅助做选品决策。',
  },
  '/favorites': {
    eyebrow: 'Favorites',
    title: '候选池',
    description: '沉淀待跟进商品，集中对比利润、评分和竞争指标，方便后续复盘筛选。',
  },
}

function getHeaderConfig(pathname) {
  if (pathname.startsWith('/products/')) {
    return {
      eyebrow: 'Product Detail',
      title: '商品详情',
      description: '查看单个商品的价格成本、利润空间、市场指标、风险因素和推荐依据。',
    }
  }

  return (
    headerConfig[pathname] || {
      eyebrow: '当前项目',
      title: '跨境电商手机支架选品分析平台',
      description: '围绕利润、竞争、风险和推荐评分，辅助筛选更值得跟进的手机支架候选商品。',
    }
  )
}

function Header() {
  const location = useLocation()
  const currentHeader = getHeaderConfig(location.pathname)

  return (
    <header className="top-header">
      <div className="top-header__intro">
        <p className="top-header__eyebrow">{currentHeader.eyebrow}</p>
        <h2 className="top-header__title">{currentHeader.title}</h2>
        <p className="top-header__description">{currentHeader.description}</p>
      </div>
    </header>
  )
}

export default Header
