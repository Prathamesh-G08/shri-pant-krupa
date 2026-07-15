// All dates and times displayed in Indian Standard Time (IST, UTC+5:30)
const IST_LOCALE = 'en-IN'
const IST_TIMEZONE = 'Asia/Kolkata'

/**
 * Formats a Firestore Timestamp or JS Date to a readable date string in IST.
 * @param {Object|Date} timestamp
 * @returns {string} e.g. "15 Jul 2026"
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString(IST_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: IST_TIMEZONE,
  })
}

/**
 * Formats a Firestore Timestamp to date + time in IST.
 * @param {Object|Date} timestamp
 * @returns {string} e.g. "15 Jul 2026, 10:30 AM"
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString(IST_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIMEZONE,
  })
}

/**
 * Returns a relative time string like "2 days ago" based on IST.
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
