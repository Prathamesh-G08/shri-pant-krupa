/**
 * Calculates the discount percentage between MRP and selling price.
 * @param {number} mrp - Maximum Retail Price
 * @param {number} sellingPrice - Actual selling price
 * @returns {number} Discount percentage rounded to nearest integer
 */
export const calculateDiscount = (mrp, sellingPrice) => {
  if (!mrp || !sellingPrice || mrp <= 0) return 0
  const discount = ((mrp - sellingPrice) / mrp) * 100
  return Math.round(discount)
}

/**
 * Formats a number as Indian Rupee currency string.
 * @param {number} amount
 * @returns {string} e.g. "₹ 120.00"
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₹ 0.00'
  return `₹ ${Number(amount).toFixed(2)}`
}

/**
 * Checks if a product has a valid discount (selling price less than MRP).
 * @param {number} mrp
 * @param {number} sellingPrice
 * @returns {boolean}
 */
export const hasDiscount = (mrp, sellingPrice) => {
  return mrp && sellingPrice && sellingPrice < mrp
}
