import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useProducts from '../../hooks/useProducts'
import { deleteProduct } from '../../services/productService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { formatPrice } from '../../utils/priceUtils'
import { matchesSearch } from '../../utils/textUtils'

function ManageProductsPage() {
  const { products, loading, error, refetch } = useProducts()
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const filtered = useMemo(() =>
    products.filter(p => matchesSearch(p, search)),
    [products, search]
  )

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteProduct(id)
      await refetch()
    } catch (err) {
      alert('Failed to delete product. Please try again.')
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  if (loading) return <LoadingSpinner message="Loading products…" />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0">Manage Products</h2>
          <p className="text-muted small mb-0">{products.length} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-success">
          <i className="bi bi-plus-lg me-1"></i>Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-3">
        <div className="input-group" style={{ maxWidth: 400 }}>
          <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
          <input
            type="search"
            className="form-control border-start-0"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-box-seam" style={{ fontSize: '3rem', opacity: 0.2 }}></i>
          <p className="mt-3">No products found.</p>
          <Link to="/admin/products/add" className="btn btn-success">Add First Product</Link>
        </div>
      )}

      {/* Products Table */}
      {filtered.length > 0 && (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 small align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 40 }}></th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>MRP</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Tags</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td>
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                          : <div style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: '#e9ecef' }}></div>
                        }
                      </td>
                      <td>
                        <div className="fw-semibold">{p.name}</div>
                        <div className="text-muted">{p.brand}</div>
                      </td>
                      <td>{p.category}</td>
                      <td className="text-muted text-decoration-line-through">{formatPrice(p.mrp)}</td>
                      <td className="fw-semibold text-success">{formatPrice(p.sellingPrice)}</td>
                      <td>
                        {p.quantity === 0 || p.status === 'out_of_stock'
                          ? <span className="badge bg-danger">Out</span>
                          : p.quantity <= 5
                            ? <span className="badge bg-warning text-dark">⚠ {p.quantity}</span>
                            : <span className="badge bg-success">{p.quantity}</span>
                        }
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {p.isNewArrival && <span className="badge-new">NEW</span>}
                          {p.isBestSeller && <span className="badge-bestseller">BEST</span>}
                          {p.isDiscount && <span className="badge-discount">SALE</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${p.status === 'active' ? 'bg-success' : p.status === 'out_of_stock' ? 'bg-danger' : 'bg-secondary'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        {confirmId === p.id ? (
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-danger py-0"
                              onClick={() => handleDelete(p.id)}
                              disabled={deletingId === p.id}
                            >
                              {deletingId === p.id ? '…' : 'Confirm'}
                            </button>
                            <button className="btn btn-sm btn-secondary py-0" onClick={() => setConfirmId(null)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex gap-1">
                            <Link to={`/admin/products/edit/${p.id}`} className="btn btn-sm btn-outline-primary py-0">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button className="btn btn-sm btn-outline-danger py-0" onClick={() => setConfirmId(p.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageProductsPage
