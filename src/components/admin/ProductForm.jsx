import { useState } from 'react'
import { uploadImage, validateImage } from '../../services/uploadService'
import { calculateDiscount } from '../../utils/priceUtils'
import useProducts from '../../hooks/useProducts'

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'

const INITIAL = {
  name: '', brand: '', category: '', mrp: '', sellingPrice: '',
  description: '', quantity: '', status: 'active',
  isNewArrival: false, isBestSeller: false, isDiscount: false,
  imageUrl: '',
}

/**
 * ComboField — Dropdown of existing values + option to add a new one.
 * Used for both Category and Brand fields.
 */
function ComboField({ label, name, value, onChange, options, placeholder, required, error }) {
  const [addingNew, setAddingNew] = useState(false)
  const [newValue, setNewValue] = useState('')

  const handleDropdownChange = (e) => {
    if (e.target.value === '__new__') {
      setAddingNew(true)
      setNewValue('')
      onChange({ target: { name, value: '' } })
    } else {
      setAddingNew(false)
      onChange({ target: { name, value: e.target.value } })
    }
  }

  const handleNewValueChange = (e) => {
    setNewValue(e.target.value)
    onChange({ target: { name, value: e.target.value } })
  }

  const handleConfirmNew = () => {
    if (newValue.trim()) {
      setAddingNew(false)
    }
  }

  const handleCancelNew = () => {
    setAddingNew(false)
    setNewValue('')
    onChange({ target: { name, value: '' } })
  }

  // Determine what the dropdown should show as selected
  const dropdownValue = addingNew ? '__new__' : (options.includes(value) ? value : (value ? '__new__' : ''))

  return (
    <div>
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      {/* Dropdown */}
      {!addingNew && (
        <select
          className={`form-select ${error ? 'is-invalid' : ''}`}
          value={dropdownValue}
          onChange={handleDropdownChange}
          name={name}
        >
          <option value="">-- Select {label} --</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
          <option value="__new__">➕ Add new {label.toLowerCase()}…</option>
        </select>
      )}

      {/* New value input — shown when "Add new" is selected */}
      {addingNew && (
        <div className="d-flex gap-2">
          <input
            type="text"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            placeholder={placeholder}
            value={newValue}
            onChange={handleNewValueChange}
            autoFocus
          />
          <button
            type="button"
            className="btn btn-success px-3"
            onClick={handleConfirmNew}
            disabled={!newValue.trim()}
            title="Confirm"
          >
            <i className="bi bi-check-lg"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-3"
            onClick={handleCancelNew}
            title="Cancel"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}

      {/* Show confirmed new value as a badge */}
      {!addingNew && value && !options.includes(value) && (
        <div className="mt-1 d-flex align-items-center gap-2">
          <span className="badge bg-success bg-opacity-15 text-success border border-success px-2 py-1">
            <i className="bi bi-plus-circle me-1"></i>
            New: <strong>{value}</strong>
          </span>
          <button
            type="button"
            className="btn btn-sm btn-link text-muted p-0"
            onClick={() => onChange({ target: { name, value: '' } })}
          >
            change
          </button>
        </div>
      )}

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  )
}

/**
 * Reusable product form for Add and Edit pages.
 * Handles image upload to ImgBB, form validation,
 * and smart category/brand dropdowns with add-new option.
 */
function ProductForm({ initialData = {}, onSubmit, submitLabel = 'Save Product', loading = false }) {
  const [form, setForm] = useState({ ...INITIAL, ...initialData })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || '')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})

  // Fetch existing products to build category and brand lists
  const { products } = useProducts()

  const existingCategories = [...new Set(
    products.map(p => p.category).filter(Boolean)
  )].sort()

  const existingBrands = [...new Set(
    products.map(p => p.brand).filter(Boolean)
  )].sort()

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

    onSubmit({
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
    })
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
          <label className="form-label fw-semibold">
            Product Name <span className="text-danger">*</span>
          </label>
          <input
            type="text" name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="e.g. Tata Salt 1kg"
            value={form.name} onChange={handleChange}
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

        {/* ── Brand — smart dropdown ── */}
        <div className="col-12 col-md-6">
          <ComboField
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            options={existingBrands}
            placeholder="e.g. Tata, Amul, Britannia"
            error={errors.brand}
          />
        </div>

        {/* ── Category — smart dropdown ── */}
        <div className="col-12 col-md-6">
          <ComboField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={existingCategories}
            placeholder="e.g. Grains, Dairy, Snacks, Oils"
            required
            error={errors.category}
          />
        </div>

        {/* ── MRP ── */}
        <div className="col-6 col-md-3">
          <label className="form-label fw-semibold">MRP (₹)</label>
          <input
            type="number" name="mrp" className="form-control"
            placeholder="0.00" min="0" step="0.01"
            value={form.mrp} onChange={handleChange}
          />
        </div>

        {/* ── Selling Price ── */}
        <div className="col-6 col-md-3">
          <label className="form-label fw-semibold">
            Selling Price (₹) <span className="text-danger">*</span>
          </label>
          <input
            type="number" name="sellingPrice"
            className={`form-control ${errors.sellingPrice ? 'is-invalid' : ''}`}
            placeholder="0.00" min="0" step="0.01"
            value={form.sellingPrice} onChange={handleChange}
          />
          {errors.sellingPrice && <div className="invalid-feedback">{errors.sellingPrice}</div>}
        </div>

        {/* ── Discount Preview ── */}
        <div className="col-6 col-md-3 d-flex align-items-end">
          {discountPercent > 0 ? (
            <div className="alert alert-success py-2 px-3 mb-0 w-100 text-center fw-semibold">
              {discountPercent}% OFF
            </div>
          ) : (
            <div className="text-muted small mb-2">Discount auto-calculated</div>
          )}
        </div>

        {/* ── Quantity ── */}
        <div className="col-6 col-md-3">
          <label className="form-label fw-semibold">
            Quantity <span className="text-danger">*</span>
          </label>
          <input
            type="number" name="quantity"
            className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
            placeholder="0" min="0"
            value={form.quantity} onChange={handleChange}
          />
          {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
          {Number(form.quantity) > 0 && Number(form.quantity) <= 5 && (
            <div className="form-text text-warning fw-semibold">
              <i className="bi bi-exclamation-triangle-fill me-1"></i>Low stock warning will show
            </div>
          )}
        </div>

        {/* ── Description ── */}
        <div className="col-12">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            name="description" className="form-control" rows={3}
            placeholder="Product details, weight, ingredients, usage…"
            value={form.description} onChange={handleChange}
          />
        </div>

        {/* ── Toggles ── */}
        <div className="col-12">
          <label className="form-label fw-semibold d-block mb-2">Product Tags</label>
          <div className="d-flex flex-wrap gap-4">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch"
                id="isNewArrival" name="isNewArrival"
                checked={form.isNewArrival} onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isNewArrival">
                <span className="badge-new me-1">NEW</span> New Arrival
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch"
                id="isBestSeller" name="isBestSeller"
                checked={form.isBestSeller} onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isBestSeller">
                <span className="badge-bestseller me-1">BEST SELLER</span>
              </label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch"
                id="isDiscount" name="isDiscount"
                checked={form.isDiscount} onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isDiscount">
                <span className="badge-discount me-1">DISCOUNT</span> Show discount badge
              </label>
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="col-12 d-flex gap-2 pt-2 border-top mt-2">
          <button
            type="submit"
            className="btn btn-success px-4"
            disabled={loading || uploading}
          >
            {loading || uploading
              ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
              : <><i className="bi bi-check-lg me-2"></i>{submitLabel}</>
            }
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProductForm
