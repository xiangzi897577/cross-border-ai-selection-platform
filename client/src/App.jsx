import { Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import Layout from './components/Layout.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
      <Analytics />
    </Layout>
  )
}

export default App
