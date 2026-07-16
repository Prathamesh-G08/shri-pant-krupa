import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import useProduct from '../../hooks/useProduct'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { formatPrice, hasDiscount, calculateDiscount } from '../../utils/priceUtils'
import { formatDate } from '../../utils/dateUtils'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  const [zoomOpen, setZoomOpen] = useState(false)

  // Scroll to top whenever a product page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'

  if (loading) return <LoadingSpinner message="Loading product…" />
  if (error) return <ErrorMessage message={error} onRetry={() => navigate(-1)} />
  if (!product) return null

  const {
    name, brand, category, mrp, sellingPrice, description,
    imageUrl, quantity, isNewArrival, isBestSeller, isDiscount,
    status, createdAt,
  } = product

  const isOutOfStock = status === 'out_of_stock' || quantity === 0
  const isLowStock = !isOutOfStock && quantity > 0 && quantity <= 5
  const discountPercent = hasDiscount(mrp, sellingPrice) ? calculateDiscount(mrp, sellingPrice) : 0
  const productUrl = window.location.href

  return (
    <div className="fade-in-up">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-bottom py-2">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">

          {/* ── Product Image ── */}
          <div className="col-12 col-md-5">
            <div
              className="position-relative rounded-3 overflow-hidden bg-light"
              style={{ cursor: 'zoom-in' }}
              onClick={() => !isOutOfStock && setZoomOpen(true)}
              role="button"
              aria-label="Click to zoom image"
            >
              <img
                src={imageUrl || PLACEHOLDER}
                alt={name}
                className="w-100"
                style={{ maxHeight: 380, objectFit: 'contain', display: 'block' }}
                onError={e => { e.target.src = PLACEHOLDER }}
              />
              {/* Zoom hint */}
              {!isOutOfStock && imageUrl && (
                <div
                  className="position-absolute bottom-0 end-0 m-2 px-2 py-1 bg-dark bg-opacity-50 text-white rounded"
                  style={{ fontSize: '0.7rem' }}
                >
                  <i className="bi bi-zoom-in me-1"></i>Tap to zoom
                </div>
              )}
              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
                  <span className="badge bg-secondary fs-5 px-4 py-2">Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Product Info ── */}
          <div className="col-12 col-md-7">
            {/* Badges */}
            <div className="d-flex flex-wrap gap-2 mb-2">
              {isNewArrival && <span className="badge-new">NEW</span>}
              {isBestSeller && <span className="badge-bestseller">BEST SELLER</span>}
              {discountPercent > 0 && isDiscount && (
                <span className="badge-discount">{discountPercent}% OFF</span>
              )}
              {isLowStock && (
                <span className="badge-lowstock">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>Low Stock
                </span>
              )}
            </div>

            {/* Brand & Category */}
            <p className="text-muted small mb-1 text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>
              {brand} {category && `· ${category}`}
            </p>

            {/* Name */}
            <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)' }}>
              {name}
            </h1>

            {/* Price */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="fw-bold" style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)' }}>
                {formatPrice(sellingPrice)}
              </span>
              {hasDiscount(mrp, sellingPrice) && (
                <span className="price-original" style={{ fontSize: '1rem' }}>
                  MRP {formatPrice(mrp)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-3">
              {isOutOfStock ? (
                <span className="text-danger fw-semibold">
                  <i className="bi bi-x-circle me-1"></i>Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="low-stock-text">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  Only {quantity} left in stock
                </span>
              ) : (
                <span className="text-success fw-semibold">
                  <i className="bi bi-check-circle me-1"></i>In Stock ({quantity} available)
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="mb-3">
                <h6 className="fw-semibold mb-1">Description</h6>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {description}
                </p>
              </div>
            )}

            {/* Product Meta */}
            <div className="border rounded-3 p-3 bg-light mb-3">
              <div className="row g-2 small text-muted">
                {brand && (
                  <div className="col-6">
                    <span className="fw-semibold text-dark">Brand:</span> {brand}
                  </div>
                )}
                {category && (
                  <div className="col-6">
                    <span className="fw-semibold text-dark">Category:</span> {category}
                  </div>
                )}
                {createdAt && (
                  <div className="col-6">
                    <span className="fw-semibold text-dark">Added:</span> {formatDate(createdAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Share / QR */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div>
                <p className="small text-muted mb-1 fw-semibold">Share this product</p>
                <div className="bg-white p-1 rounded border d-inline-block" style={{ lineHeight: 0 }}>
                  <QRCodeSVG value={productUrl} size={72} level="M" />
                </div>
              </div>
              <Link to="/products" className="btn btn-outline-success align-self-end">
                <i className="bi bi-arrow-left me-1"></i>Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Zoom Modal ── */}
      {zoomOpen && (
        <div
          className="image-zoom-overlay"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product image fullscreen"
        >
          <button
            className="btn btn-light position-absolute top-0 end-0 m-3"
            onClick={() => setZoomOpen(false)}
            aria-label="Close zoom"
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <img
            src={imageUrl || PLACEHOLDER}
            alt={name}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
