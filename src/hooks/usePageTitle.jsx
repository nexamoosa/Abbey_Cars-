import { useEffect } from 'react'
import { getSiteSettings } from '../lib/cms'

export default function usePageTitle(title, fallback = 'Abbey Cars') {
  useEffect(() => {
    const siteTitle = getSiteSettings().siteTitle || fallback
    if (title) {
      document.title = `${title} | ${siteTitle}`
    } else {
      document.title = siteTitle
    }
  }, [title, fallback])
}
