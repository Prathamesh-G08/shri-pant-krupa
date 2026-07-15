/**
 * Displays a styled error alert message.
 *
 * @param {string} message - The error text to display
 * @param {Function} onRetry - Optional callback to trigger a retry action
 */
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="container py-4">
      <div className="alert alert-danger d-flex align-items-start gap-3" role="alert">
        <i className="bi bi-exclamation-triangle-fill fs-5 flex-shrink-0 mt-1"></i>
        <div className="flex-grow-1">
          <strong>Something went wrong</strong>
          <p className="mb-0 mt-1 small">{message}</p>
        </div>
        {onRetry && (
          <button
            className="btn btn-sm btn-outline-danger flex-shrink-0"
            onClick={onRetry}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
