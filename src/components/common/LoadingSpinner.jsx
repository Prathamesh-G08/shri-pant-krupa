/**
 * Centered loading spinner with optional message.
 * Used across pages while async data is being fetched.
 *
 * @param {string} message - Optional label below the spinner
 * @param {boolean} fullPage - If true, takes full viewport height
 */
function LoadingSpinner({ message = 'Loading…', fullPage = true }) {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-3 text-muted ${fullPage ? 'py-5' : 'py-3'}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="spinner-border"
        style={{ color: 'var(--color-primary)', width: '2.5rem', height: '2.5rem' }}
        aria-hidden="true"
      ></div>
      <span className="small">{message}</span>
    </div>
  )
}

export default LoadingSpinner
