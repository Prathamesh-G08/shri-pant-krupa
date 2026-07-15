import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase/config'

/**
 * Signs in the admin user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const loginAdmin = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

/**
 * Signs out the currently authenticated user.
 * @returns {Promise<void>}
 */
export const logoutAdmin = async () => {
  return await signOut(auth)
}
