import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Stores scroll positions per pathname — persists across navigations
const scrollPositions = {}

/**
 * Saves scroll position when leaving a page.
 * Restores it when returning to the same page.
 * Only restores on browser back/forward — not on fresh visits.
 */
const useScrollRestoration = () => {
  const location = useLocation()
  const prevPathname = useRef(location.pathname)

  useEffect(() => {
    const currentPath = location.pathname

    // Save scroll position of the page we just LEFT
    if (prevPathname.current !== currentPath) {
      scrollPositions[prevPathname.current] = window.scrollY
      prevPathname.current = currentPath
    }

    // If we have a saved position for this page, restore it
    const savedY = scrollPositions[currentPath]
    if (savedY !== undefined) {
      // Small timeout lets the page render before scrolling
      const timer = setTimeout(() => {
        window.scrollTo({ top: savedY, behavior: 'instant' })
      }, 50)
      return () => clearTimeout(timer)
    } else {
      // Fresh page visit — scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location.pathname])
}

export default useScrollRestoration
