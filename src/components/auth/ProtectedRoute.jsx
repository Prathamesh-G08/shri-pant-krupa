import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute wraps admin routes.
 * If the user is not logged in, redirects to /admin/login.
 * Shows a loading spinner while auth state is being determined.
 */
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Verifying access...</span>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
