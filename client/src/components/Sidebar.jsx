import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: '数据看板', path: '/' },
  { label: '商品列表', path: '/products' },
  { label: '选品分析', path: '/analysis' },
  { label: '候选池', path: '/favorites' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <p className="sidebar__eyebrow">AI COMMERCE INTELLIGENCE</p>
        <h1 className="sidebar__title">轻小件跨境选品分析</h1>
        <p className="sidebar__description">



          面向跨境轻小件选品场景，结合商品数据、利润模型、竞争强度、物流成本与 AI 分析，辅助筛选高潜力商品机会。
        </p>
      </div>

      <nav className="sidebar__nav" aria-label="侧边导航">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
