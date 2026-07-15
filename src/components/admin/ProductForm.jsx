import { useState } from 'react'
import { uploadImage, validateImage } from '../../services/uploadService'
import { calculateDiscount } from '../../utils/priceUtils'

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'

const INITIAL = {
  name: '', brand: '', category: '', mrp: '', sellingPrice: '',
  description: '', quantity: '', status: 'active',
  isNewArrival: false, isBestSeller: false, isDiscount: false,
  imageUrl: '',
}

/**
 * Reusable product form for Add and Edit pages.
 * Handles image upload to ImgBB and form validation.
 */
function ProductForm({ initialData = {}, onSubmit, submitLabel = 'Save Product', loading = false }) {
  const [form, setForm] = useState({ ...INITIAL, ...initialData })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || '')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})

  const discountPercent = form.mrp && form.sellingPrice
    ? calculateDiscount(Number(form.mrp), Number(form.sellingPrice))
    : 0

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const { valid, error } = validateImage(file)
    if (!valid) { setErrors(prev => ({ ...prev, image: error })); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setErrors(prev => ({ ...prev, image: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required.'
    if (!form.category.trim()) e.category = 'Category is required.'
    if (!form.sellingPrice || Number(form.sellingPrice) <= 0) e.sellingPrice = 'Valid selling price is required.'
    if (!form.quantity || Number(form.quantity) < 0) e.quantity = 'Valid quantity is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    let imageUrl = form.imageUrl

    // Upload new image if selected
    if (imageFile) {
      try {
        setUploading(true)
        imageUrl = await uploadImage(imageFile, setUploadProgress)
      } catch (err) {
        setErrors(prev => ({ ...prev, image: 'Image upload failed. Please try again.' }))
        setUploading(false)
        return
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    }

    const productData = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category.trim(),
      mrp: Number(form.mrp) || 0,
      sellingPrice: Number(form.sellingPrice),
      description: form.description.trim(),
      quantity: Number(form.quantity),
      status: form.status,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      isDiscount: form.isDiscount,
      imageUrl,
    }

    onSubmit(productData)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">

        {/* ── Image Upload ── */}
        <div className="col-12">
          <label className="form-label fw-semibold">Product Image</label>
          <div className="d-flex align-items-start gap-3 flex-wrap">
            <div className="border rounded-3 overflow-hidden bg-light"
              style={{ width: 120, height: 120, flexShrink: 0 }}>
              <img
                src={imagePreview || PLACEHOLDER}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="flex-grow-1">
              <input
                type="file"
                className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                id="imageInput"
              />
              <div className="form-text">JPG, PNG or WebP. Max 5MB.</div>
              {errors.image && <div className="invalid-feedback d-block">{errors.image}</div>}
              {uploading && (
                <div className="mt-2">
                  <div className="progress" style={{ height: 6 }}>
                    <div className="progress-bar bg-success" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <small className="text-muted">Uploading… {uploadProgress}%</small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Product Name ── */}
        <div className="col-12 col-md-8">
          <label className="form-label fw-semibold">Product Name <span className="text-danger">*</span></label>
          <input
            type="text" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="e.g. Tata Salt 1kg" value={form.name} onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* ── Status ── */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-semibold">Status</label>
          <select name="status" className="form-select" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* ── Brand ── */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Brand</label>
          <input type="text" name="brand" className="form-control" placeholder="e.g. Tata" value={form.brand} onChange={handleChange} />
        </div>

        {/* ── Category ── */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Category <span className="text-danger">*</span></label>
          <input
            type="text" name="category" className={`form-control ${errors.category ? 'is-invalid' : ''}`}
            placeholder="e.g. Grains, Dairy, Snacks" value={form.category} onChange={handleChange}
          />
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>

        {/* ── MRP ── */}
        <div className="col-6 col-md-3">
          <label className="form-label fw-semibold">MRP (₹)</label>
          <input type="number" name="mrp" className="form-control" placeholder="0.00" min="0" step="0.01" value={form.mrp} onChange={handleChange} />
        </div>

        {/* ── Selling Price ── */}
        <div className="col-6 col-md-3">
          <label className="form-label fw-semibold">Selling Price (₹) <span className="text-danger">*</span></label>
          <input
            type="number" name="sellingPrice"
            className={`form-control ${errors.sellingPrice ? 'is-invalid' : ''}`}
            placeholder="0.00" min="0" step="0.01" value={form.sellingPrice} onChange={handleChange}
          />
          {errors.sellingPrice && <div className="invalid-feedback">{errors.sellingPrice}</div>}
        </div>

        {/* ── Discount display ── */}
        <div className="col-6 col-md-3 d-flex align-items-end">
          {discountPercent > 0 && (
            <div className="alert alert-success py-2 px-3 mb-0 w-100 text-center">
              <strong>{discountPercent}% OFF</strong>
            </div>
          )}
        </div>

        {/* ── Quantity ── */}
        <div className="col-6 col-md-3">
          <label className="form-label fw-semibold">Quantity <span className="text-danger">*</span></label>
          <input
            type="number" name="quantity"
            className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            placeholder="0" min="0" value={form.quantity} onChange={handleChange}
          />
          {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
          {form.quantity > 0 && form.quantity <= 5 && (
            <div className="form-text text-warning fw-semibold">⚠ Low stock warning will show</div>
          )}
        </div>

        {/* ── Description ── */}
        <div className="col-12">
          <label className="form-label fw-semibold">Description</label>
          <textarea name="description" className="form-control" rows={3}
            placeholder="Product details, weight, ingredients…"
            value={form.description} onChange={handleChange}
          />
        </div>

        {/* ── Toggles ── */}
        <div className="col-12">
          <label className="form-label fw-semibold d-block">Product Tags</label>
          <div className="d-flex flex-wrap gap-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="isNewArrival"
                name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isNewArrival">
                <span className="badge-new me-1">NEW</span> New Arrival
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="isBestSeller"
                name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isBestSeller">
                <span className="badge-bestseller me-1">BEST SELLER</span>
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="isDiscount"
                name="isDiscount" checked={form.isDiscount} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isDiscount">
                <span className="badge-discount me-1">DISCOUNT</span> Show discount badge
              </label>
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="col-12 d-flex gap-2 pt-2">
          <button type="submit" className="btn btn-success px-4" disabled={loading || uploading}>
            {loading || uploading
              ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
              : <><i className="bi bi-check-lg me-2"></i>{submitLabel}</>
            }
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => window.history.back()}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProductForm
