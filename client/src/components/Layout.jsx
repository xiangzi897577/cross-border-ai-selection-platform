import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

function Layout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-layout__content">
        <Header />
        <main className="dashboard-layout__main">
          <div className="dashboard-layout__page">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
