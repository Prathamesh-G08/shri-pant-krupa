import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { matchesSearch } from '../../utils/textUtils'

/**
 * Customer-facing Navbar.
 * - Responsive: collapses on mobile with hamburger toggle.
 * - Includes live search with dropdown suggestions.
 * - Brand logo with store name and tagline.
 */
function Navbar({ products = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Filter products for suggestions (max 6 results)
  const suggestions = searchQuery.trim().length > 0
    ? products.filter((p) => matchesSearch(p, searchQuery)).slice(0, 6)
    : []

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
      setIsNavOpen(false)
    }
  }

  const handleSuggestionClick = (product) => {
    navigate(`/products/${product.id}`)
    setSearchQuery('')
    setShowSuggestions(false)
    setIsNavOpen(false)
  }

  return (
    <nav
      className="navbar navbar-expand-md sticky-top"
      style={{ backgroundColor: 'var(--color-primary)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-fluid px-3">

        {/* ── Brand ── */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle bg-white"
            style={{ width: 38, height: 38, flexShrink: 0 }}
            aria-hidden="true"
          >
            <i className="bi bi-basket2-fill" style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <span className="navbar-brand-text">Shri Pant Krupa</span>
            <span className="navbar-brand-subtitle">Grocery Store</span>
          </div>
        </Link>

        {/* ── Mobile: Search icon + hamburger ── */}
        <div className="d-flex align-items-center gap-2 d-md-none">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setIsNavOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={isNavOpen}
          >
            <i className={`bi ${isNavOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        </div>

        {/* ── Collapsible Content ── */}
        <div className={`${isNavOpen ? 'd-block' : 'd-none d-md-flex'} w-100`}>
          <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2 w-100 mt-2 mt-md-0 ms-md-3 pb-2 pb-md-0">

            {/* ── Search Bar ── */}
            <form
              className="flex-grow-1"
              onSubmit={handleSearchSubmit}
              role="search"
              ref={searchRef}
            >
              <div className="search-wrapper">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search products, brands, categories…"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    aria-label="Search products"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="btn btn-warning"
                    aria-label="Search"
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </div>

                {/* ── Search Suggestions Dropdown ── */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="search-suggestions" role="listbox">
                    {suggestions.map((product) => (
                      <div
                        key={product.id}
                        className="search-suggestion-item"
                        onClick={() => handleSuggestionClick(product)}
                        role="option"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(product)}
                      >
                        {/* Small thumbnail */}
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }}
                          />
                        ) : (
                          <div
                            style={{ width: 32, height: 32, borderRadius: 4, backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="bi bi-image text-muted" style={{ fontSize: '0.8rem' }}></i>
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.85rem' }}>{product.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{product.brand} · {product.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* ── Nav Links ── */}
            <ul className="navbar-nav flex-row gap-1">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link text-white px-2"
                  onClick={() => setIsNavOpen(false)}
                >
                  <i className="bi bi-house me-1"></i>
                  <span className="d-none d-md-inline">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/products"
                  className="nav-link text-white px-2"
                  onClick={() => setIsNavOpen(false)}
                >
                  <i className="bi bi-grid me-1"></i>
                  <span className="d-none d-md-inline">Products</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
