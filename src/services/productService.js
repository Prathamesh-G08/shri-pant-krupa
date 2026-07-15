import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Firestore collection reference
const PRODUCTS_COLLECTION = 'products'
const productsRef = collection(db, PRODUCTS_COLLECTION)

/**
 * Fetch all products ordered by creation date (newest first).
 * @returns {Promise<Array>} Array of product objects with their Firestore IDs
 */
export const getAllProducts = async () => {
  const q = query(productsRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

/**
 * Fetch a single product by its Firestore document ID.
 * @param {string} productId
 * @returns {Promise<Object|null>}
 */
export const getProductById = async (productId) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

/**
 * Add a new product to Firestore.
 * Automatically adds createdAt and updatedAt timestamps.
 * @param {Object} productData
 * @returns {Promise<DocumentReference>}
 */
export const addProduct = async (productData) => {
  return await addDoc(productsRef, {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/**
 * Update an existing product.
 * Automatically updates the updatedAt timestamp.
 * @param {string} productId
 * @param {Object} updatedData
 * @returns {Promise<void>}
 */
export const updateProduct = async (productId, updatedData) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId)
  return await updateDoc(docRef, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a product by ID.
 * @param {string} productId
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId)
  return await deleteDoc(docRef)
}

/**
 * Fetch products filtered by category.
 * @param {string} category
 * @returns {Promise<Array>}
 */
export const getProductsByCategory = async (category) => {
  const q = query(
    productsRef,
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

/**
 * Fetch products marked as "New Arrival".
 * @returns {Promise<Array>}
 */
export const getNewArrivals = async () => {
  const q = query(
    productsRef,
    where('isNewArrival', '==', true),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

/**
 * Fetch products marked as "Best Seller".
 * @returns {Promise<Array>}
 */
export const getBestSellers = async () => {
  const q = query(
    productsRef,
    where('isBestSeller', '==', true),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

/**
 * Fetch all unique categories from the products collection.
 * @returns {Promise<Array<string>>}
 */
export const getAllCategories = async () => {
  const snapshot = await getDocs(productsRef)
  const categories = new Set()
  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    if (data.category) categories.add(data.category)
  })
  return Array.from(categories).sort()
}

/**
 * Fetch all unique brands from the products collection.
 * @returns {Promise<Array<string>>}
 */
export const getAllBrands = async () => {
  const snapshot = await getDocs(productsRef)
  const brands = new Set()
  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    if (data.brand) brands.add(data.brand)
  })
  return Array.from(brands).sort()
}
