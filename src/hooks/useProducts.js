import { useState, useEffect } from 'react'
import { getAllProducts } from '../services/productService'

/**
 * Custom hook to fetch all products from Firestore.
 * Handles loading, error, and data states automatically.
 *
 * @returns {{ products: Array, loading: boolean, error: string|null, refetch: Function }}
 */
const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllProducts()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, error, refetch: fetchProducts }
}

export default useProducts
