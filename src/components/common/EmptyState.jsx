/**
 * Empty state placeholder with icon, title, and optional action button.
 *
 * @param {string} icon - Bootstrap icon class (e.g. "bi-box-seam")
 * @param {string} title - Main heading text
 * @param {string} message - Descriptive subtext
 * @param {string} actionLabel - Optional button label
 * @param {Function} onAction - Optional button click handler
 */
function EmptyState({ icon = 'bi-inbox', title = 'Nothing here', message, actionLabel, onAction }) {
  return (
    <div className="text-center py-5 text-muted">
      <i className={`bi ${icon}`} style={{ fontSize: '3.5rem', opacity: 0.25 }} aria-hidden="true"></i>
      <h6 className="mt-3 mb-1 fw-semibold">{title}</h6>
      {message && <p className="small mb-3">{message}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-sm btn-outline-success" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
