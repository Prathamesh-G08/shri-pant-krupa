import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from '../firebase/config'

/**
 * Uploads a product image to Firebase Storage.
 * Stores images under: products/{timestamp}_{filename}
 *
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback(percent) for upload progress
 * @returns {Promise<string>} Public download URL of the uploaded image
 */
export const uploadImage = (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    // Create a unique filename using timestamp to avoid collisions
    const timestamp = Date.now()
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const filePath = `products/${timestamp}_${cleanName}`

    const storageRef = ref(storage, filePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Report upload progress
        if (onProgress) {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
          onProgress(percent)
        }
      },
      (error) => {
        // Upload failed
        console.error('Image upload error:', error)
        reject(new Error('Failed to upload image. Please try again.'))
      },
      async () => {
        // Upload complete — get the public download URL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadURL)
        } catch (err) {
          reject(new Error('Failed to get image URL after upload.'))
        }
      }
    )
  })
}

/**
 * Deletes an image from Firebase Storage using its full download URL.
 * Called when a product is deleted or its image is replaced.
 *
 * @param {string} imageUrl - The full Firebase Storage download URL
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  if (!imageUrl) return
  try {
    // Extract the storage path from the URL and create a reference
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    // Non-fatal: log but don't throw — product deletion should still proceed
    console.warn('Could not delete image from storage:', error.message)
  }
}

/**
 * Validates an image file before upload.
 * Checks file type and size.
 *
 * @param {File} file
 * @returns {{ valid: boolean, error: string|null }}
 */
export const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  const maxSizeBytes = 5 * 1024 * 1024 // 5 MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed.' }
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, error: 'Image size must be less than 5 MB.' }
  }

  return { valid: true, error: null }
}
