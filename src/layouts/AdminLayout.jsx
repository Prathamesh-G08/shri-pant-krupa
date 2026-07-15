import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { logoutAdmin } from '../services/authService'
import { useAuth } from '../context/AuthContext'

/**
 * AdminLayout — fully responsive admin panel layout.
 * - Desktop: fixed sidebar (collapsible to icon-only)
 * - Mobile: sidebar hidden by default, toggled via hamburger in top bar
 */
function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = window.innerWidth < 768
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

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

  // On desktop: sidebar is fixed, width collapses to icons
  // On mobile: sidebar overlays the screen
  const desktopWidth = sidebarOpen ? 240 : 60

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-3 mb-4 pt-3">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
            <i className="bi bi-basket2-fill text-white fs-5" style={{ flexShrink: 0 }}></i>
            {(sidebarOpen || mobileOpen) && (
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
          {/* Desktop collapse toggle */}
          <button
            className="btn btn-sm btn-outline-light flex-shrink-0 d-none d-md-inline-flex"
            onClick={() => setSidebarOpen(p => !p)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{ padding: '2px 6px' }}
          >
            <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
          </button>
          {/* Mobile close button */}
          <button
            className="btn btn-sm btn-outline-light d-md-none"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{ padding: '2px 6px' }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-grow-1 px-2">
        <ul className="list-unstyled mb-0">
          {navLinks.map(link => (
            <li key={link.to} className="mb-1">
              <NavLink
                to={link.to}
                end={link.to === '/admin/products'}
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                title={!sidebarOpen && !mobileOpen ? link.label : undefined}
              >
                <i className={`bi ${link.icon}`} style={{ flexShrink: 0 }}></i>
                {(sidebarOpen || mobileOpen) && <span>{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom: user + logout */}
      <div className="px-2 pb-3 mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {(sidebarOpen || mobileOpen) && currentUser && (
          <div className="small mb-2 px-2 text-truncate" style={{ color: 'rgba(255,255,255,0.55)' }} title={currentUser.email}>
            <i className="bi bi-person-circle me-1"></i>
            {currentUser.email}
          </div>
        )}
        <button
          className="sidebar-nav-link"
          onClick={handleLogout}
          title={!sidebarOpen && !mobileOpen ? 'Logout' : undefined}
        >
          <i className="bi bi-box-arrow-right" style={{ color: '#ff8a80', flexShrink: 0 }}></i>
          {(sidebarOpen || mobileOpen) && <span style={{ color: '#ff8a80' }}>Logout</span>}
        </button>
      </div>
    </>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── Desktop Sidebar (fixed) ── */}
      <aside
        className="d-none d-md-flex flex-column"
        style={{
          width: desktopWidth,
          minHeight: '100vh',
          backgroundColor: 'var(--color-primary-dark)',
          position: 'fixed',
          top: 0, left: 0,
          zIndex: 100,
          transition: 'width var(--transition-normal)',
          overflow: 'hidden',
        }}
        aria-label="Admin navigation"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="d-md-none"
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 200,
            }}
          />
          {/* Drawer */}
          <aside
            className="d-flex d-md-none flex-column"
            style={{
              width: 260,
              height: '100vh',
              backgroundColor: 'var(--color-primary-dark)',
              position: 'fixed',
              top: 0, left: 0,
              zIndex: 201,
              overflowY: 'auto',
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main Content ── */}
      <div
        className="flex-grow-1 bg-light"
        style={{
          marginLeft: isMobile ? 0 : desktopWidth,
          transition: 'margin-left var(--transition-normal)',
          minHeight: '100vh',
          minWidth: 0,
        }}
      >
        {/* Top Bar */}
        <header
          className="px-3 py-2 bg-white border-bottom d-flex align-items-center justify-content-between"
          style={{ position: 'sticky', top: 0, zIndex: 50 }}
        >
          <div className="d-flex align-items-center gap-2">
            {/* Mobile hamburger */}
            <button
              className="btn btn-sm btn-outline-secondary d-md-none"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <h6 className="mb-0 fw-semibold text-muted">
              <i className="bi bi-shield-lock me-2 text-success d-none d-sm-inline"></i>
              Admin Panel
            </h6>
          </div>
          <Link to="/" className="btn btn-sm btn-outline-success">
            <i className="bi bi-eye me-1"></i>
            <span className="d-none d-sm-inline">View Store</span>
          </Link>
        </header>

        {/* Page content */}
        <div className="p-3 p-md-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
