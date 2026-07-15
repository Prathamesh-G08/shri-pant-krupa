import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addProduct } from '../../services/productService'
import ProductForm from '../../components/admin/ProductForm'

function AddProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (productData) => {
    try {
      setLoading(true)
      setError('')
      await addProduct(productData)
      navigate('/admin/products')
    } catch (err) {
      console.error('Add product error:', err)
      setError('Failed to add product. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-0">Add New Product</h2>
        <p className="text-muted small mb-0">Fill in the details to add a product to your store</p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-exclamation-triangle-fill"></i>
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
        <ProductForm
          onSubmit={handleSubmit}
          submitLabel="Add Product"
          loading={loading}
        />
      </div>
    </div>
  )
}

export default AddProductPage
