import { useState, useEffect } from 'react'
import { getProductById } from '../services/productService'

/**
 * Custom hook to fetch a single product by ID.
 *
 * @param {string} productId - Firestore document ID
 * @returns {{ product: Object|null, loading: boolean, error: string|null }}
 */
const useProduct = (productId) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productId) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductById(productId)
        if (!data) {
          setError('Product not found.')
        } else {
          setProduct(data)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  return { product, loading, error }
}

export default useProduct
