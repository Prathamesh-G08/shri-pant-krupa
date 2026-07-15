/**
 * Formats a Firestore Timestamp or JS Date to a readable date string.
 * @param {Object|Date} timestamp - Firestore Timestamp or Date object
 * @returns {string} e.g. "15 Jul 2026"
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'

  // Handle Firestore Timestamp objects
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Returns a relative time string like "2 days ago".
 * @param {Object|Date} timestamp
 * @returns {string}
 */
export const timeAgo = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  const seconds = Math.floor((new Date() - date) / 1000)

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }

  return 'Just now'
}
