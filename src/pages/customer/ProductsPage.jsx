import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useProducts from '../../hooks/useProducts'
import ProductCard from '../../components/product/ProductCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import EmptyState from '../../components/common/EmptyState'
import { matchesSearch } from '../../utils/textUtils'

function ProductsPage() {
  const { products, loading, error, refetch } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [activeBrand, setActiveBrand] = useState('All')
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all')

  // Sync search param on load
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
    setActiveCategory(searchParams.get('category') || 'All')
    setActiveFilter(searchParams.get('filter') || 'all')
  }, [searchParams])

  // Unique categories and brands from products
  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean)
    return ['All', ...Array.from(new Set(cats)).sort()]
  }, [products])

  const brands = useMemo(() => {
    const bs = products.map(p => p.brand).filter(Boolean)
    return ['All', ...Array.from(new Set(bs)).sort()]
  }, [products])

  // Filtered products
  const filtered = useMemo(() => {
    return products.filter(p => {
      if (p.status === 'inactive') return false
      if (activeCategory !== 'All' && p.category !== activeCategory) return false
      if (activeBrand !== 'All' && p.brand !== activeBrand) return false
      if (activeFilter === 'new' && !p.isNewArrival) return false
      if (activeFilter === 'bestseller' && !p.isBestSeller) return false
      if (activeFilter === 'discount' && !p.isDiscount) return false
      if (!matchesSearch(p, searchQuery)) return false
      return true
    })
  }, [products, activeCategory, activeBrand, activeFilter, searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams(searchQuery ? { search: searchQuery } : {})
  }

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat)
    setActiveFilter('all')
  }

  const filterTabs = [
    { key: 'all', label: 'All Products' },
    { key: 'new', label: '✨ New Arrivals' },
    { key: 'bestseller', label: '🏆 Best Sellers' },
    { key: 'discount', label: '🏷️ On Sale' },
  ]

  return (
    <div className="fade-in-up">
      {/* ── Page Header ── */}
      <div className="bg-white border-bottom py-2 py-md-3 sticky-top" style={{ top: 56, zIndex: 40 }}>
        <div className="container">
          <div className="row align-items-center g-2">
            <div className="d-none d-md-block col-md-6">
              <h1 className="fw-bold mb-0" style={{ fontSize: '1.4rem' }}>All Products</h1>
              <p className="text-muted small mb-0">
                {loading ? '…' : `${filtered.length} products found`}
              </p>
            </div>
            {/* Search bar — always full width on mobile */}
            <div className="col-12 col-md-6">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search products, brands, categories…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label="Search products"
                  />
                  <button className="btn btn-success" type="submit" aria-label="Search">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
              {/* Product count on mobile below search */}
              <p className="text-muted small mb-0 mt-1 d-md-none">
                {loading ? '…' : `${filtered.length} products found`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-3">
        {/* ── Filter Tabs ── */}
        <div className="d-flex gap-2 flex-wrap mb-3">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              className={`category-pill ${activeFilter === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveFilter(tab.key); setActiveCategory('All') }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Category Pills ── */}
        <div className="d-flex gap-2 flex-wrap mb-3 pb-2" style={{ overflowX: 'auto' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Brand Filter ── */}
        {brands.length > 2 && (
          <div className="mb-3">
            <select
              className="form-select form-select-sm w-auto"
              value={activeBrand}
              onChange={e => setActiveBrand(e.target.value)}
              aria-label="Filter by brand"
            >
              {brands.map(b => (
                <option key={b} value={b}>{b === 'All' ? 'All Brands' : b}</option>
              ))}
            </select>
          </div>
        )}

        {/* ── States ── */}
        {loading && <LoadingSpinner message="Loading products…" />}
        {error && !loading && <ErrorMessage message={error} onRetry={refetch} />}

        {/* ── Product Grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
            {filtered.map(product => (
              <div className="col" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon="bi-search"
            title="No products found"
            message="Try adjusting your search or filters."
            actionLabel="Clear Filters"
            onAction={() => { setSearchQuery(''); setActiveCategory('All'); setActiveBrand('All'); setActiveFilter('all') }}
          />
        )}
      </div>
    </div>
  )
}

export default ProductsPage
