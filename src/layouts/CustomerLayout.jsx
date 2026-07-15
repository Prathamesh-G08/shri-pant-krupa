import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useProducts from '../hooks/useProducts'

/**
 * CustomerLayout wraps all public-facing pages.
 * Fetches the product list here once so Navbar can use it for search suggestions
 * without each page needing to fetch independently for that purpose.
 */
function CustomerLayout() {
  const { products } = useProducts()

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top navigation */}
      <Navbar products={products} />

      {/* Page content — rendered by child routes */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default CustomerLayout
