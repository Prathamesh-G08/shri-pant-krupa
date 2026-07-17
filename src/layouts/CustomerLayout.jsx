import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useProducts from '../hooks/useProducts'
import useScrollRestoration from '../hooks/useScrollRestoration'

/**
 * CustomerLayout wraps all public-facing pages.
 * Handles scroll restoration — going back to products list
 * restores the exact scroll position the user was at.
 */
function CustomerLayout() {
  const { products } = useProducts()

  // Restore scroll position when navigating back
  useScrollRestoration()

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
