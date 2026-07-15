import { Link } from 'react-router-dom'
import { calculateDiscount, formatPrice, hasDiscount } from '../../utils/priceUtils'
import { truncateText } from '../../utils/textUtils'

// Placeholder image when product has no image
const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'

/**
 * ProductCard — displays a product in a compact card format.
 * Used in product grids on Home, Products, and search results pages.
 *
 * @param {Object} product - Product data from Firestore
 */
function ProductCard({ product }) {
  const {
    id,
    name,
    brand,
    category,
    mrp,
    sellingPrice,
    imageUrl,
    quantity,
    isNewArrival,
    isBestSeller,
    isDiscount,
    status,
  } = product

  const isOutOfStock = status === 'out_of_stock' || quantity === 0
  const isLowStock = !isOutOfStock && quantity > 0 && quantity <= 5
  const discountPercent = hasDiscount(mrp, sellingPrice) ? calculateDiscount(mrp, sellingPrice) : 0

  return (
    <Link
      to={`/products/${id}`}
      className="text-decoration-none"
      aria-label={`View ${name}`}
    >
      <article className="product-card h-100 position-relative">

        {/* ── Badge Row (top-left overlay) ── */}
        <div
          className="position-absolute d-flex flex-column gap-1"
          style={{ top: 8, left: 8, zIndex: 2 }}
        >
          {isNewArrival && (
            <span className="badge-new">NEW</span>
          )}
          {isBestSeller && (
            <span className="badge-bestseller">BEST SELLER</span>
          )}
          {discountPercent > 0 && isDiscount && (
            <span className="badge-discount">{discountPercent}% OFF</span>
          )}
        </div>

        {/* ── Out of Stock Overlay ── */}
        {isOutOfStock && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 3, borderRadius: 'var(--border-radius-md)' }}
          >
            <span className="badge bg-secondary fs-6 px-3 py-2">Out of Stock</span>
          </div>
        )}

        {/* ── Product Image ── */}
        <img
          src={imageUrl || PLACEHOLDER_IMG}
          alt={name}
          className="card-img-top"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER_IMG }}
        />

        {/* ── Card Body ── */}
        <div className="card-body p-2 p-sm-3">

          {/* Brand & Category */}
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span
              className="text-muted"
              style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}
            >
              {brand || category}
            </span>
            {/* Low stock warning */}
            {isLowStock && (
              <span className="low-stock-text">
                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                Low
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3
            className="fw-semibold mb-2"
            style={{ fontSize: '0.85rem', lineHeight: 1.3, color: 'var(--color-text)' }}
          >
            {truncateText(name, 40)}
          </h3>

          {/* Pricing */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="price-selling">{formatPrice(sellingPrice)}</span>
            {hasDiscount(mrp, sellingPrice) && (
              <span className="price-original">{formatPrice(mrp)}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

export default ProductCard
