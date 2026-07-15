import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { loginAdmin } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

/**
 * AdminLoginPage — Secure email/password login form for the admin.
 * Redirects to dashboard if already authenticated.
 */
function AdminLoginPage() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Already logged in — skip login page
  if (currentUser) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setLoading(true)
      await loginAdmin(email.trim(), password)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      // Show friendly messages instead of Firebase error codes
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.')
      } else {
        setError('Login failed. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}
    >
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card shadow-lg border-0 rounded-3 p-4">

          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 mb-3"
              style={{ width: 64, height: 64 }}
            >
              <i className="bi bi-shield-lock-fill text-success fs-3"></i>
            </div>
            <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Admin Login</h2>
            <p className="text-muted small mb-0">Shri Pant Krupa — Store Management</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
              <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold small">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  id="email"
                  type="email"
                  className="form-control border-start-0"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold small">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Signing in…
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-muted small mt-4 mb-0">
            <i className="bi bi-lock me-1"></i>
            Secure admin access only
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
