import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

// The live website URL — update this after Vercel deployment
const WEBSITE_URL = typeof window !== 'undefined'
  ? window.location.origin
  : 'https://shri-pant-krupa.vercel.app'

/**
 * Site footer with store info, quick links, and QR code for easy mobile sharing.
 */
function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container py-4">
        <div className="row g-4">

          {/* ── Store Info ── */}
          <div className="col-12 col-md-4">
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
                Pune, Maharashtra, India
              </div>
              <div className="mb-1">
                <i className="bi bi-clock me-1"></i>
                Mon–Sat: 8:00 AM – 9:00 PM
              </div>
              <div>
                <i className="bi bi-clock me-1"></i>
                Sunday: 9:00 AM – 1:00 PM
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="col-6 col-md-2">
            <h6 className="text-white fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="footer-link">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="footer-link">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                  All Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?filter=new" className="footer-link">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                  New Arrivals
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?filter=bestseller" className="footer-link">
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Categories placeholder (populated dynamically in Phase 2) ── */}
          <div className="col-6 col-md-2">
            <h6 className="text-white fw-semibold mb-3">Categories</h6>
            <ul className="list-unstyled small">
              {['Grains', 'Dairy', 'Snacks', 'Beverages', 'Oils'].map((cat) => (
                <li key={cat} className="mb-2">
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="footer-link"
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
              <QRCodeSVG
                value={WEBSITE_URL}
                size={100}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="small mt-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
              Scan with your phone camera
            </p>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © {currentYear} Shri Pant Krupa. All rights reserved.
          </p>
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Built with <i className="bi bi-heart-fill text-danger"></i> for our customers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
