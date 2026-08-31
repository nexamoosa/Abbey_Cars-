import { useEffect } from 'react'

export default function usePageTitle(title, fallback = 'Abbey Cars') {
  useEffect(() => {
    document.title = title || fallback
  }, [title, fallback])
}
