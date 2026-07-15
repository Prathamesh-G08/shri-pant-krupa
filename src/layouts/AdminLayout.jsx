import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { logoutAdmin } from '../services/authService'
import { useAuth } from '../context/AuthContext'

/**
 * AdminLayout wraps all protected admin pages.
 * Includes a collapsible sidebar with navigation links.
 * Responsive: sidebar collapses to icon-only mode on toggle.
 */
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutAdmin()
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navLinks = [
    { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { to: '/admin/products', icon: 'bi-box-seam', label: 'Products' },
    { to: '/admin/products/add', icon: 'bi-plus-circle', label: 'Add Product' },
  ]

  const sidebarWidth = sidebarOpen ? 240 : 60

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>

      {/* ── Sidebar ── */}
      <aside
        className="d-flex flex-column"
        aria-label="Admin navigation"
        style={{
          width: sidebarWidth,
          minHeight: '100vh',
          backgroundColor: 'var(--color-primary-dark)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          transition: 'width var(--transition-normal)',
          overflow: 'hidden',
          paddingTop: '1rem',
        }}
      >
        {/* Brand */}
        <div className="px-3 mb-4">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
              <i className="bi bi-basket2-fill text-white fs-5" style={{ flexShrink: 0 }}></i>
              {sidebarOpen && (
                <div style={{ minWidth: 0 }}>
                  <div className="text-white fw-bold text-truncate" style={{ fontSize: '0.9rem', lineHeight: 1.2 }}>
                    Shri Pant Krupa
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>
                    Admin Panel
                  </div>
                </div>
              )}
            </div>
            <button
              className="btn btn-sm btn-outline-light flex-shrink-0"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              style={{ padding: '2px 6px' }}
            >
              <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow-1 px-2">
          <ul className="list-unstyled mb-0">
            {navLinks.map((link) => (
              <li key={link.to} className="mb-1">
                <NavLink
                  to={link.to}
                  end={link.to === '/admin/products'}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? 'active' : ''}`
                  }
                  title={!sidebarOpen ? link.label : undefined}
                >
                  <i className={`bi ${link.icon}`} style={{ flexShrink: 0 }}></i>
                  {sidebarOpen && <span>{link.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom: User info + Logout */}
        <div
          className="px-2 pb-3 mt-auto pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          {sidebarOpen && currentUser && (
            <div
              className="small mb-2 px-2 text-truncate"
              style={{ color: 'rgba(255,255,255,0.55)' }}
              title={currentUser.email}
            >
              <i className="bi bi-person-circle me-1"></i>
              {currentUser.email}
            </div>
          )}
          <button
            className="sidebar-nav-link"
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <i className="bi bi-box-arrow-right" style={{ color: '#ff8a80', flexShrink: 0 }}></i>
            {sidebarOpen && <span style={{ color: '#ff8a80' }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div
        className="flex-grow-1 bg-light"
        style={{
          marginLeft: sidebarWidth,
          transition: 'margin-left var(--transition-normal)',
          minHeight: '100vh',
        }}
      >
        {/* Top Bar */}
        <header
          className="px-3 py-2 bg-white border-bottom d-flex align-items-center justify-content-between"
          style={{ position: 'sticky', top: 0, zIndex: 50 }}
        >
          <h6 className="mb-0 fw-semibold text-muted">
            <i className="bi bi-shield-lock me-2 text-success"></i>
            Admin Panel
          </h6>
          <Link to="/" className="btn btn-sm btn-outline-success">
            <i className="bi bi-eye me-1"></i>
            View Store
          </Link>
        </header>

        {/* Page Content */}
        <div className="p-3 p-md-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
