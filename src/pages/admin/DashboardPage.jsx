import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import useProducts from '../../hooks/useProducts'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatPrice } from '../../utils/priceUtils'

function DashboardPage() {
  const { products, loading } = useProducts()

  const stats = useMemo(() => {
    const active = products.filter(p => p.status !== 'inactive')
    const outOfStock = products.filter(p => p.status === 'out_of_stock' || p.quantity === 0)
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 5 && p.status !== 'out_of_stock')
    const newArrivals = products.filter(p => p.isNewArrival)
    const bestSellers = products.filter(p => p.isBestSeller)
    const onSale = products.filter(p => p.isDiscount)
    return { total: products.length, active: active.length, outOfStock: outOfStock.length, lowStock: lowStock.length, newArrivals: newArrivals.length, bestSellers: bestSellers.length, onSale: onSale.length }
  }, [products])

  const lowStockProducts = useMemo(() =>
    products.filter(p => p.quantity > 0 && p.quantity <= 5 && p.status !== 'out_of_stock' && p.status !== 'inactive'),
    [products]
  )
  const outOfStockProducts = useMemo(() =>
    products.filter(p => p.status === 'out_of_stock' || p.quantity === 0),
    [products]
  )

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: 'bi-box-seam', color: '#2e7d32', bg: '#e8f5e9' },
    { label: 'Active Products', value: stats.active, icon: 'bi-check-circle', color: '#1565c0', bg: '#e3f2fd' },
    { label: 'Out of Stock', value: stats.outOfStock, icon: 'bi-x-circle', color: '#c62828', bg: '#ffebee' },
    { label: 'Low Stock', value: stats.lowStock, icon: 'bi-exclamation-triangle', color: '#f57f17', bg: '#fffde7' },
    { label: 'New Arrivals', value: stats.newArrivals, icon: 'bi-stars', color: '#6a1b9a', bg: '#f3e5f5' },
    { label: 'Best Sellers', value: stats.bestSellers, icon: 'bi-trophy', color: '#e65100', bg: '#fff3e0' },
  ]

  if (loading) return <LoadingSpinner message="Loading dashboard…" />

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-0">Dashboard</h2>
          <p className="text-muted small mb-0">Store overview at a glance</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-success">
          <i className="bi bi-plus-lg me-1"></i>Add Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map(card => (
          <div className="col-6 col-md-4 col-lg-2" key={card.label}>
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
              <div className="card-body text-center p-3">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                  style={{ width: 44, height: 44, backgroundColor: card.bg }}>
                  <i className={`bi ${card.icon}`} style={{ color: card.color, fontSize: '1.2rem' }}></i>
                </div>
                <div className="fw-bold" style={{ fontSize: '1.5rem', color: card.color }}>{card.value}</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="col-12 col-md-6">
            <div className="card border-warning border-2 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-header bg-warning bg-opacity-10 border-warning">
                <h6 className="mb-0 fw-semibold text-warning">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Low Stock Alert ({lowStockProducts.length})
                </h6>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {lowStockProducts.slice(0, 5).map(p => (
                    <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center px-3 py-2">
                      <div>
                        <div className="fw-semibold small">{p.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.brand}</div>
                      </div>
                      <span className="badge bg-warning text-dark">{p.quantity} left</span>
                    </div>
                  ))}
                </div>
              </div>
              {lowStockProducts.length > 5 && (
                <div className="card-footer text-center bg-transparent border-top-0">
                  <Link to="/admin/products" className="small text-warning">View all</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Out of Stock */}
        {outOfStockProducts.length > 0 && (
          <div className="col-12 col-md-6">
            <div className="card border-danger border-2 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-header bg-danger bg-opacity-10 border-danger">
                <h6 className="mb-0 fw-semibold text-danger">
                  <i className="bi bi-x-circle-fill me-2"></i>
                  Out of Stock ({outOfStockProducts.length})
                </h6>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {outOfStockProducts.slice(0, 5).map(p => (
                    <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center px-3 py-2">
                      <div>
                        <div className="fw-semibold small">{p.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.brand}</div>
                      </div>
                      <Link to={`/admin/products/edit/${p.id}`} className="btn btn-sm btn-outline-danger py-0">Update</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Products */}
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-semibold">Recent Products</h6>
              <Link to="/admin/products" className="btn btn-sm btn-outline-success">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 8).map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {p.imageUrl
                              ? <img src={p.imageUrl} alt={p.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6 }} />
                              : <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#e9ecef' }}></div>
                            }
                            <div>
                              <div className="fw-semibold">{p.name}</div>
                              <div className="text-muted">{p.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">{p.category}</td>
                        <td className="align-middle">{formatPrice(p.sellingPrice)}</td>
                        <td className="align-middle">
                          {p.quantity === 0 || p.status === 'out_of_stock'
                            ? <span className="badge bg-danger">Out</span>
                            : p.quantity <= 5
                              ? <span className="badge bg-warning text-dark">{p.quantity}</span>
                              : <span className="badge bg-success">{p.quantity}</span>
                          }
                        </td>
                        <td className="align-middle">
                          <span className={`badge ${p.status === 'active' ? 'bg-success' : p.status === 'out_of_stock' ? 'bg-danger' : 'bg-secondary'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="align-middle">
                          <Link to={`/admin/products/edit/${p.id}`} className="btn btn-sm btn-outline-primary py-0">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
