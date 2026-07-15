/**
 * Image upload service using ImgBB API.
 * ImgBB is free forever — no credit card, no expiry.
 * Images are stored on ImgBB servers and we save the URL in Firestore.
 */

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload'

/**
 * Uploads an image file to ImgBB.
 * Returns the permanent display URL of the uploaded image.
 *
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional callback(percent) for progress
 * @returns {Promise<string>} Permanent URL of the uploaded image
 */
export const uploadImage = async (file, onProgress = null) => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('key', IMGBB_API_KEY)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        if (response.success) {
          // Return the direct display URL
          resolve(response.data.display_url)
        } else {
          reject(new Error('ImgBB upload failed: ' + response.error?.message))
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during image upload. Please try again.'))
    })

    xhr.open('POST', IMGBB_UPLOAD_URL)
    xhr.send(formData)
  })
}

/**
 * Validates an image file before upload.
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
