import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

const WEBSITE_URL = typeof window !== 'undefined'
  ? window.location.origin
  : 'https://shri-pant-krupa.vercel.app'

/**
 * Site footer.
 * Contains store info, quick links, categories, QR code.
 * Hidden admin login: clicking the copyright text 3 times navigates to /admin/login.
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  // Hidden admin access — triple click on copyright text
  const [clickCount, setClickCount] = useState(0)
  const [lastClick, setLastClick] = useState(0)

  const handleSecretClick = () => {
    const now = Date.now()
    // Reset count if more than 2 seconds between clicks
    const count = now - lastClick < 2000 ? clickCount + 1 : 1
    setClickCount(count)
    setLastClick(now)
    if (count >= 3) {
      setClickCount(0)
      window.location.href = '/admin/login'
    }
  }

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container py-4">
        <div className="row g-4">

          {/* ── Store Info ── */}
          <div className="col-12 col-sm-6 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-basket2-fill fs-5 text-white"></i>
              <h5 className="mb-0 text-white fw-bold">Shri Pant Krupa</h5>
            </div>
            <p className="small mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Your trusted neighborhood grocery store. Fresh products, fair prices, and great service.
            </p>
            <div className="small" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <div className="mb-1">
                <i className="bi bi-geo-alt me-1"></i>
                Shop No. 3, Sai Samrudhi Building,
                Mahada Colony, Chitralaya, Pune
              </div>
              <div className="mt-2">
                <i className="bi bi-clock me-1"></i>
                Mon – Sun: 7:00 AM – 10:00 PM IST
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-6 col-sm-3 col-md-2">
            <h6 className="text-white fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/products?filter=new', label: 'New Arrivals' },
                { to: '/products?filter=bestseller', label: 'Best Sellers' },
                { to: '/products?filter=discount', label: 'On Sale' },
              ].map(link => (
                <li key={link.to} className="mb-2">
                  <Link to={link.to} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
                    onMouseOver={e => e.target.style.color = '#fff'}
                    onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div className="col-6 col-sm-3 col-md-2">
            <h6 className="text-white fw-semibold mb-3">Categories</h6>
            <ul className="list-unstyled small">
              {['Grains', 'Dairy', 'Snacks', 'Beverages', 'Oils', 'Spices'].map(cat => (
                <li key={cat} className="mb-2">
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
                    onMouseOver={e => e.target.style.color = '#fff'}
                    onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── QR Code ── */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <h6 className="text-white fw-semibold mb-2">Scan to Visit</h6>
            <p className="small mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Share with friends &amp; family
            </p>
            <div
              className="d-inline-block p-2 bg-white rounded"
              style={{ lineHeight: 0 }}
              aria-label="QR Code to visit Shri Pant Krupa website"
            >
              <QRCodeSVG value={WEBSITE_URL} size={100} level="M" includeMargin={false} />
            </div>
            <p className="small mt-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
              Scan with your phone camera
            </p>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-center text-sm-start">

          {/* Triple-click this text to go to admin login — invisible to regular users */}
          <p
            className="small mb-0"
            style={{ color: 'rgba(255,255,255,0.5)', cursor: 'default', userSelect: 'none' }}
            onClick={handleSecretClick}
            title=""
            aria-hidden="true"
          >
            © {currentYear} Shri Pant Krupa. All rights reserved.
          </p>

          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Designed and Developed by Prathamesh Gaddennavar
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
