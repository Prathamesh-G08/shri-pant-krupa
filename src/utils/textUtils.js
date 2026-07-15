/**
 * Truncates a string to a given length and adds ellipsis if needed.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Converts a string to title case.
 * @param {string} str
 * @returns {string}
 */
export const toTitleCase = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Checks if a search query matches a product's name, brand, or category.
 * Case-insensitive partial match.
 * @param {Object} product
 * @param {string} query
 * @returns {boolean}
 */
export const matchesSearch = (product, query) => {
  if (!query || query.trim() === '') return true
  const q = query.toLowerCase().trim()
  return (
    product.name?.toLowerCase().includes(q) ||
    product.brand?.toLowerCase().includes(q) ||
    product.category?.toLowerCase().includes(q)
  )
}
