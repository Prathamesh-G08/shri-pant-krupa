import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { updateProduct } from '../../services/productService'
import useProduct from '../../hooks/useProduct'
import ProductForm from '../../components/admin/ProductForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading: fetchLoading, error: fetchError } = useProduct(id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (productData) => {
    try {
      setSaving(true)
      setError('')
      await updateProduct(id, productData)
      navigate('/admin/products')
    } catch (err) {
      console.error('Update product error:', err)
      setError('Failed to update product. Please try again.')
      setSaving(false)
    }
  }

  if (fetchLoading) return <LoadingSpinner message="Loading product…" />
  if (fetchError) return <ErrorMessage message={fetchError} />
  if (!product) return null

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-0">Edit Product</h2>
        <p className="text-muted small mb-0">Update details for: <strong>{product.name}</strong></p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-exclamation-triangle-fill"></i>
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          submitLabel="Update Product"
          loading={saving}
        />
      </div>
    </div>
  )
}

export default EditProductPage
