import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import useProducts from '../../hooks/useProducts'
import ProductCard from '../../components/product/ProductCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

/**
 * Customer Home Page.
 * Sections:
 *  1. Hero Banner
 *  2. New Arrivals (products with isNewArrival = true)
 *  3. Best Sellers (products with isBestSeller = true)
 *  4. Recently Added (last 8 products)
 */
function HomePage() {
  const { products, loading, error } = useProducts()

  // Derived lists from the single product fetch
  const newArrivals = useMemo(
    () => products.filter((p) => p.isNewArrival && p.status !== 'inactive').slice(0, 6),
    [products]
  )

  const bestSellers = useMemo(
    () => products.filter((p) => p.isBestSeller && p.status !== 'inactive').slice(0, 6),
    [products]
  )

  const recentlyAdded = useMemo(
    () => products.filter((p) => p.status !== 'inactive').slice(0, 8),
    [products]
  )

  return (
    <div className="fade-in-up">

      {/* ── Hero Banner ── */}
      <section
        className="py-5 text-white"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%)',
          minHeight: 220,
        }}
        aria-label="Welcome banner"
      >
        <div className="container text-center py-2">
          <div className="mb-2">
            <i className="bi bi-basket2-fill" style={{ fontSize: '2.5rem', opacity: 0.9 }}></i>
          </div>
          <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
            Welcome to Shri Pant Krupa
          </h1>
          <p className="mb-4 opacity-75" style={{ fontSize: '1rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
            Fresh groceries, daily essentials, and everything your family needs — all in one place.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/products" className="btn btn-warning btn-lg px-4 fw-semibold">
              <i className="bi bi-grid me-2"></i>
              Browse Products
            </Link>
            <Link to="/products?filter=new" className="btn btn-outline-light btn-lg px-4">
              <i className="bi bi-stars me-2"></i>
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Loading & Error States ── */}
      {loading && <LoadingSpinner message="Loading products…" />}
      {error && !loading && <ErrorMessage message={error} />}

      {/* ── Content Sections ── */}
      {!loading && !error && (
        <div className="container py-4">

          {/* ── New Arrivals ── */}
          {newArrivals.length > 0 && (
            <section className="mb-5" aria-labelledby="new-arrivals-heading">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="section-title mb-0" id="new-arrivals-heading">
                  <i className="bi bi-stars me-2 text-primary"></i>
                  New Arrivals
                </h2>
                <Link
                  to="/products?filter=new"
                  className="btn btn-sm btn-outline-success"
                >
                  View All <i className="bi bi-chevron-right ms-1"></i>
                </Link>
              </div>
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
                {newArrivals.map((product) => (
                  <div className="col" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Best Sellers ── */}
          {bestSellers.length > 0 && (
            <section className="mb-5" aria-labelledby="best-sellers-heading">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="section-title mb-0" id="best-sellers-heading">
                  <i className="bi bi-trophy me-2 text-accent" style={{ color: 'var(--color-accent)' }}></i>
                  Best Sellers
                </h2>
                <Link
                  to="/products?filter=bestseller"
                  className="btn btn-sm btn-outline-success"
                >
                  View All <i className="bi bi-chevron-right ms-1"></i>
                </Link>
              </div>
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
                {bestSellers.map((product) => (
                  <div className="col" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Recently Added ── */}
          {recentlyAdded.length > 0 && (
            <section className="mb-4" aria-labelledby="recently-added-heading">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="section-title mb-0" id="recently-added-heading">
                  <i className="bi bi-clock-history me-2 text-primary"></i>
                  Recently Added
                </h2>
                <Link
                  to="/products"
                  className="btn btn-sm btn-outline-success"
                >
                  View All <i className="bi bi-chevron-right ms-1"></i>
                </Link>
              </div>
              <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 g-3">
                {recentlyAdded.map((product) => (
                  <div className="col" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Empty State ── */}
          {products.length === 0 && (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-box-seam" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
              <p className="mt-3 mb-0">No products added yet. Check back soon!</p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default HomePage
