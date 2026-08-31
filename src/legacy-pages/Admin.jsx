import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaXTwitter, FaTiktok, FaGlobe } from 'react-icons/fa6'
import usePageTitle from '../hooks/usePageTitle'
import {
  FiBookOpen,
  FiCalendar,
  FiHelpCircle,
  FiHome,
  FiMail,
  FiSettings,
  FiShield,
  FiBell,
  FiChevronLeft,
  FiChevronRight
} from '../components/Icons'
import { MdDirectionsCar, MdInfo, MdLocationOn } from '../components/Icons'
import { FiCheck, FiCheckCircle, FiRefreshCw, FiTrash2, FiMail as FiMailIcon, FiCalendar as FiCalendarIcon, FiGlobe, FiExternalLink, FiXCircle, FiRotateCcw, FiEdit3 } from 'react-icons/fi'
import { applyTheme, loadStoredTheme } from '../theme'
import { getSiteSettings, setSiteSettings, createPage, getPrivacyPages, getTermsPages, getAreas, updatePrivacyPage, updateTermsPage, updateArea, addPrivacyPage, addTermsPage, addArea, getSocialLinks, addSocialLink, removeSocialLink, removePrivacyPage, removeTermsPage, removeArea, getBlogPosts, addBlogPost, updateBlogPost, removeBlogPost, getAllTestimonials, addTestimonial, updateTestimonial, removeTestimonial } from '../lib/cms'
import { getFormSettings, saveFormSettings, getBookings, updateBookingStatus, deleteBookingPermanently, getFleet, getFleetVehicle, createFleetVehicleJson, updateFleetVehicle, trashFleetVehicle, deleteFleetVehiclePermanently, uploadFleetImages, setFleetImagePrimary, deleteFleetImage, reorderFleetImages, getDashboardSummary, getMedia, addImageUsage, replaceFleetImage, updateFleetImageMeta, createNotification, getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, getUnreadNotificationCount, getContactSubmissions, updateContactSubmissionStatus, deleteContactSubmission, getUsers, createUser, updateUser, deleteUser } from '../lib/api'
import HelpChatWidget from '../components/HelpChatWidget'

const sidebarSections = [
  { key: 'dashboard', label: 'Dashboard', icon: FiHome },
  { key: 'bookings', label: 'Bookings', icon: FiCalendar },
  { key: 'privacy', label: 'Privacy Policies', icon: FiShield },
  { key: 'terms', label: 'Terms & Conditions', icon: FiShield },
  { key: 'fleet', label: 'Our Fleet', icon: MdDirectionsCar },
  { key: 'media', label: 'Media', icon: FiBell },
  { key: 'notifications', label: 'Notifications', icon: FiBell },
  { key: 'areas', label: 'Areas', icon: MdLocationOn },
  { key: 'blogs', label: 'Blogs', icon: FiBookOpen },
  { key: 'contact', label: 'Contact Info', icon: FiMail },
  { key: 'forms', label: 'Forms', icon: FiBookOpen },
  // removed Social Links from sidebar per requirements
  { key: 'settings', label: 'Settings', icon: FiSettings, children: [
    { key: 'users', label: 'Users' },
    { key: 'theme', label: 'Theme' },
    { key: 'site-settings', label: 'Site Settings' },
    { key: 'social-links', label: 'Social Links' },
    { key: 'testimonials', label: 'Testimonials' },
  ] },
  { key: 'help', label: 'Help', icon: FiHelpCircle },
]

const sectionContent = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Manage bookings, fleet details, locations, blogs, and contact data from one place.',
    cards: [
      { label: 'Total Bookings', value: '128' },
      { label: 'Fleet Units', value: '26' },
      { label: 'Active Areas', value: '08' },
      { label: 'New Messages', value: '14' },
    ],
  },
  bookings: {
    title: 'Bookings',
    subtitle: 'Track car reservations, approvals, and upcoming customer requests.',
    cards: [
      { label: 'Pending', value: '12' },
      { label: 'Confirmed', value: '54' },
      { label: 'Completed', value: '62' },
    ],
  },
  privacy: {
    title: 'Privacy Policies',
    subtitle: 'Review privacy notices, consent content, and policy updates.',
    cards: [
      { label: 'Policies', value: '04' },
      { label: 'Last Update', value: 'Today' },
      { label: 'Consent Logs', value: '128' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Manage terms, conditions, and legal notices shown on the site.',
    cards: [
      { label: 'Terms Pages', value: '02' },
      { label: 'Last Update', value: 'Today' },
      { label: 'Active', value: '02' },
    ],
  },
  fleet: {
    title: 'Our Fleet',
    subtitle: 'Update vehicle inventory, pricing status, and fleet availability.',
    cards: [
      { label: 'Cars Listed', value: '-' },
      { label: 'Available', value: '-' },
      { label: 'Maintenance', value: '-' },
    ],
  },
  areas: {
    title: 'Areas',
    subtitle: 'Manage service radius, popular towns, and area coverage details.',
    cards: [
      { label: 'Coverage Zones', value: '08' },
      { label: 'Popular Areas', value: '05' },
      { label: 'New Requests', value: '04' },
    ],
  },
  blogs: {
    title: 'Blogs',
    subtitle: 'Publish content, review drafts, and keep your travel updates current.',
    cards: [
      { label: 'Published Posts', value: '19' },
      { label: 'Drafts', value: '03' },
      { label: 'Views', value: '4.2k' },
    ],
  },
  contact: {
    title: 'Contact Info',
    subtitle: 'Adjust office details, support contact methods, and response hours.',
    cards: [
      { label: 'Phone Numbers', value: '03' },
      { label: 'Emails', value: '02' },
      { label: 'Open Hours', value: '24/7' },
    ],
  },
  forms: {
    title: 'Forms',
    subtitle: 'Manage booking vehicles and Web3Forms access keys for live forms.',
    cards: [
      { label: 'Vehicle Options', value: '0' },
      { label: 'Saved Access Keys', value: '2' },
      { label: 'Live Booking Page', value: 'Ready' },
    ],
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Review booking, contact, and website update alerts.',
    cards: [],
  },
  settings: {
    title: 'Settings',
    subtitle: 'Update system preferences, site controls, and admin configuration.',
    cards: [
      { label: 'Preferences', value: '12' },
      { label: 'Admin Roles', value: '02' },
      { label: 'Status', value: 'Healthy' },
    ],
  },
  help: {
    title: 'Help',
    subtitle: 'Browse documentation, support notes, and contact the admin support team.',
    cards: [
      { label: 'Resources', value: '10' },
      { label: 'FAQ Items', value: '18' },
      { label: 'Support Team', value: 'Online' },
    ],
  },
  users: {
    title: 'Users',
    subtitle: 'Manage administrative users and access controls.',
    cards: [
      { label: 'Active Users', value: '03' },
      { label: 'Roles', value: '02' },
      { label: 'Last Login', value: 'Today' },
    ],
  },
  'site-settings': {
    title: 'Site Settings',
    subtitle: 'Control site title, maintenance mode, favicon, and key platform settings.',
    cards: [
      { label: 'Maintenance', value: 'Off' },
      { label: 'Favicon', value: 'Uploaded' },
      { label: 'Site Title', value: 'Abbey Cars' },
    ],
  },
  'social-links': {
    title: 'Social Links',
    subtitle: 'Manage the social profiles shown in site headers and footers.',
    cards: [
      { label: 'Links', value: '03' },
      { label: 'Active', value: '03' },
      { label: 'Updated', value: 'Today' },
    ],
  },
  testimonials: {
    title: 'Testimonials',
    subtitle: 'Manage the customer reviews displayed on the public website.',
    cards: [],
  },
}

function Admin() {
  const [user, setUser] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [themeState, setThemeState] = useState(loadStoredTheme())
  const [themeSavedNotice, setThemeSavedNotice] = useState('')
  const [cmsRefresh, setCmsRefresh] = useState(0)
  const [dashboardSummary, setDashboardSummary] = useState(null)
  const [editing, setEditing] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotifications, setSelectedNotifications] = useState([])
  const audioUnlockedRef = useRef(false)
  const notificationsRef = useRef(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editorType, setEditorType] = useState(null)
  const [editorPage, setEditorPage] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const apiBase = '/api'

  const notifySiteChange = (title, message) => {
    createNotification({ type: 'site-change', title, message, reference_type: 'site-change' }).catch(() => {})
  }
  const apiHost = apiBase.replace(/\/api\/?$/, '')
  const resolveImageUrl = (src) => {
    if (!src) return ''
    const trimmed = String(src).trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    if (trimmed.startsWith('/')) return `${apiHost}${trimmed}`
    return `${apiHost}/${trimmed}`
  }

  const getAdminPath = (section) => (section === 'dashboard' ? '/admin' : `/admin/${section}`)

  useEffect(() => {
    const unlockAudio = () => { audioUnlockedRef.current = true }
    window.addEventListener('pointerdown', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  useEffect(() => {
    const normalized = location.pathname.replace(/^\/admin\/?/, '')
    let section = normalized ? normalized.split('/')[0] : 'dashboard'
    // map route keys to sidebar section keys
    if (section === 'areas-we-cover' || section === 'areas') section = 'areas'
    if (!section) section = 'dashboard'
    setActiveSection(section)
  }, [location.pathname])

  useEffect(() => {
    const match = location.pathname.match(/^\/admin\/(privacy|terms|areas-we-cover|blogs)\/(create|edit)(?:\/(.+))?$/)
    if (!match) {
      setEditorType(null)
      setEditorPage(null)
      return
    }

    const type = match[1]
    const mode = match[2]
    const slug = match[3]
    setEditorType(type)

    if (mode === 'create') {
      setEditorPage({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        meta: { description: '' },
        status: 'draft',
        featured_image: '',
      })
      return
    }

    if (!slug) {
      navigate(`/admin/${type === 'areas-we-cover' ? 'areas' : type}`, { replace: true })
      return
    }

    let page = null
    if (type === 'privacy') page = getPrivacyPages().find((p) => p.slug === slug)
    if (type === 'terms') page = getTermsPages().find((p) => p.slug === slug)
    if (type === 'areas-we-cover') page = getAreas().find((p) => p.slug === slug || p.to?.split('/').pop() === slug)
    if (type === 'blogs') page = getBlogPosts().find((p) => p.slug === slug)

    if (!page) {
      navigate(`/admin/${type === 'areas-we-cover' ? 'areas' : type}`, { replace: true })
      return
    }

    setEditorPage(page)
  }, [location.pathname, cmsRefresh, navigate])

  // Helper function to check if user has permission to view a page
  const hasPagePermission = (pageName) => {
    if (!user) return false
    // Super admins have access to everything
    if (user.role === 'super_admin') return true
    // Check if page is in user's permissions
    if (user.permissions && user.permissions.pages) {
      return user.permissions.pages.includes(pageName)
    }
    return false
  }

  const openAreaEditor = (area) => {
    const slug = area?.slug || area?.to?.split('/').pop()
    if (!slug) return
    setEditing(null)
    navigate(`/admin/areas-we-cover/edit/${slug}`)
  }

  // Get filtered sidebar sections based on user permissions
  const getFilteredSections = () => {
    if (!user) return []
    return sidebarSections.filter(section => {
      if (section.children) {
        // For parent sections like Settings, filter children
        const filteredChildren = section.children.filter(child => hasPagePermission(child.key))
        return filteredChildren.length > 0
      }
      return hasPagePermission(section.key)
    }).map(section => {
      if (section.children) {
        return {
          ...section,
          children: section.children.filter(child => hasPagePermission(child.key))
        }
      }
      return section
    })
  }

  useEffect(() => {
    const load = async () => {
      try {
        const headers = {}
        const sid = localStorage.getItem('sessionId')
        if (sid) headers['X-Session-Id'] = sid
        const response = await fetch(`${apiBase}/check.php`, {
          credentials: 'include',
          headers,
        })

        if (!response.ok) {
          setCheckingAuth(false)
          navigate('/login', { replace: true })
          return
        }

        const data = await response.json()
        if (!data.loggedIn || !data.user) {
          setCheckingAuth(false)
          navigate('/login', { replace: true })
          return
        }

        setUser(data.user)
        setCheckingAuth(false)
      } catch (error) {
        setCheckingAuth(false)
        navigate('/login', { replace: true })
      }
    }

    load()
  }, [apiBase, navigate])

  useEffect(() => {
    if (activeSection !== 'dashboard' && activeSection !== 'fleet') return
    const loadSummary = async () => {
      try {
        const res = await getDashboardSummary()
        setDashboardSummary(res.summary || null)
      } catch (err) {
        setDashboardSummary(null)
      }
    }
    loadSummary()
  }, [activeSection, cmsRefresh])

  useEffect(() => {
    // SSE realtime notifications: stream events, prepend to list, and play a short sound
    if (typeof window === 'undefined' || !window.EventSource) return
    const sid = (() => { try { return localStorage.getItem('sessionId') } catch { return null } })()
    // Only start EventSource if we have a session ID (authenticated)
    if (!sid) return
    const url = new URL(`${apiBase}/notifications-stream.php`, window.location.href)
    url.searchParams.set('session_id', sid)
    let es
    try {
      es = new EventSource(url.toString())
    } catch (err) {
      console.debug('EventSource initialization skipped (API may be unavailable)')
      return
    }

    const playNotificationSound = () => {
      try {
        const settings = getSiteSettings()
        if (!settings.notifySoundEnabled) return
        const src = settings.notifySoundUrl || settings.notifySoundData
        if (src) {
          const a = new Audio(src)
          a.volume = 0.15
          if (audioUnlockedRef.current) a.play().catch(() => {})
          return
        }
        if (!audioUnlockedRef.current) return
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        const ctx = new AudioCtx()
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {})
        }
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = 880
        g.gain.value = 0.05
        o.connect(g)
        g.connect(ctx.destination)
        o.start()
        setTimeout(() => { try { o.stop(); ctx.close() } catch {} }, 120)
      } catch (err) {
        // silent fallback
      }
    }

    es.addEventListener('connected', () => {})

    es.addEventListener('notification', (e) => {
      try {
        const data = JSON.parse(e.data)
        setNotifications((cur) => [data, ...cur])
        setUnreadCount((c) => c + 1)
        playNotificationSound()
      } catch (err) {
        // ignore
      }
    })

    es.addEventListener('error', () => {
      // EventSource will auto-reconnect; we could handle showing offline state
    })

    return () => { try { es.close() } catch {} }
  }, [apiBase])

  // Notifications polling and helpers
  useEffect(() => {
    let mounted = true
    const loadUnread = async () => {
      try {
        const res = await getUnreadNotificationCount()
        if (!mounted) return
        setUnreadCount(res.unread || 0)
      } catch (err) {
        // ignore
      }
    }
    loadUnread()
    const id = setInterval(loadUnread, 30000)
    return () => { mounted = false; clearInterval(id) }
  }, [cmsRefresh])

  const refreshNotifications = async () => {
    try {
      const res = await getNotifications({ limit: 50 })
      const localChat = (() => {
        try {
          const raw = localStorage.getItem('abbey_admin_support_notifications_v1')
          const parsed = raw ? JSON.parse(raw) : []
          const currentName = String(user?.name || '').trim().toLowerCase()
          return Array.isArray(parsed)
            ? parsed.filter((n) => {
                const targetName = String(n.targetUserKey || n.targetUserId || '').trim().toLowerCase()
                return targetName === currentName || n.targetUserId === 'all'
              })
            : []
        } catch {
          return []
        }
      })()
      const combined = [...localChat, ...(res.notifications || [])]
      setNotifications(combined)
      const cnt = await getUnreadNotificationCount()
      setUnreadCount((cnt.unread || 0) + localChat.filter((n) => !n.is_read).length)
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
    refreshNotifications()
  }, [activeSection, user])

  useEffect(() => {
    const syncLocalChatNotifications = () => {
      if (!user) return
      const localChat = (() => {
        try {
          const raw = localStorage.getItem('abbey_admin_support_notifications_v1')
          const parsed = raw ? JSON.parse(raw) : []
          const currentName = String(user?.name || '').trim().toLowerCase()
          return Array.isArray(parsed)
            ? parsed.filter((n) => {
                const targetName = String(n.targetUserKey || n.targetUserId || '').trim().toLowerCase()
                return targetName === currentName || n.targetUserId === 'all'
              })
            : []
        } catch {
          return []
        }
      })()
      setNotifications((current) => {
        const uniqueIds = new Set(current.map((item) => item.id))
        const deduped = localChat.filter((item) => !uniqueIds.has(item.id))
        return [...deduped, ...current]
      })
    }

    syncLocalChatNotifications()
    window.addEventListener('admin-chat-notification', syncLocalChatNotifications)
    return () => window.removeEventListener('admin-chat-notification', syncLocalChatNotifications)
  }, [user])

  useEffect(() => {
    if (!notificationsOpen) return
    const handleOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [notificationsOpen])

  const markRead = async (id) => {
    try {
      await markNotificationRead(id, true)
      setNotifications((cur) => cur.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)))
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch (err) {}
  }

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications((cur) => cur.map((n) => ({ ...n, is_read: 1 })))
      setUnreadCount(0)
    } catch (err) {}
  }

  const toggleSelectNotification = (id) => {
    setSelectedNotifications((cur) => {
      if (!cur) return [id]
      if (cur.includes(id)) return cur.filter((x) => x !== id)
      return [...cur, id]
    })
  }

  const selectAllNotifications = () => {
    const ids = (notifications || []).map((n) => n.id)
    setSelectedNotifications(ids)
  }

  const clearSelection = () => setSelectedNotifications([])

  const bulkMarkSelected = async (isRead) => {
    if (!selectedNotifications || selectedNotifications.length === 0) return
    try {
      const headers = { 'Content-Type': 'application/json' }
      const sid = localStorage.getItem('sessionId')
      if (sid) headers['X-Session-Id'] = sid
      await fetch(`${apiBase}/notifications.php`, { method: 'PUT', credentials: 'include', headers, body: JSON.stringify({ ids: selectedNotifications, is_read: isRead ? 1 : 0 }) })
      await refreshNotifications()
      clearSelection()
    } catch (err) {}
  }

  const bulkDeleteSelected = async () => {
    if (!selectedNotifications || selectedNotifications.length === 0) return
    try {
      const headers = { 'Content-Type': 'application/json' }
      const sid = localStorage.getItem('sessionId')
      if (sid) headers['X-Session-Id'] = sid
      await fetch(`${apiBase}/notifications.php`, { method: 'DELETE', credentials: 'include', headers, body: JSON.stringify({ ids: selectedNotifications }) })
      await refreshNotifications()
      clearSelection()
    } catch (err) {}
  }

  const deleteNotificationLocal = async (id) => {
    try {
      await deleteNotification(id)
      setNotifications((cur) => cur.filter((n) => n.id !== id))
    } catch (err) {}
  }

  const logout = async () => {
    const headers = {
      'Content-Type': 'application/json',
    }
    const sid = localStorage.getItem('sessionId')
    if (sid) headers['X-Session-Id'] = sid

    try {
      await fetch(`${apiBase}/logout.php`, {
        method: 'POST',
        credentials: 'include',
        headers,
      })
    } catch (error) {
      // Keep going even if the API request fails so the client always signs out locally.
    }

    try { localStorage.removeItem('sessionId') } catch {}
    try { sessionStorage.removeItem('sessionId') } catch {}
    navigate('/')
  }

  function SocialLinksManager() {
    const [links, setLinks] = useState(() => getSocialLinks())
    const [label, setLabel] = useState('')
    const [url, setUrl] = useState('')

    const getSocialIcon = (link) => {
      const haystack = `${link?.label || ''} ${link?.url || ''}`.toLowerCase()
      if (haystack.includes('facebook')) return FaFacebookF
      if (haystack.includes('instagram')) return FaInstagram
      if (haystack.includes('linkedin')) return FaLinkedinIn
      if (haystack.includes('youtube') || haystack.includes('youtu.be')) return FaYoutube
      if (haystack.includes('x.com') || haystack.includes('twitter')) return FaXTwitter
      if (haystack.includes('tiktok')) return FaTiktok
      return FaGlobe
    }

    const refresh = () => setLinks(getSocialLinks())

    const add = () => {
      if (!label || !url) return
      addSocialLink({ label, url })
      setLabel('')
      setUrl('')
      refresh()
      try { window.dispatchEvent(new Event('storage')) } catch {}
    }

    const remove = (i) => {
      removeSocialLink(i)
      refresh()
      try { window.dispatchEvent(new Event('storage')) } catch {}
    }

    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <h3 className="text-lg font-bold">Social Links</h3>
        <p className="text-sm text-zinc-500">Links auto-detect their platform icon (Facebook, Instagram, LinkedIn, etc.).</p>
        <div className="mt-4 space-y-2">
          {links.map((l, i) => {
            const Icon = getSocialIcon(l)
            return (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-medium text-zinc-900">{l.label}</div>
                    <a href={l.url} className="text-sm text-yellow-600">{l.url}</a>
                  </div>
                </div>
                <button onClick={() => remove(i)} className="rounded-xl bg-red-500 px-3 py-1 text-white">Delete</button>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex gap-2 flex-col sm:flex-row">
          <input placeholder="Label (e.g. Facebook)" value={label} onChange={(e) => setLabel(e.target.value)} className="rounded-lg border px-2 py-1 w-full sm:w-auto" />
          <input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} className="rounded-lg border px-2 py-1 w-full sm:w-auto" />
          <button onClick={add} className="rounded-xl bg-emerald-600 px-3 py-1 text-white">Add</button>
        </div>
      </div>
    )
  }

  function TestimonialsManager() {
    const emptyForm = { id: null, name: '', rating: 5, review: '', service: '', enabled: true }
    const [testimonials, setTestimonials] = useState(() => getAllTestimonials())
    const [form, setForm] = useState(emptyForm)
    const [formOpen, setFormOpen] = useState(false)

    const refresh = () => setTestimonials(getAllTestimonials())

    const save = () => {
      if (!form.name.trim() || !form.review.trim()) return
      const payload = {
        name: form.name.trim(),
        rating: Math.max(0, Math.min(5, Number(form.rating) || 0)),
        review: form.review.trim(),
        service: form.service.trim(),
        enabled: form.enabled,
      }
      if (form.id) updateTestimonial(form.id, payload)
      else addTestimonial(payload)
      setForm(emptyForm)
      setFormOpen(false)
      refresh()
      try { window.dispatchEvent(new Event('storage')) } catch {}
    }

    const edit = (testimonial) => {
      setForm({ ...testimonial })
      setFormOpen(true)
    }

    const remove = (id) => {
      if (!window.confirm('Delete this testimonial?')) return
      removeTestimonial(id)
      refresh()
    }

    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">Testimonials</h3>
            <p className="text-sm text-zinc-500">Add, edit, hide, or delete customer reviews shown on the home page.</p>
          </div>
          <button type="button" onClick={() => { setForm(emptyForm); setFormOpen(true) }} className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Add Testimonial</button>
        </div>

        {formOpen ? (
          <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">Customer name
                <input value={form.name} onChange={(e) => setForm((value) => ({ ...value, name: e.target.value }))} className="rounded-lg border border-zinc-300 bg-white px-3 py-2" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">Service
                <input value={form.service} onChange={(e) => setForm((value) => ({ ...value, service: e.target.value }))} className="rounded-lg border border-zinc-300 bg-white px-3 py-2" placeholder="Airport Transfer" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">Rating
                <input type="number" min="0" max="5" value={form.rating} onChange={(e) => setForm((value) => ({ ...value, rating: e.target.value }))} className="rounded-lg border border-zinc-300 bg-white px-3 py-2" />
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 md:mt-7"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm((value) => ({ ...value, enabled: e.target.checked }))} /> Visible on website</label>
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">Review
                <textarea value={form.review} onChange={(e) => setForm((value) => ({ ...value, review: e.target.value }))} className="min-h-24 rounded-lg border border-zinc-300 bg-white px-3 py-2" />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl bg-zinc-200 px-4 py-2 text-sm">Cancel</button>
              <button type="button" onClick={save} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Save Testimonial</button>
            </div>
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          {testimonials.length === 0 ? <p className="text-sm text-zinc-500">No testimonials saved.</p> : testimonials.map((testimonial) => (
            <div key={testimonial.id} className={`rounded-xl border p-4 ${testimonial.enabled === false ? 'border-zinc-200 bg-zinc-100 opacity-70' : 'border-zinc-200 bg-white'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="font-semibold text-zinc-900">{testimonial.name} <span className="text-amber-500">{'*'.repeat(Number(testimonial.rating) || 0)}</span></div>
                  <div className="mt-1 text-xs text-zinc-500">{testimonial.service || 'General service'} {testimonial.enabled === false ? '· Hidden' : ''}</div>
                  <p className="mt-2 text-sm italic text-zinc-700">&quot;{testimonial.review}&quot;</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => edit(testimonial)} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold">Edit</button>
                  <button type="button" onClick={() => { updateTestimonial(testimonial.id, { enabled: testimonial.enabled === false }); refresh() }} className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-semibold">{testimonial.enabled === false ? 'Show' : 'Hide'}</button>
                  <button type="button" onClick={() => remove(testimonial.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function FormsManager() {
    const [vehicles, setVehicles] = useState([])
    const [accessKeys, setAccessKeys] = useState({ contactKeys: [], bookingKeys: [] })
    const [loadingForms, setLoadingForms] = useState(true)
    const [statusMessage, setStatusMessage] = useState(null)
    const [vehicleForm, setVehicleForm] = useState({ id: null, name: '', category: '', rating: 5.0, passengers: 4, hand_carries: 2, bags: 2, price_per_trip: '', image: '', description: '', status: 'available' })
    const [selectedFile, setSelectedFile] = useState(null)
    const [mediaPickerOpenForms, setMediaPickerOpenForms] = useState(false)
    const [mediaPickerImagesForms, setMediaPickerImagesForms] = useState([])
      const [imagesModalOpen, setImagesModalOpen] = useState(false)
      const [modalVehicleImages, setModalVehicleImages] = useState([])
      const [modalVehicleId, setModalVehicleId] = useState(null)
      const [modalLoadingImages, setModalLoadingImages] = useState(false)
    const [vehicleSaving, setVehicleSaving] = useState(false)
    const [vehicleDeleting, setVehicleDeleting] = useState(null)

    const loadForms = async () => {
      setLoadingForms(true)
      try {
        const [settingsResp, vehiclesResp] = await Promise.all([getFormSettings(), getFleet(currentVehicleView)])
        setAccessKeys({
          contactKeys: Array.isArray(settingsResp.accessKeys?.contactKeys) ? settingsResp.accessKeys.contactKeys : [],
          bookingKeys: Array.isArray(settingsResp.accessKeys?.bookingKeys) ? settingsResp.accessKeys.bookingKeys : [],
        })
        setVehicles(vehiclesResp.vehicles || [])
      } catch (error) {
        setStatusMessage({ type: 'error', message: 'Unable to load form settings.' })
      } finally {
        setLoadingForms(false)
      }
    }

    const [currentVehicleView, setCurrentVehicleView] = useState('all')

    useEffect(() => {
      loadForms()
    }, [cmsRefresh, currentVehicleView])

    const saveAccessKeys = async () => {
      setStatusMessage(null)
      setLoadingForms(true)
      try {
        await saveFormSettings(accessKeys)
        setStatusMessage({ type: 'success', message: 'Access keys saved and live forms updated.' })
        setCmsRefresh((value) => value + 1)
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to save access keys.' })
      } finally {
        setLoadingForms(false)
      }
    }

    const resetVehicleForm = () => {
      setVehicleForm({ id: null, name: '', category: '', rating: 5.0, passengers: 4, hand_carries: 2, bags: 2, price_per_trip: '', image: '', description: '', status: 'available' })
      setStatusMessage(null)
    }

    const openMediaPickerForms = async () => {
      try {
        const res = await getMedia()
        setMediaPickerImagesForms(res.media || [])
        setMediaPickerOpenForms(true)
      } catch (err) {
        setMediaPickerImagesForms([])
        setMediaPickerOpenForms(true)
        setStatusMessage({ type: 'error', message: err.message || 'Unable to load media. You can still upload or retry.' })
      }
    }

    const handleFileChange = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      setSelectedFile(file)
    }

    const handleVehicleSave = async () => {
      if (!vehicleForm.name.trim()) {
        setStatusMessage({ type: 'error', message: 'Vehicle name is required.' })
        return
      }

      setVehicleSaving(true)
      try {
        // Validate required fields
        if (!vehicleForm.name.trim()) {
          setStatusMessage({ type: 'error', message: 'Vehicle name is required.' })
          return
        }
        if (!Number.isFinite(Number(vehicleForm.passengers)) || Number(vehicleForm.passengers) <= 0) {
          setStatusMessage({ type: 'error', message: 'Passengers must be a positive number.' })
          return
        }
        if (!Number.isFinite(Number(vehicleForm.rating)) || Number(vehicleForm.rating) < 0 || Number(vehicleForm.rating) > 5) {
          setStatusMessage({ type: 'error', message: 'Rating must be between 0 and 5.' })
          return
        }

        // Prepare payload for JSON create/update
        const payload = {
          id: vehicleForm.id,
          name: vehicleForm.name,
          category: vehicleForm.category,
          rating: Number(vehicleForm.rating),
          passengers: Number(vehicleForm.passengers),
          hand_carries: Number(vehicleForm.hand_carries),
          bags: Number(vehicleForm.bags),
          price_per_trip: vehicleForm.price_per_trip,
          image: vehicleForm.image,
          description: vehicleForm.description,
          status: vehicleForm.status,
        }

        let response
        if (vehicleForm.id) {
          response = await updateFleetVehicle(payload)
        } else {
          response = await createFleetVehicleJson(payload)
        }

        if (selectedFile) {
          try {
            const fd = new FormData()
            fd.append('action', 'upload_image')
            fd.append('vehicle_id', response.vehicle_id || vehicleForm.id)
            fd.append('images[]', selectedFile)
            await uploadFleetImages(response.vehicle_id || vehicleForm.id, fd)
          } catch (uploadError) {
            setStatusMessage({ type: 'error', message: 'Vehicle saved, but image upload failed.' })
            resetVehicleForm()
            setSelectedFile(null)
            setCmsRefresh((value) => value + 1)
            return
          }
        }

        setStatusMessage({ type: 'success', message: vehicleForm.id ? 'Vehicle updated successfully.' : 'Vehicle added successfully.' })
        resetVehicleForm()
        setSelectedFile(null)
        setCmsRefresh((value) => value + 1)
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to save vehicle.' })
      } finally {
        setVehicleSaving(false)
      }
    }

    const handleVehicleDelete = async (id) => {
      if (!window.confirm('Delete this vehicle?')) return
      setVehicleDeleting(id)
      try {
        await trashFleetVehicle(id)
        setVehicles((current) => current.filter((vehicle) => vehicle.id !== id))
        setStatusMessage({ type: 'success', message: 'Vehicle removed successfully.' })
        setCmsRefresh((value) => value + 1)
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to delete vehicle.' })
      } finally {
        setVehicleDeleting(null)
      }
    }

    const handleRestoreVehicle = async (id) => {
      if (!window.confirm('Restore this vehicle?')) return
      try {
        await restoreFleetVehicle(id)
        setVehicles((current) => current.filter((v) => v.id !== id))
        setStatusMessage({ type: 'success', message: 'Vehicle restored.' })
        setCmsRefresh((v) => v + 1)
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Unable to restore vehicle.' })
      }
    }

    const handlePermanentDelete = async (id) => {
      if (!window.confirm('This will permanently delete the vehicle and its images. Proceed?')) return
      try {
        await deleteFleetVehiclePermanently(id)
        setVehicles((current) => current.filter((v) => v.id !== id))
        setStatusMessage({ type: 'success', message: 'Vehicle permanently deleted.' })
        setCmsRefresh((v) => v + 1)
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Unable to delete permanently.' })
      }
    }

    const openImagesModal = async (vehicleId) => {
      setModalLoadingImages(true)
      setImagesModalOpen(true)
      setModalVehicleId(vehicleId)
      try {
        const data = await getFleetVehicle(vehicleId)
        setModalVehicleImages(data.vehicle.images || [])
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Unable to load images.' })
        setModalVehicleImages([])
      } finally {
        setModalLoadingImages(false)
      }
    }

    const refreshModalImages = async () => {
      if (!modalVehicleId) return
      try {
        const data = await getFleetVehicle(modalVehicleId)
        setModalVehicleImages(data.vehicle.images || [])
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Unable to refresh images.' })
      }
    }

    const handleSetPrimary = async (imageId) => {
      if (!Number(modalVehicleId) || !Number(imageId)) {
        setStatusMessage({ type: 'error', message: 'Select a valid vehicle image first.' })
        return
      }
      try {
        await setFleetImagePrimary(modalVehicleId, imageId)
        await refreshModalImages()
        setCmsRefresh((v) => v + 1)
        // if currently editing this vehicle, update the edit form preview
        try {
          if (vehicleForm?.id && Number(vehicleForm.id) === Number(modalVehicleId)) {
            const data = await getFleetVehicle(modalVehicleId)
            const primary = (data.vehicle?.images || []).find((i) => i.is_primary === 1)
            if (primary && primary.file_path) setVehicleForm((cur) => ({ ...cur, image: primary.file_path }))
          }
        } catch (e) {
          // ignore preview update failures
        }
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Unable to set primary image.' })
      }
    }

    const handleDeleteImage = async (imageId) => {
      if (!window.confirm('Delete this image permanently?')) return
      try {
        await deleteFleetImage(imageId)
        await refreshModalImages()
        setCmsRefresh((v) => v + 1)
        // if currently editing this vehicle, clear preview if no primary remains
        try {
          if (vehicleForm?.id && Number(vehicleForm.id) === Number(modalVehicleId)) {
            const data = await getFleetVehicle(modalVehicleId)
            const primary = (data.vehicle?.images || []).find((i) => i.is_primary === 1)
            if (primary && primary.file_path) setVehicleForm((cur) => ({ ...cur, image: primary.file_path }))
            else setVehicleForm((cur) => ({ ...cur, image: '' }))
          }
        } catch (e) {}
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Unable to delete image.' })
      }
    }

    const moveImage = async (index, direction) => {
      const arr = [...modalVehicleImages]
      const to = index + (direction === 'up' ? -1 : 1)
      if (to < 0 || to >= arr.length) return
      const tmp = arr[to]
      arr[to] = arr[index]
      arr[index] = tmp
      setModalVehicleImages(arr)
      // send new order by id
      const order = arr.map((i) => i.id)
      try {
        await reorderFleetImages(modalVehicleId, order)
      } catch (err) {
        setStatusMessage({ type: 'error', message: 'Unable to reorder images.' })
      }
    }

    const handleImageUpload = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      setSelectedFiles([file])
      const reader = new FileReader()
      reader.onload = () => {
        setVehicleForm((current) => ({ ...current, image: reader.result || '' }))
      }
      reader.readAsDataURL(file)
    }

    return (
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold">Web3Forms Access Keys</h3>
              <p className="text-sm text-zinc-500">Forms are powered by Web3Forms (https://web3forms.com/). To change where form emails are sent, create or log in at Web3Forms and paste access keys here.</p>
            </div>
            <a href="https://web3forms.com/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-yellow-600">Open Web3Forms</a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm font-medium text-zinc-700">Contact Access Keys</div>
              {accessKeys.contactKeys.map((key, index) => (
                <div key={`contact-key-${index}`} className="flex items-center gap-2">
                  <input
                    value={key}
                    onChange={(e) => setAccessKeys((current) => ({
                      ...current,
                      contactKeys: current.contactKeys.map((item, i) => (i === index ? e.target.value : item)),
                    }))}
                    className="flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black"
                    placeholder={`Key ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => setAccessKeys((current) => ({
                      ...current,
                      contactKeys: current.contactKeys.filter((_, i) => i !== index),
                    }))}
                    className="rounded-2xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setAccessKeys((current) => ({
                  ...current,
                  contactKeys: [...current.contactKeys, ''],
                }))}
                className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-900"
              >
                Add Contact Key
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm font-medium text-zinc-700">Booking Access Keys</div>
              {accessKeys.bookingKeys.map((key, index) => (
                <div key={`booking-key-${index}`} className="flex items-center gap-2">
                  <input
                    value={key}
                    onChange={(e) => setAccessKeys((current) => ({
                      ...current,
                      bookingKeys: current.bookingKeys.map((item, i) => (i === index ? e.target.value : item)),
                    }))}
                    className="flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black"
                    placeholder={`Key ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => setAccessKeys((current) => ({
                      ...current,
                      bookingKeys: current.bookingKeys.filter((_, i) => i !== index),
                    }))}
                    className="rounded-2xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setAccessKeys((current) => ({
                  ...current,
                  bookingKeys: [...current.bookingKeys, ''],
                }))}
                className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-900"
              >
                Add Booking Key
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-zinc-500">Save changes to update the live contact and booking forms immediately.</div>
            <button type="button" onClick={saveAccessKeys} className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900" disabled={loadingForms}>
              {loadingForms ? 'Saving...' : 'Save Access Keys'}
            </button>
          </div>
        </div>

        {imagesModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-6">
            <div className="absolute inset-0 bg-black/50" onClick={() => setImagesModalOpen(false)} />
            <div className="relative z-10 w-full max-w-4xl rounded-lg bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Manage Images</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setImagesModalOpen(false)} className="rounded-xl bg-zinc-100 px-3 py-1">Close</button>
                </div>
              </div>

              <div className="mt-4">
                {modalLoadingImages ? (
                  <div className="p-6 text-sm text-zinc-500">Loading images…</div>
                ) : modalVehicleImages.length === 0 ? (
                  <div className="p-6 text-sm text-zinc-500">No images for this vehicle.</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {modalVehicleImages.map((img, idx) => (
                      <div key={img.id} className="rounded-lg border p-2">
                        <div className="relative">
                          <img src={`${apiHost}${img.file_path}`} className="h-40 w-full object-cover rounded" />
                          <div className="absolute right-2 top-2 h-3.5 w-3.5 rounded-full ring-1 ring-white" style={{ backgroundColor: img.is_primary ? '#16a34a' : '#ef4444' }} />
                        </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-sm text-zinc-700">{img.file_name}</div>
                            </div>
                        <div className="mt-2 flex gap-2">
                          {!img.is_primary && <button onClick={() => handleSetPrimary(img.id)} className="rounded-2xl bg-emerald-600 px-3 py-1 text-xs text-white">Set Primary</button>}
                          <button onClick={() => handleDeleteImage(img.id)} className="rounded-2xl bg-red-500 px-3 py-1 text-xs text-white">Delete</button>
                          <button onClick={() => moveImage(idx, 'up')} className="rounded-2xl bg-zinc-100 px-3 py-1 text-xs">Up</button>
                          <button onClick={() => moveImage(idx, 'down')} className="rounded-2xl bg-zinc-100 px-3 py-1 text-xs">Down</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {mediaPickerOpenForms ? (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="absolute inset-0" onClick={() => setMediaPickerOpenForms(false)} />
            <div className="relative z-10 w-full max-w-4xl rounded-lg bg-white p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Select Image from Media</h4>
                <button onClick={() => setMediaPickerOpenForms(false)} className="rounded-xl bg-zinc-100 px-3 py-1">Close</button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {mediaPickerImagesForms.map((img) => (
                  <div key={img.id} className="rounded-lg border p-2">
                    <img onClick={async () => {
                      setVehicleForm((cur) => ({ ...cur, image: img.file_path }))
                      setMediaPickerOpenForms(false)
                    }} src={`${apiHost}${img.file_path}`} alt="" className="cursor-pointer h-28 w-full object-cover rounded" />
                    <div className="mt-2 text-xs text-zinc-600">Uses: {img.usage_count || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  function FleetManager() {
    const [vehicles, setVehicles] = useState([])
    const [loadingFleet, setLoadingFleet] = useState(true)
    const [fleetError, setFleetError] = useState(null)
    const [viewMode, setViewMode] = useState('all')
    const [formOpen, setFormOpen] = useState(false)
    const [vehicleForm, setVehicleForm] = useState({ id: null, name: '', category: '', rating: 5.0, passengers: 4, hand_carries: 2, bags: 2, price_per_trip: '', status: 'available', image: '', description: '' })
    const [selectedFiles, setSelectedFiles] = useState([])
    const [selectedMediaImage, setSelectedMediaImage] = useState(null)
    const [formSaving, setFormSaving] = useState(false)
    const [statusMessage, setStatusMessage] = useState(null)
    const [vehicleDeleting, setVehicleDeleting] = useState(null)
    const [imagesModalOpen, setImagesModalOpen] = useState(false)
    const [modalVehicleImages, setModalVehicleImages] = useState([])
    const [modalVehicleId, setModalVehicleId] = useState(null)
    const [modalLoadingImages, setModalLoadingImages] = useState(false)
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
    const [mediaPickerImages, setMediaPickerImages] = useState([])

    const loadFleet = async (status = viewMode) => {
      setLoadingFleet(true)
      setFleetError(null)
      try {
        const res = await getFleet(status)
        setVehicles(res.vehicles || [])
      } catch (error) {
        setFleetError(error.message || 'Unable to load vehicles.')
      } finally {
        setLoadingFleet(false)
      }
    }

    useEffect(() => {
      loadFleet(viewMode)
    }, [viewMode, cmsRefresh])

    const resetVehicleForm = () => {
      setVehicleForm({ id: null, name: '', category: '', rating: 5.0, passengers: 4, hand_carries: 2, bags: 2, price_per_trip: '', status: 'available', image: '', description: '' })
      setSelectedFiles([])
      setSelectedMediaImage(null)
      setStatusMessage(null)
      setFormOpen(true)
    }

    const openMediaPicker = async () => {
      setMediaPickerImages([])
      setMediaPickerOpen(true)
      try {
        const res = await getMedia()
        setMediaPickerImages(res.media || [])
      } catch (err) {
        setStatusMessage({ type: 'error', message: err.message || 'Unable to load media. You can still upload or retry.' })
      }
    }

    const openEditVehicle = (vehicle) => {
      setVehicleForm({
        id: vehicle.id,
        name: vehicle.name || '',
        category: vehicle.category || '',
        rating: vehicle.rating || 5.0,
        passengers: vehicle.passengers || 4,
        hand_carries: vehicle.hand_carries || 2,
        bags: vehicle.bags || 2,
        price_per_trip: vehicle.price_per_trip || '',
        status: vehicle.status || 'available',
        image: vehicle.image || '',
        description: vehicle.description || '',
      })
      setSelectedFiles([])
      setSelectedMediaImage(null)
      setStatusMessage(null)
      setFormOpen(true)
    }

    const saveVehicle = async () => {
      if (!vehicleForm.name.trim()) {
        setStatusMessage({ type: 'error', message: 'Vehicle name is required.' })
        return
      }
      if (!Number.isFinite(Number(vehicleForm.rating)) || Number(vehicleForm.rating) < 0 || Number(vehicleForm.rating) > 5) {
        setStatusMessage({ type: 'error', message: 'Rating must be between 0 and 5.' })
        return
      }
      if (!Number.isFinite(Number(vehicleForm.passengers)) || Number(vehicleForm.passengers) <= 0) {
        setStatusMessage({ type: 'error', message: 'Passengers must be a positive number.' })
        return
      }
      if (!Number.isFinite(Number(vehicleForm.hand_carries)) || Number(vehicleForm.hand_carries) < 0) {
        setStatusMessage({ type: 'error', message: 'Hand carries must be zero or higher.' })
        return
      }
      if (!Number.isFinite(Number(vehicleForm.bags)) || Number(vehicleForm.bags) < 0) {
        setStatusMessage({ type: 'error', message: 'Bags must be zero or higher.' })
        return
      }

      setFormSaving(true)
      try {
        const payload = {
          id: vehicleForm.id,
          name: vehicleForm.name,
          category: vehicleForm.category,
          rating: Number(vehicleForm.rating),
          passengers: Number(vehicleForm.passengers),
          hand_carries: Number(vehicleForm.hand_carries),
          bags: Number(vehicleForm.bags),
          price_per_trip: vehicleForm.price_per_trip,
          status: vehicleForm.status,
          description: vehicleForm.description,
          image: vehicleForm.image,
        }

        let vehicleId = vehicleForm.id
        if (vehicleId) {
          await updateFleetVehicle(payload)
        } else {
          const created = await createFleetVehicleJson(payload)
          vehicleId = created.vehicle_id
        }

        if (selectedFiles.length > 0 && vehicleId) {
          try {
            const fd = new FormData()
            fd.append('action', 'upload_image')
            fd.append('vehicle_id', vehicleId)
            selectedFiles.forEach((file) => fd.append('images[]', file))
            await uploadFleetImages(vehicleId, fd)
          } catch (uploadError) {
            setStatusMessage({ type: 'error', message: 'Vehicle saved, but image upload failed.' })
            setFormOpen(false)
            setSelectedFiles([])
            setCmsRefresh((value) => value + 1)
            setFormSaving(false)
            return
          }
        }

        const selectedMediaId = Number(selectedMediaImage?.id)
        const savedVehicleId = Number(vehicleId)
        if (selectedMediaId > 0 && savedVehicleId > 0) {
          try {
            await setFleetImagePrimary(savedVehicleId, selectedMediaId)
          } catch (usageError) {
            // don't block save if media attach fails
          }
        }

        setStatusMessage({ type: 'success', message: vehicleForm.id ? 'Vehicle updated successfully.' : 'Vehicle added successfully.' })
        notifySiteChange(vehicleForm.id ? 'Fleet vehicle updated' : 'Fleet vehicle added', `Vehicle "${vehicleForm.name}" was ${vehicleForm.id ? 'updated' : 'added'} on the website.`)
        setFormOpen(false)
        setSelectedFiles([])
        setCmsRefresh((value) => value + 1)
        try { window.dispatchEvent(new Event('storage')) } catch {}
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to save vehicle.' })
      } finally {
        setFormSaving(false)
      }
    }

    const handleTrashVehicle = async (id) => {
      if (!window.confirm('Move this vehicle to Trash?')) return
      setVehicleDeleting(id)
      try {
        await trashFleetVehicle(id)
        setCmsRefresh((value) => value + 1)
        try { window.dispatchEvent(new Event('storage')) } catch {}
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to trash vehicle.' })
      } finally {
        setVehicleDeleting(null)
      }
    }

    const handleRestoreVehicle = async (id) => {
      setVehicleDeleting(id)
      try {
        await restoreFleetVehicle(id)
        setCmsRefresh((value) => value + 1)
        try { window.dispatchEvent(new Event('storage')) } catch {}
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to restore vehicle.' })
      } finally {
        setVehicleDeleting(null)
      }
    }

    const handlePermanentDelete = async (id) => {
      if (!window.confirm('Permanently delete this vehicle and its images?')) return
      setVehicleDeleting(id)
      try {
        await deleteFleetVehiclePermanently(id)
        setCmsRefresh((value) => value + 1)
        try { window.dispatchEvent(new Event('storage')) } catch {}
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to delete vehicle permanently.' })
      } finally {
        setVehicleDeleting(null)
      }
    }

    const openImagesModal = async (vehicleId) => {
      setImagesModalOpen(true)
      setModalLoadingImages(true)
      setModalVehicleId(vehicleId)
      try {
        const res = await getFleetVehicle(vehicleId)
        setModalVehicleImages(res.vehicle?.images || [])
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to load vehicle images.' })
        setModalVehicleImages([])
      } finally {
        setModalLoadingImages(false)
      }
    }

    const handleSetPrimary = async (imageId) => {
      if (!Number(modalVehicleId) || !Number(imageId)) {
        setStatusMessage({ type: 'error', message: 'Select a valid vehicle image first.' })
        return
      }
      try {
        await setFleetImagePrimary(modalVehicleId, imageId)
        await openImagesModal(modalVehicleId)
        setCmsRefresh((v) => v + 1)
        // reload fleet list for immediate UI update
        try { await loadFleet(viewMode) } catch {}
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to set primary image.' })
      }
    }

    const handleDeleteImage = async (imageId) => {
      if (!window.confirm('Delete this image permanently?')) return
      try {
        await deleteFleetImage(imageId)
        await openImagesModal(modalVehicleId)
        setCmsRefresh((v) => v + 1)
        try { await loadFleet(viewMode) } catch {}
      } catch (error) {
        setStatusMessage({ type: 'error', message: error.message || 'Unable to delete image.' })
      }
    }

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files || [])
      if (files.length === 0) return
      setSelectedFiles(files)
    }

    return (
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold">Fleet Management</h3>
              <p className="text-sm text-zinc-500">Add, edit, trash, restore, and manage your vehicle inventory.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={resetVehicleForm} className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-900">
                Add Vehicle
              </button>
              <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700">
                <option value="all">All Vehicles</option>
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="trashed">Trash</option>
              </select>
            </div>
          </div>

          {statusMessage ? (
            <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${statusMessage.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {statusMessage.message}
            </div>
          ) : null}

          {fleetError ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{fleetError}</div>
          ) : vehicles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
              <div>No vehicles found for this view.</div>
              <button type="button" onClick={resetVehicleForm} className="mt-4 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-900">
                Add your first vehicle
              </button>
            </div>
          ) : (
            <div className="mt-6 overflow-auto">
              <table className="min-w-full table-auto text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500">
                    <th className="px-3 py-3">Vehicle</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Rating</th>
                    <th className="px-3 py-3">Passengers</th>
                    <th className="px-3 py-3">Luggage</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                      <td className="px-3 py-3 align-top text-zinc-700">
                        <div className="flex items-center gap-3">
                          {vehicle.image ? (
                            <img src={resolveImageUrl(vehicle.image)} alt={vehicle.name} className="h-16 w-24 rounded-xl object-cover" />
                          ) : (
                            <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-zinc-100 text-xs text-zinc-500">No image</div>
                          )}
                          <div>
                            <div className="font-semibold text-zinc-900">{vehicle.name}</div>
                            <div className="text-xs text-zinc-500 mt-1">{vehicle.created_at ? new Date(vehicle.created_at).toLocaleDateString() : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top text-zinc-700">{vehicle.category || '—'}</td>
                      <td className="px-3 py-3 align-top text-zinc-700">{vehicle.rating ?? '—'}</td>
                      <td className="px-3 py-3 align-top text-zinc-700">{vehicle.passengers || 0}</td>
                      <td className="px-3 py-3 align-top text-zinc-700">{vehicle.hand_carries || 0} / {vehicle.bags || 0}</td>
                      <td className="px-3 py-3 align-top text-zinc-700">{vehicle.price_per_trip ? `₦${vehicle.price_per_trip}` : '—'}</td>
                      <td className="px-3 py-3 align-top text-zinc-700 uppercase tracking-[0.08em] text-xs text-zinc-600">{vehicle.status || 'available'}</td>
                      <td className="px-3 py-3 align-top text-zinc-700">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => openEditVehicle(vehicle)} className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white">Edit</button>
                          {viewMode === 'trashed' ? (
                            <>
                              <button type="button" onClick={() => handleRestoreVehicle(vehicle.id)} className="rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Restore</button>
                              <button type="button" onClick={() => handlePermanentDelete(vehicle.id)} className="rounded-2xl bg-red-500 px-3 py-2 text-xs font-semibold text-white">Delete</button>
                            </>
                          ) : (
                            <button type="button" onClick={() => handleTrashVehicle(vehicle.id)} className="rounded-2xl bg-red-500 px-3 py-2 text-xs font-semibold text-white" disabled={vehicleDeleting === vehicle.id}>
                              {vehicleDeleting === vehicle.id ? 'Trashing…' : 'Trash'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {formOpen && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold">{vehicleForm.id ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
                <p className="text-sm text-zinc-500">Enter vehicle details and upload images for the public booking card.</p>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700">Close Form</button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Vehicle Name
                <input value={vehicleForm.name} onChange={(e) => setVehicleForm((current) => ({ ...current, name: e.target.value }))} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Category
                <input value={vehicleForm.category} onChange={(e) => setVehicleForm((current) => ({ ...current, category: e.target.value }))} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" placeholder="Sedan, SUV, Van" />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Rating
                <input type="number" step="0.1" min="0" max="5" value={vehicleForm.rating} onChange={(e) => setVehicleForm((current) => ({ ...current, rating: e.target.value }))} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Passengers
                <input type="number" min="1" value={vehicleForm.passengers} onChange={(e) => setVehicleForm((current) => ({ ...current, passengers: e.target.value }))} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Hand Carries
                <input type="number" min="0" value={vehicleForm.hand_carries} onChange={(e) => setVehicleForm((current) => ({ ...current, hand_carries: e.target.value }))} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700">
                Bags
                <input type="number" min="0" value={vehicleForm.bags} onChange={(e) => setVehicleForm((current) => ({ ...current, bags: e.target.value }))} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
                Price per trip
                <input value={vehicleForm.price_per_trip} onChange={(e) => setVehicleForm((current) => ({ ...current, price_per_trip: e.target.value }))} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" placeholder="e.g. 199.99" />
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
                Status
                <select value={vehicleForm.status} onChange={(e) => setVehicleForm((current) => ({ ...current, status: e.target.value }))} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black">
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="trashed">Trashed</option>
                </select>
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
                Image URL
                <div className="mt-2 flex items-center gap-2">
                  <input value={vehicleForm.image} onChange={(e) => setVehicleForm((current) => ({ ...current, image: e.target.value }))} className="flex-1 mt-0 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" placeholder="Paste a public image URL" />
                  <button type="button" onClick={openMediaPicker} className="rounded-2xl bg-zinc-100 px-3 py-2 text-sm">Choose from Media</button>
                </div>
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
                Upload Images
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-2" />
                {selectedFiles.length > 0 ? <div className="mt-2 text-xs text-zinc-500">Selected {selectedFiles.length} file(s)</div> : null}
              </label>
              <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
                Description
                <textarea value={vehicleForm.description} onChange={(e) => setVehicleForm((current) => ({ ...current, description: e.target.value }))} className="mt-2 min-h-[120px] rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button type="button" onClick={() => { setFormOpen(false); setSelectedFiles([]) }} className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">Cancel</button>
              <button type="button" onClick={saveVehicle} className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-900" disabled={formSaving}>
                {formSaving ? 'Saving…' : vehicleForm.id ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </div>
        )}

        {imagesModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-6">
            <div className="absolute inset-0 bg-black/50" onClick={() => setImagesModalOpen(false)} />
            <div className="relative z-10 w-full max-w-4xl rounded-lg bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Manage Vehicle Images</h3>
                <button onClick={() => setImagesModalOpen(false)} className="rounded-xl bg-zinc-100 px-3 py-1">Close</button>
              </div>
              <div className="mt-4">
                {modalLoadingImages ? (
                  <div className="p-6 text-sm text-zinc-500">Loading images…</div>
                ) : modalVehicleImages.length === 0 ? (
                  <div className="p-6 text-sm text-zinc-500">No images uploaded for this vehicle.</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {modalVehicleImages.map((img) => (
                      <div key={img.id} className="rounded-xl border p-3">
                        <img src={`${apiHost}${img.file_path}`} alt={img.file_name} className="h-40 w-full rounded-xl object-cover" />
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-sm text-zinc-700">{img.is_primary ? 'Primary' : 'Image'}</span>
                          <div className="flex gap-2">
                            {!img.is_primary && <button onClick={() => handleSetPrimary(img.id)} className="rounded-2xl bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Set Primary</button>}
                            <button onClick={() => handleDeleteImage(img.id)} className="rounded-2xl bg-red-500 px-3 py-1 text-xs font-semibold text-white">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {mediaPickerOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="absolute inset-0" onClick={() => setMediaPickerOpen(false)} />
            <div className="relative z-10 max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold">Choose Vehicle Image</h3>
                <button type="button" onClick={() => setMediaPickerOpen(false)} className="rounded-xl bg-zinc-100 px-3 py-1 text-sm">Close</button>
              </div>
              {mediaPickerImages.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500">No media images available.</div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {mediaPickerImages.map((img) => (
                    <button
                      type="button"
                      key={img.id}
                      onClick={() => {
                        setSelectedMediaImage(img)
                        setVehicleForm((current) => ({ ...current, image: img.file_path }))
                        setMediaPickerOpen(false)
                      }}
                      className="overflow-hidden rounded-xl border border-zinc-200 text-left transition hover:border-black"
                    >
                      <img src={`${apiHost}${img.file_path}`} alt={img.file_name || 'Media image'} className="h-28 w-full object-cover" />
                      <span className="block truncate px-2 py-2 text-xs text-zinc-600">{img.file_name || 'Image'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  function MediaManager() {
    const [loading, setLoading] = useState(true)
    const [images, setImages] = useState([])
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [modalImageData, setModalImageData] = useState(null)
    const [vehiclesList, setVehiclesList] = useState([])
    const [selectedVehicle, setSelectedVehicle] = useState('')
    const [files, setFiles] = useState([])
    const [status, setStatus] = useState(null)
  const [hoveredImageUsages, setHoveredImageUsages] = useState(null)
  const [hoveredImageId, setHoveredImageId] = useState(null)
  const [cropOpen, setCropOpen] = useState(false)
  const cropCanvasRef = useRef(null)
  const [cropRect, setCropRect] = useState(null)
  const [cropImg, setCropImg] = useState(null)

    const loadAll = async () => {
      setLoading(true)
      try {
        const [fleetResp, mediaResp] = await Promise.all([getFleet('all'), getMedia()])
        const vehicles = fleetResp.vehicles || []
        setVehiclesList(vehicles)
        const imgs = mediaResp.media || []
        setImages(imgs)
      } catch (error) {
        setStatus({ type: 'error', message: error.message || 'Unable to load media.' })
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => { loadAll() }, [cmsRefresh])

    const handleFileChange = (e) => setFiles(Array.from(e.target.files || []))
    const openMediaPickerForms = async () => {
      try {
        const res = await getMedia()
        setMediaPickerImagesForms(res.media || [])
        setMediaPickerOpenForms(true)
      } catch (err) {
        setMediaPickerImagesForms([])
        setMediaPickerOpenForms(true)
        setStatus({ type: 'error', message: err.message || 'Unable to load media. You can still upload or retry.' })
      }
    }

    const handleUpload = async () => {
      if (files.length === 0) { setStatus({ type: 'error', message: 'Select files to upload.' }); return }
      const fd = new FormData()
      fd.append('action', 'upload_image')
      fd.append('vehicle_id', selectedVehicle || 0)
      files.forEach((f) => fd.append('images[]', f))
      try {
        await uploadFleetImages(selectedVehicle, fd)
        setStatus({ type: 'success', message: 'Images uploaded.' })
        setFiles([])
        setCmsRefresh((v) => v + 1)
        await loadAll()
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Upload failed.' })
      }
    }

    const handleDelete = async (imageId) => {
      if (!confirm('Delete this image permanently?')) return
      try {
        await deleteFleetImage(imageId)
        setCmsRefresh((v) => v + 1)
        await loadAll()
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Delete failed.' })
      }
    }

    const handleSetPrimary = async (vehicleId, imageId) => {
      if (!Number(vehicleId) || !Number(imageId)) {
        setStatus({ type: 'error', message: 'Choose a vehicle before setting a global image as primary.' })
        return
      }
      try {
        await setFleetImagePrimary(vehicleId, imageId)
        setCmsRefresh((v) => v + 1)
        await loadAll()
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Unable to set primary.' })
      }
    }

    // draw crop image into canvas when crop modal is open
    useEffect(() => {
      if (!cropOpen || !cropImg || !cropCanvasRef.current) return
      const canvas = cropCanvasRef.current
      const ctx = canvas.getContext('2d')
      // size canvas to fit container width while keeping aspect
      const maxW = Math.min(900, cropImg.naturalWidth)
      const ratio = cropImg.naturalWidth / cropImg.naturalHeight
      const w = Math.min(maxW, cropImg.naturalWidth)
      const h = Math.round(w / ratio)
      canvas.width = w
      canvas.height = h
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(cropImg, 0, 0, canvas.width, canvas.height)
      // draw selection if exists
      if (cropRect) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.clearRect(cropRect.startX, cropRect.startY, cropRect.w, cropRect.h)
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.strokeRect(cropRect.startX + 0.5, cropRect.startY + 0.5, cropRect.w - 1, cropRect.h - 1)
      }
    }, [cropOpen, cropImg, cropRect])

    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Media Library</h3>
          <div className="flex items-center gap-2">
            <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} className="rounded-xl border px-3 py-2">
              <option value="">Select vehicle</option>
              {vehiclesList.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload} className="rounded-xl bg-black px-4 py-2 text-white">Upload</button>
          </div>
        </div>
        {status ? <div className={`mt-4 rounded p-3 ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{status.message}</div> : null}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {loading ? <div>Loading...</div> : images.length === 0 ? <div className="text-sm text-zinc-500">No media found.</div> : images.map((img) => (
            <div key={img.id} className="rounded-lg border p-2">
              <div ref={notificationsRef} className="relative">
                <img onClick={() => { setModalImageData(img); setImageModalOpen(true) }} src={`${apiHost}${img.file_path}`} alt="" className="cursor-pointer h-28 w-full object-cover rounded" />
                <div
                  onMouseEnter={() => { setHoveredImageUsages(img.usages || []); setHoveredImageId(img.id) }}
                  onMouseLeave={() => { setHoveredImageUsages(null); setHoveredImageId(null) }}
                  className="absolute right-2 top-2 flex items-center"
                >
                  {img.usage_count && img.usage_count > 0 ? (
                    <div className="flex items-center gap-1">
                      {(() => {
                        const maxDots = 5
                        const count = Math.min(img.usage_count, maxDots)
                        const dots = []
                        for (let d = 0; d < count; d++) {
                          dots.push(<span key={d} className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-white" />)
                        }
                        if (img.usage_count > maxDots) {
                          dots.push(<span key="more" className="ml-1 text-xs text-white bg-emerald-600 rounded px-1">+{img.usage_count - maxDots}</span>)
                        }
                        return dots
                      })()}
                    </div>
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full bg-zinc-300 ring-1 ring-white" />
                  )}
                </div>
                {hoveredImageId === img.id && hoveredImageUsages && hoveredImageUsages.length > 0 ? (
                  <div className="absolute right-8 top-0 z-20 w-48 rounded-md bg-white p-2 text-xs shadow">
                    <div className="font-semibold mb-1">Usages</div>
                    {hoveredImageUsages.map((u, i) => (
                      <div key={i} className="truncate">{u.reference_name || (u.location === 'vehicle' ? `Vehicle #${u.reference_id}` : u.location)}</div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="mt-2 text-xs text-zinc-600">{img.vehicle_name}</div>
              <div className="mt-2 flex gap-2">
                {!img.is_primary && <button onClick={() => handleSetPrimary(selectedVehicle || img.vehicle_id, img.id)} className="rounded-2xl bg-emerald-600 px-3 py-1 text-xs text-white">Set Primary</button>}
                <button onClick={() => handleDelete(img.id)} className="rounded-2xl bg-red-500 px-3 py-1 text-xs text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {imageModalOpen && modalImageData ? (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="absolute inset-0" onClick={() => setImageModalOpen(false)} />
            <div className="relative z-10 w-full max-w-3xl rounded-lg bg-white p-6">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-semibold">Image Details</h4>
                <button onClick={() => setImageModalOpen(false)} className="rounded-xl bg-zinc-100 px-3 py-1">Close</button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <img src={`${apiHost}${modalImageData.file_path}`} alt="" className="h-64 w-full object-contain rounded" />
                  <div className="mt-3 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2">
                        <span className="text-sm">Replace</span>
                        <input type="file" accept="image/*" onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          const fd = new FormData();
                          fd.append('action', 'replace_image');
                          fd.append('image_id', modalImageData.id);
                          fd.append('images[]', f);
                          try {
                            await replaceFleetImage(modalImageData.id, fd)
                            setStatus({ type: 'success', message: 'Image replaced.' })
                            setCmsRefresh((v) => v + 1)
                            await loadAll()
                          } catch (err) { setStatus({ type: 'error', message: err.message || 'Replace failed.' }) }
                        }} />
                      </label>
                      <button onClick={() => {
                        // open crop modal for current image
                        try {
                          const img = new Image()
                          img.crossOrigin = 'anonymous'
                          img.onload = () => {
                            setCropImg(img)
                            setCropOpen(true)
                          }
                          img.src = `${apiHost}${modalImageData.file_path}`
                        } catch (e) {}
                      }} className="rounded-2xl bg-zinc-100 px-3 py-1 text-sm">Crop & Replace</button>
                    </div>
                    <div className="text-xs text-zinc-600">Usages: {modalImageData.usage_count || 0}</div>
                    {Array.isArray(modalImageData.usages) && modalImageData.usages.length > 0 ? (
                      <div className="text-xs mt-1">
                        {modalImageData.usages.map((u, i) => (
                          <div key={i} className="truncate">{u.location}{u.reference_id ? ` #${u.reference_id}` : ''}</div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-700">ID: {modalImageData.id}</div>
                  <div className="mt-2 text-sm">URL</div>
                  <div className="mt-1 flex items-center gap-2">
                    <input readOnly value={`${apiHost}${modalImageData.file_path}`} className="flex-1 rounded-md border px-2 py-1 text-xs" />
                    <button onClick={() => { navigator.clipboard?.writeText(`${apiHost}${modalImageData.file_path}`); setStatus({ type: 'success', message: 'URL copied.' }) }} className="rounded-2xl bg-zinc-100 px-3 py-1">Copy</button>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm">File name</label>
                    <input value={modalImageData.file_name || ''} onChange={(e) => setModalImageData((m) => ({ ...m, file_name: e.target.value }))} className="w-full rounded-md border px-2 py-1" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm">Meta title</label>
                    <input value={modalImageData.meta_title || ''} onChange={(e) => setModalImageData((m) => ({ ...m, meta_title: e.target.value }))} className="w-full rounded-md border px-2 py-1" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm">Meta description</label>
                    <textarea value={modalImageData.meta_description || ''} onChange={(e) => setModalImageData((m) => ({ ...m, meta_description: e.target.value }))} className="w-full rounded-md border px-2 py-1" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={async () => {
                      try {
                        await updateFleetImageMeta({ image_id: modalImageData.id, file_name: modalImageData.file_name, meta_title: modalImageData.meta_title, meta_description: modalImageData.meta_description })
                        setStatus({ type: 'success', message: 'Metadata saved.' })
                        setCmsRefresh((v) => v + 1)
                        await loadAll()
                        setImageModalOpen(false)
                      } catch (err) { setStatus({ type: 'error', message: err.message || 'Save failed.' }) }
                    }} className="rounded-2xl bg-emerald-600 px-4 py-2 text-white">Save</button>
                    <button onClick={() => setImageModalOpen(false)} className="rounded-2xl border px-4 py-2">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {cropOpen && cropImg ? (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
            <div className="absolute inset-0" onClick={() => setCropOpen(false)} />
            <div className="relative z-10 w-full max-w-3xl rounded-lg bg-white p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Crop Image</h4>
                <button onClick={() => setCropOpen(false)} className="rounded-xl bg-zinc-100 px-3 py-1">Close</button>
              </div>
              <div className="mt-3">
                <canvas ref={cropCanvasRef} className="w-full border" style={{ maxHeight: 480 }} onMouseDown={(e) => {
                  const rect = cropCanvasRef.current.getBoundingClientRect()
                  const startX = e.clientX - rect.left
                  const startY = e.clientY - rect.top
                  setCropRect({ startX, startY, w: 0, h: 0, dragging: true })
                }} onMouseMove={(e) => {
                  if (!cropRect || !cropRect.dragging) return
                  const rect = cropCanvasRef.current.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  setCropRect((c) => ({ ...c, w: Math.max(1, x - c.startX), h: Math.max(1, y - c.startY) }))
                }} onMouseUp={async (e) => {
                  setCropRect((c) => c ? ({ ...c, dragging: false }) : null)
                }} />
                <div className="mt-3 flex gap-2">
                  <button onClick={async () => {
                    // apply crop
                    try {
                      const canvas = cropCanvasRef.current
                      const rect = cropRect
                      if (!canvas || !rect) return
                      const scaleX = cropImg.naturalWidth / canvas.width
                      const scaleY = cropImg.naturalHeight / canvas.height
                      const sx = Math.max(0, Math.round(rect.startX * scaleX))
                      const sy = Math.max(0, Math.round(rect.startY * scaleY))
                      const sw = Math.max(1, Math.round(rect.w * scaleX))
                      const sh = Math.max(1, Math.round(rect.h * scaleY))
                      const out = document.createElement('canvas')
                      out.width = sw; out.height = sh
                      const ctx = out.getContext('2d')
                      ctx.drawImage(cropImg, sx, sy, sw, sh, 0, 0, sw, sh)
                      out.toBlob(async (blob) => {
                        if (!blob) return
                        const fd = new FormData()
                        fd.append('action', 'replace_image')
                        fd.append('image_id', modalImageData.id)
                        fd.append('images[]', blob, modalImageData.file_name || 'crop.jpg')
                        try {
                          await replaceFleetImage(modalImageData.id, fd)
                          setStatus({ type: 'success', message: 'Image cropped and replaced.' })
                          setCmsRefresh((v) => v + 1)
                          await loadAll()
                          setCropOpen(false)
                          setImageModalOpen(false)
                        } catch (err) { setStatus({ type: 'error', message: err.message || 'Crop replace failed.' }) }
                      }, 'image/jpeg')
                    } catch (err) { setStatus({ type: 'error', message: err.message || 'Crop failed.' }) }
                  }} className="rounded-2xl bg-emerald-600 px-4 py-2 text-white">Apply Crop & Replace</button>
                  <button onClick={() => { setCropRect(null) }} className="rounded-2xl border px-4 py-2">Reset</button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  function BookingsManager() {
    const [bookings, setBookings] = useState([])
    const [loadingBookings, setLoadingBookings] = useState(true)
    const [bookingError, setBookingError] = useState(null)
    const [viewMode, setViewMode] = useState('active')
    const [actionLoading, setActionLoading] = useState(null)

    const loadBookings = async (status = 'active') => {
      setLoadingBookings(true)
      setBookingError(null)
      try {
        const data = await getBookings(status)
        setBookings(data.bookings || [])
      } catch (error) {
        setBookingError(error.message || 'Unable to load bookings.')
      } finally {
        setLoadingBookings(false)
      }
    }

    useEffect(() => {
      loadBookings(viewMode)
    }, [cmsRefresh, viewMode])

    useEffect(() => {
      const params = new URLSearchParams(location.search)
      const highlight = params.get('highlight')
      if (!highlight) return
      // wait for bookings to be loaded and DOM to render
      setTimeout(() => {
        const el = document.getElementById(`booking-${highlight}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.add('ring-2', 'ring-amber-300')
          setTimeout(() => { el.classList.remove('ring-2', 'ring-amber-300') }, 4000)
        }
      }, 300)
    }, [cmsRefresh, location.search])

    const sortedBookings = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const formatDate = (value) => {
      if (!value) return '-'
      const date = new Date(value)
      return date.toLocaleString()
    }

    const runBookingAction = async (id, action) => {
      setActionLoading(`${id}-${action}`)
      try {
        if (action === 'delete') {
          await deleteBookingPermanently(id)
        } else {
          await updateBookingStatus(id, action)
        }
        await loadBookings(viewMode)
      } catch (error) {
        setBookingError(error.message || 'Unable to update booking.')
      } finally {
        setActionLoading(null)
      }
    }

    const actionButtons = (booking) => {
      if (viewMode === 'trashed') {
        return (
          <div className="flex flex-wrap gap-2">
            <button type="button" title="Restore booking" aria-label="Restore booking" onClick={() => runBookingAction(booking.id, 'restore')} disabled={actionLoading === `${booking.id}-restore`} className="rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-60">
              <FiRotateCcw size={17} />
            </button>
            <button type="button" title="Delete booking permanently" aria-label="Delete booking permanently" onClick={() => runBookingAction(booking.id, 'delete')} disabled={actionLoading === `${booking.id}-delete`} className="rounded-xl bg-red-500 p-2.5 text-white hover:bg-red-600 disabled:opacity-60">
              <FiTrash2 size={17} />
            </button>
          </div>
        )
      }

      return (
        <div className="flex flex-wrap gap-2">
          {booking.status !== 'approved' && (
            <button type="button" title="Approve booking" aria-label="Approve booking" onClick={() => runBookingAction(booking.id, 'approve')} disabled={actionLoading === `${booking.id}-approve`} className="rounded-xl bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-60">
              <FiCheck size={17} />
            </button>
          )}
          {booking.status !== 'cancelled' && (
            <button type="button" title="Cancel booking" aria-label="Cancel booking" onClick={() => runBookingAction(booking.id, 'cancel')} disabled={actionLoading === `${booking.id}-cancel`} className="rounded-xl bg-orange-500 p-2.5 text-white hover:bg-orange-600 disabled:opacity-60">
              <FiXCircle size={17} />
            </button>
          )}
          <button type="button" title="Move booking to trash" aria-label="Move booking to trash" onClick={() => runBookingAction(booking.id, 'trash')} disabled={actionLoading === `${booking.id}-trash`} className="rounded-xl bg-zinc-700 p-2.5 text-white hover:bg-zinc-900 disabled:opacity-60">
            <FiTrash2 size={17} />
          </button>
        </div>
      )
    }

    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold">Bookings</h3>
            <p className="text-sm text-zinc-500">Manage booking submissions: approve, cancel, trash, restore, or delete permanently.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" title="Show active bookings" aria-label="Show active bookings" onClick={() => setViewMode('active')} className={`rounded-xl p-2.5 ${viewMode === 'active' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}>
              <FiCheckCircle size={18} />
            </button>
            <button type="button" title="Show trashed bookings" aria-label="Show trashed bookings" onClick={() => setViewMode('trashed')} className={`rounded-xl p-2.5 ${viewMode === 'trashed' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}>
              <FiTrash2 size={18} />
            </button>
            <button type="button" title="Refresh bookings" aria-label="Refresh bookings" onClick={() => loadBookings(viewMode)} className="rounded-xl bg-black p-2.5 text-white transition hover:bg-zinc-900">
              <FiRefreshCw size={18} />
            </button>
          </div>
        </div>

        {loadingBookings ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">Loading bookings…</div>
        ) : bookingError ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{bookingError}</div>
        ) : sortedBookings.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">No bookings found.</div>
        ) : (
          <div className="mt-6 overflow-auto">
            <table className="min-w-full table-auto text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500">
                  <th className="px-3 py-3">Pickup</th>
                  <th className="px-3 py-3">Drop-off</th>
                  <th className="px-3 py-3">Passengers</th>
                  <th className="px-3 py-3">Luggage</th>
                  <th className="px-3 py-3">Date & Time</th>
                  <th className="px-3 py-3">Vehicle</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Submitted</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => (
                  <tr id={`booking-${booking.id}`} key={booking.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                    <td className="px-3 py-3 align-top text-zinc-700">{booking.pickup_location}</td>
                    <td className="px-3 py-3 align-top text-zinc-700">{booking.dropoff_location}</td>
                    <td className="px-3 py-3 align-top text-zinc-700">{booking.passengers}</td>
                    <td className="px-3 py-3 align-top text-zinc-700">{booking.luggage}</td>
                    <td className="px-3 py-3 align-top text-zinc-700">{formatDate(booking.datetime)}</td>
                    <td className="px-3 py-3 align-top text-zinc-700">{booking.vehicle_name || 'Unknown'}</td>
                    <td className="px-3 py-3 align-top text-zinc-700">{booking.customer_name || '-'}</td>
                    <td className="px-3 py-3 align-top text-zinc-700 uppercase tracking-[0.08em] text-sm text-zinc-600">{booking.status || 'pending'}</td>
                    <td className="px-3 py-3 align-top text-zinc-700">{formatDate(booking.created_at)}</td>
                    <td className="px-3 py-3 align-top text-zinc-700">{actionButtons(booking)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }


  function PageEditor() {
    const [metaTitle, setMetaTitle] = useState(editorPage?.title || '')
    const [metaDesc, setMetaDesc] = useState(editorPage?.meta?.description || '')
    const [slug, setSlug] = useState(editorPage?.slug || editorPage?.to?.split('/').pop() || '')
    const [excerpt, setExcerpt] = useState(editorPage?.excerpt || '')
    const [publishedAt, setPublishedAt] = useState(editorPage?.publishedAt || editorPage?.published_at || new Date().toISOString().slice(0, 10))
    const [status, setStatus] = useState(editorPage?.status || 'published')
    const [featuredImage, setFeaturedImage] = useState(editorPage?.featured_image || '')
    const [editorHtml, setEditorHtml] = useState(editorPage?.content || '')
    const [htmlView, setHtmlView] = useState(false)
    const [buttonDialogOpen, setButtonDialogOpen] = useState(false)
    const [buttonText, setButtonText] = useState('Call To Action')
    const [buttonUrl, setButtonUrl] = useState('#')
    const [buttonVariant, setButtonVariant] = useState('primary')
    const [buttonAlign, setButtonAlign] = useState('left')
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [linkText, setLinkText] = useState('')
    const [linkTarget, setLinkTarget] = useState('_blank')
    const [linkNofollow, setLinkNofollow] = useState(false)
    const [mediaPickerOpenPage, setMediaPickerOpenPage] = useState(false)
    const [mediaPickerImagesPage, setMediaPickerImagesPage] = useState([])
    const [mediaPickerMode, setMediaPickerMode] = useState('insert')
    const [floatingToolbar, setFloatingToolbar] = useState(null)
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [imageWidth, setImageWidth] = useState('100%')
    const [imageBorder, setImageBorder] = useState('none')
    const [breadcrumbs, setBreadcrumbs] = useState(editorPage?.meta?.breadcrumbs || '')
    const [aboutText, setAboutText] = useState(editorPage?.meta?.about || editorPage?.content || '')
    const [servicesList, setServicesList] = useState(Array.isArray(editorPage?.meta?.services) && editorPage.meta.services.length ? editorPage.meta.services : [''])
    const [gallery, setGallery] = useState(editorPage?.meta?.gallery || [])
    const [layout, setLayout] = useState(editorPage?.meta?.layout || 'default')
    const featuredFileInputRef = useRef(null)
    const contentFileInputRef = useRef(null)
    const editorSelectionRef = useRef(null)

    useEffect(() => {
      setMetaTitle(editorPage?.title || '')
      setMetaDesc(editorPage?.meta?.description || '')
      setSlug(editorPage?.slug || editorPage?.to?.split('/').pop() || '')
      setExcerpt(editorPage?.excerpt || '')
      setPublishedAt(editorPage?.publishedAt || editorPage?.published_at || new Date().toISOString().slice(0, 10))
      setStatus(editorPage?.status || 'published')
      setFeaturedImage(editorPage?.featured_image || '')
      setEditorHtml(editorPage?.content || '')
      setBreadcrumbs(editorPage?.meta?.breadcrumbs || '')
      setAboutText(editorPage?.meta?.about || editorPage?.content || '')
      setServicesList(Array.isArray(editorPage?.meta?.services) && editorPage.meta.services.length ? editorPage.meta.services : [''])
      setGallery(editorPage?.meta?.gallery || [])
      setLayout(editorPage?.meta?.layout || 'default')
      setHtmlView(false)
      setButtonDialogOpen(false)
      setButtonText('Call To Action')
      setButtonUrl('#')
      setButtonVariant('primary')
      setButtonAlign('left')
      setLinkDialogOpen(false)
      setLinkUrl('')
      setLinkText('')
      setLinkTarget('_blank')
      setLinkNofollow(false)
      setMediaPickerMode('insert')
      setFloatingToolbar(null)
      setImageDialogOpen(false)
      setImageUrl('')
      setImageWidth('100%')
      setImageBorder('none')
    }, [editorPage])

    useEffect(() => {
      const updateFloatingToolbar = () => {
        const selection = window.getSelection()
        const editor = document.getElementById('cms-editor')
        if (!selection?.rangeCount || !editor || selection.isCollapsed || !selection.toString().trim()) {
          setFloatingToolbar(null)
          return
        }

        const range = selection.getRangeAt(0)
        if (!editor.contains(range.commonAncestorContainer)) {
          setFloatingToolbar(null)
          return
        }

        const rect = range.getBoundingClientRect()
        const toolbarHeight = 48
        const toolbarTop = rect.top >= toolbarHeight + 8 ? rect.top - toolbarHeight - 4 : rect.bottom + 8
        setFloatingToolbar({
          top: Math.min(Math.max(8, toolbarTop), window.innerHeight - toolbarHeight - 8),
          left: Math.min(Math.max(8, rect.left), window.innerWidth - 300),
        })
        editorSelectionRef.current = range.cloneRange()
      }

      document.addEventListener('selectionchange', updateFloatingToolbar)
      return () => document.removeEventListener('selectionchange', updateFloatingToolbar)
    }, [editorPage])

    const openMediaPickerPage = async (mode = 'insert') => {
      try {
        const res = await getMedia()
        setMediaPickerImagesPage(res.media || [])
        setMediaPickerMode(mode)
        setMediaPickerOpenPage(true)
      } catch (err) {
        setMediaPickerImagesPage([])
        setMediaPickerMode(mode)
        setMediaPickerOpenPage(true)
      }
    }

    const sanitizeHtml = (raw) => raw.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    const isCreateMode = location.pathname.includes('/create')
    const sectionLabel = editorType === 'privacy' ? 'Privacy page' : editorType === 'terms' ? 'Terms page' : editorType === 'areas-we-cover' ? 'Service area' : 'Blog post'

    const saveEditorSelection = () => {
      const selection = window.getSelection()
      if (selection?.rangeCount) editorSelectionRef.current = selection.getRangeAt(0).cloneRange()
    }

    const restoreEditorSelection = () => {
      const editor = document.getElementById('cms-editor')
      const range = editorSelectionRef.current
      if (!editor || !range) return false
      editor.focus()
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      return true
    }

    const addServiceItem = () => setServicesList((current) => [...current, ''])
    const updateServiceItem = (index, value) => setServicesList((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))
    const removeServiceItem = (index) => setServicesList((current) => current.filter((_, itemIndex) => itemIndex !== index))

    const handleFeaturedImageUpload = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setFeaturedImage(String(reader.result))
      reader.readAsDataURL(file)
      event.target.value = ''
    }

    const handleContentImageUpload = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        restoreEditorSelection()
        document.execCommand('insertImage', false, String(reader.result))
        setEditorHtml(document.getElementById('cms-editor')?.innerHTML || editorHtml)
      }
      reader.readAsDataURL(file)
      event.target.value = ''
    }

    const openContentImagePicker = () => {
      saveEditorSelection()
      contentFileInputRef.current?.click()
    }

    const openImageDialog = () => {
      saveEditorSelection()
      setImageDialogOpen(true)
    }

    const insertConfiguredImage = () => {
      if (!imageUrl.trim()) return
      restoreEditorSelection()
      const image = `<img src="${imageUrl.trim()}" alt="" style="display:block;width:${imageWidth};height:auto;border:${imageBorder};" />`
      document.execCommand('insertHTML', false, image)
      setEditorHtml(document.getElementById('cms-editor')?.innerHTML || editorHtml)
      setImageDialogOpen(false)
      setImageUrl('')
    }

    const renderImageDialog = () => imageDialogOpen ? (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/40" onClick={() => setImageDialogOpen(false)} />
        <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
          <h4 className="text-lg font-semibold text-zinc-900">Add image</h4>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-zinc-700">
              Image URL
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste an image URL" className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none" />
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Image size
              <select value={imageWidth} onChange={(e) => setImageWidth(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none">
                <option value="25%">Small (25%)</option>
                <option value="50%">Medium (50%)</option>
                <option value="75%">Large (75%)</option>
                <option value="100%">Full width</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-zinc-700">
              Image border
              <select value={imageBorder} onChange={(e) => setImageBorder(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none">
                <option value="none">No border</option>
                <option value="1px solid #d4d4d8">Thin border</option>
                <option value="2px solid #18181b">Strong border</option>
                <option value="1px solid #d4af37;border-radius:12px">Border with rounded corners</option>
              </select>
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => setImageDialogOpen(false)} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">Cancel</button>
            <button type="button" onClick={insertConfiguredImage} className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-black">Insert image</button>
          </div>
        </div>
      </div>
    ) : null

    const handleGalleryUpload = async (event) => {
      const files = Array.from(event.target.files || [])
      if (!files.length) return

      try {
        const results = await Promise.all(
          files.map(
            (file) => new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(String(reader.result))
              reader.onerror = () => reject(new Error('Unable to read image file.'))
              reader.readAsDataURL(file)
            })
          )
        )

        setGallery((current) => [...(current || []), ...results])
      } catch (_) {
        setGallery((current) => current || [])
      } finally {
        event.target.value = ''
      }
    }

    const saveContent = () => {
      const currentEditorHtml = document.getElementById('cms-editor')?.innerHTML || editorHtml
      const content = sanitizeHtml(currentEditorHtml)
      const autoSlug = slug || metaTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `area-${Date.now()}`
      const data = {
        title: metaTitle,
        slug: autoSlug,
        excerpt,
        publishedAt,
        status,
        featured_image: featuredImage,
        meta: { description: metaDesc },
        content,
      }
      if (editorType === 'privacy') {
        if (isCreateMode) {
          addPrivacyPage({ ...data })
        } else {
          updatePrivacyPage(editorPage.slug, { ...data })
        }
      }

      if (editorType === 'terms') {
        if (isCreateMode) {
          addTermsPage({ ...data })
        } else {
          updateTermsPage(editorPage.slug, { ...data })
        }
      }

      if (editorType === 'areas-we-cover') {
        const services = servicesList.map((service) => service.trim()).filter(Boolean)
        const currentAreaHtml = document.getElementById('cms-editor')?.innerHTML || aboutText || editorHtml
        const areaContent = sanitizeHtml(currentAreaHtml)
        const areaMeta = { ...(data.meta || {}), breadcrumbs, services, gallery, about: areaContent, layout }
        if (isCreateMode) {
          addArea({ ...data, meta: areaMeta, content: areaContent, label: metaTitle, to: `/areas-we-cover/${autoSlug}` })
        } else {
          updateArea(editorPage.slug || editorPage.to.split('/').pop(), { ...data, meta: areaMeta, content: areaContent, label: metaTitle, to: `/areas-we-cover/${autoSlug}` })
        }
      }

      if (editorType === 'blogs') {
        if (isCreateMode) {
          addBlogPost({ ...data, to: `/blogs/${slug}` })
        } else {
          updateBlogPost(editorPage.slug, { ...data })
        }
      }
      notifySiteChange('Website content updated', `${isCreateMode ? 'Created' : 'Updated'} ${sectionLabel} "${metaTitle}".`)
      setEditorPage(null)
      try { window.dispatchEvent(new Event('storage')) } catch {}
      setCmsRefresh((v) => v + 1)
      // navigate back to the appropriate list view
      if (editorType === 'areas-we-cover') navigate('/admin/areas')
      else if (editorType === 'blogs') navigate('/admin/blogs')
      else navigate(`/admin/${editorType}`)
    }

    const applyCommand = (command, value = null) => {
      restoreEditorSelection()
      document.execCommand(command, false, value)
      setEditorHtml(document.getElementById('cms-editor')?.innerHTML || editorHtml)
    }

    const insertImage = (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        restoreEditorSelection()
        document.execCommand('insertImage', false, reader.result)
        setEditorHtml(document.getElementById('cms-editor')?.innerHTML || editorHtml)
      }
      reader.readAsDataURL(file)
    }

    const openLinkDialog = () => {
      saveEditorSelection()
      setLinkText(window.getSelection()?.toString() || '')
      setLinkUrl('')
      setLinkTarget('_blank')
      setLinkNofollow(false)
      setLinkDialogOpen(true)
    }

    const insertLink = () => {
      if (!linkUrl) return
      const hasSelection = restoreEditorSelection()
      if (hasSelection && window.getSelection()?.toString()) {
        document.execCommand('createLink', false, linkUrl)
      } else if (linkText.trim()) {
        const anchor = document.createElement('a')
        anchor.href = linkUrl
        anchor.textContent = linkText.trim()
        anchor.target = linkTarget
        anchor.rel = linkNofollow ? 'nofollow' : ''
        document.execCommand('insertHTML', false, anchor.outerHTML)
      }
      const anchor = window.getSelection()?.anchorNode?.parentElement
      if (anchor?.tagName === 'A') {
        anchor.setAttribute('target', linkTarget)
        anchor.setAttribute('rel', linkNofollow ? 'nofollow' : '')
      }
      setLinkDialogOpen(false)
      setEditorHtml(document.getElementById('cms-editor')?.innerHTML || editorHtml)
    }

    const openButtonDialog = () => setButtonDialogOpen(true)

    const insertButton = () => {
      const style = buttonVariant === 'primary'
        ? 'background:#111827;color:#fff;border:none;'
        : buttonVariant === 'secondary'
          ? 'background:#f8fafc;color:#111827;border:1px solid #d3d8dd;'
          : 'background:transparent;color:#111827;border:1px solid currentColor;'
      const html = `<div style="text-align:${buttonAlign};margin:1rem 0;"><a href="${buttonUrl}" style="display:inline-block;padding:0.75rem 1.25rem;${style}border-radius:999px;text-decoration:none;">${buttonText}</a></div>`
      document.execCommand('insertHTML', false, html)
      setButtonDialogOpen(false)
      setEditorHtml(document.getElementById('cms-editor')?.innerHTML || editorHtml)
    }

    if (!editorPage) return null

    if (editorType === 'areas-we-cover') {
      return (
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Service area</p>
              <h3 className="mt-1 text-2xl font-bold text-zinc-900">{isCreateMode ? 'Create Area' : 'Edit Area'}</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">Build your public area page from the fields below. The title and excerpt appear in the hero, while the page content controls the sections underneath.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2" onMouseDown={saveEditorSelection}>
              {!isCreateMode && (editorPage.to || editorPage.slug) ? <button type="button" onClick={() => window.open(editorPage.to || `/areas-we-cover/${editorPage.slug}`, '_blank', 'noopener,noreferrer')} className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:bg-zinc-50">Preview live page</button> : null}
              <button onClick={() => navigate('/admin/areas')} className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">Cancel</button>
              <button onClick={saveContent} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">{isCreateMode ? 'Create Area' : 'Save Area'}</button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_360px]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                <label className="block text-sm font-medium text-zinc-700">
                  <span className="flex items-center gap-2">
                    Public Page Title <span className="text-rose-500">*</span>
                  </span>
                  <input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="e.g. Reading Airport Transfers"
                    className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500"
                  />
                  <span className="mt-2 block text-xs leading-5 text-zinc-500">This becomes the main heading at the top of the public page and the page title shown in Admin.</span>
                </label>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                <label className="block text-sm font-medium text-zinc-700">
                  Hero Introduction
                  <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Write the short introduction shown below the hero heading." className="mt-2 min-h-24 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500" />
                  <span className="mt-2 block text-xs leading-5 text-zinc-500">Keep this short. It appears directly below the title on the public page.</span>
                </label>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                <p className="text-sm font-semibold text-zinc-900">Quick guide</p>
                <div className="mt-3 grid gap-3 text-xs leading-5 text-zinc-600 sm:grid-cols-3">
                  <p><strong className="text-zinc-900">Title:</strong> public hero heading</p>
                  <p><strong className="text-zinc-900">Excerpt:</strong> hero introduction</p>
                  <p><strong className="text-zinc-900">Content:</strong> all page sections</p>
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-zinc-700">
                    Breadcrumbs
                  </label>
                  <span className="text-xs text-zinc-500">Visible on the public page</span>
                </div>
                <input
                  value={breadcrumbs}
                  onChange={(e) => setBreadcrumbs(e.target.value)}
                  placeholder="Home > Airport Transfers > Reading"
                  className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500"
                />
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                <label className="block text-sm font-medium text-zinc-700">
                  <span className="flex items-center gap-2">
                    Page Content <span className="text-rose-500">*</span>
                  </span>
                </label>
                <p className="mt-2 text-xs leading-5 text-zinc-500">Use H2 for main sections, H3 for subsections, and lists for services, areas, or booking steps. The public template styles them automatically.</p>
                <div className="mt-3 flex flex-wrap items-center gap-2" onMouseDown={saveEditorSelection}>
                  <button type="button" onClick={() => applyCommand('bold')} className="rounded-xl bg-white px-3 py-2 text-sm">Bold</button>
                  <button type="button" onClick={() => applyCommand('italic')} className="rounded-xl bg-white px-3 py-2 text-sm">Italic</button>
                  <button type="button" onClick={() => applyCommand('underline')} className="rounded-xl bg-white px-3 py-2 text-sm">Underline</button>
                  <button type="button" onClick={() => applyCommand('formatBlock', '<H2>')} className="rounded-xl bg-white px-3 py-2 text-sm">H2</button>
                  <button type="button" onClick={() => applyCommand('formatBlock', '<H3>')} className="rounded-xl bg-white px-3 py-2 text-sm">H3</button>
                  <button type="button" onClick={() => applyCommand('insertUnorderedList')} className="rounded-xl bg-white px-3 py-2 text-sm">Bullet</button>
                  <button type="button" onClick={openLinkDialog} className="rounded-xl bg-white px-3 py-2 text-sm">Add link</button>
                  <button type="button" onClick={openImageDialog} className="rounded-xl bg-white px-3 py-2 text-sm">Add image</button>
                  <button type="button" onClick={openContentImagePicker} className="rounded-xl bg-white px-3 py-2 text-sm">Upload image</button>
                </div>
                <div
                  id="cms-editor"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => { setAboutText(e.currentTarget.innerHTML); setEditorHtml(e.currentTarget.innerHTML) }}
                  className="cms-content mt-3 min-h-[220px] w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none focus:border-zinc-500"
                  dangerouslySetInnerHTML={{ __html: aboutText || '<p>Write a short description of the area, landmarks, and service coverage.</p>' }}
                />
                <input ref={contentFileInputRef} type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" />
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-zinc-900">Services</h4>
                  <button type="button" onClick={addServiceItem} className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-zinc-700">Add Service</button>
                </div>
                <div className="mt-3 space-y-3">
                  {servicesList.map((service, index) => (
                    <div key={`service-${index}`} className="flex items-center gap-2">
                      <input
                        value={service}
                        onChange={(e) => updateServiceItem(index, e.target.value)}
                        placeholder="e.g. Airport transfers"
                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500"
                      />
                      {servicesList.length > 1 && (
                        <button type="button" onClick={() => removeServiceItem(index)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-zinc-900">Hero Image</h4>
                  <button type="button" onClick={() => openMediaPickerPage('featured')} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100">Choose Media</button>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-white">
                  {featuredImage ? (
                    <div className="space-y-3 p-3">
                      <img src={featuredImage} alt="Hero" className="h-40 w-full rounded-lg object-cover" />
                      <div className="text-sm text-zinc-700">{metaTitle || 'Area hero image'}</div>
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center p-4 text-center text-sm text-zinc-500">No hero image selected.</div>
                  )}
                </div>

                <div className="mt-3 space-y-3">
                  <label className="block text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">Image URL</label>
                  <input
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="Paste a hero image URL"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                  />
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-zinc-700">
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} className="hidden" />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-zinc-900">Gallery</h4>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-zinc-700">
                    Add Images
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>

                {(gallery || []).length ? (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {(gallery || []).map((image, index) => (
                      <div key={`${image}-${index}`} className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white">
                        <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGallery((current) => current.filter((item) => item !== image))}
                          className="absolute right-1 top-1 rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-zinc-300 bg-white p-5 text-center text-sm text-zinc-500">No gallery images yet.</div>
                )}
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-zinc-900">Publishing</h4>
                </div>

                <label className="mt-3 block text-sm font-medium text-zinc-700">
                  Status
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </label>

                <div className="mt-5 flex flex-col gap-3">
                  <button type="button" onClick={saveContent} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">{isCreateMode ? 'Create Area' : 'Save Area'}</button>
                  <button type="button" onClick={() => navigate('/admin/areas')} className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100">Cancel</button>
                </div>
              </section>
            </aside>
          </div>

          {floatingToolbar ? (
            <div
              className="fixed z-[10001] flex items-center gap-1 rounded-xl bg-zinc-900 p-1.5 text-white shadow-xl"
              style={{ top: floatingToolbar.top, left: floatingToolbar.left }}
              onMouseDown={(event) => {
                event.preventDefault()
                saveEditorSelection()
              }}
              role="toolbar"
              aria-label="Text editing tools"
            >
              <button type="button" onClick={() => applyCommand('bold')} className="rounded-lg px-2.5 py-1.5 text-xs font-bold transition hover:bg-zinc-700">Bold</button>
              <button type="button" onClick={() => applyCommand('italic')} className="rounded-lg px-2.5 py-1.5 text-xs italic transition hover:bg-zinc-700">Italic</button>
              <button type="button" onClick={openLinkDialog} className="rounded-lg px-2.5 py-1.5 text-xs transition hover:bg-zinc-700">Add link</button>
              <button type="button" onClick={openImageDialog} className="rounded-lg px-2.5 py-1.5 text-xs transition hover:bg-zinc-700">Add image</button>
            </div>
          ) : null}

          {renderImageDialog()}

          {mediaPickerOpenPage ? (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
              <div className="absolute inset-0" onClick={() => setMediaPickerOpenPage(false)} />
              <div className="relative z-10 w-full max-w-4xl rounded-lg bg-white p-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{mediaPickerMode === 'featured' ? 'Choose Hero Image' : 'Choose Media'}</h4>
                  <button type="button" onClick={() => setMediaPickerOpenPage(false)} className="rounded-xl bg-zinc-100 px-3 py-1">Close</button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {mediaPickerImagesPage.map((img) => (
                    <div key={img.id} className="rounded-lg border p-2">
                      <img
                        onClick={async () => {
                          const imageUrl = `${apiHost}${img.file_path}`
                          if (mediaPickerMode === 'featured') {
                            setFeaturedImage(imageUrl)
                          } else if (mediaPickerMode === 'gallery' && editorType === 'areas-we-cover') {
                            setGallery((g) => Array.from(new Set([...(g || []), imageUrl])))
                          }
                          if (editorType === 'areas-we-cover') {
                            try { await addImageUsage(img.id, 'area', 0, editorPage?.title || editorPage?.slug || 'Area') } catch {}
                          }
                          setMediaPickerOpenPage(false)
                        }}
                        src={`${apiHost}${img.file_path}`}
                        alt=""
                        className="h-28 w-full cursor-pointer rounded object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )
    }

    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold">{isCreateMode ? 'Create' : 'Edit'}: {editorPage.title || editorPage.label || sectionLabel}</h3>
              <p className="text-sm text-zinc-500">Rich content editor for page and blog content.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setHtmlView((prev) => !prev)} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm">{htmlView ? 'WYSIWYG' : 'HTML View'}</button>
              <button type="button" onClick={openButtonDialog} className="rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-black">Insert Button</button>
              <button type="button" onClick={() => openMediaPickerPage('insert')} className="rounded-xl bg-zinc-100 px-3 py-2 text-sm">Insert from Media</button>
              <button type="button" onClick={() => contentFileInputRef.current?.click()} className="rounded-xl bg-zinc-100 px-3 py-2 text-sm">Insert from PC</button>
              <button type="button" onClick={openImageDialog} className="rounded-xl bg-zinc-100 px-3 py-2 text-sm">Insert from URL</button>
              <input ref={contentFileInputRef} type="file" accept="image/*" onChange={handleContentImageUpload} className="hidden" />
              <button type="button" onClick={openLinkDialog} className="rounded-xl bg-zinc-100 px-3 py-2 text-sm">Insert Link</button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Title
                  <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
                </label>
                <label className="block text-sm font-medium text-zinc-700">
                  Slug
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <label className="block text-sm font-medium text-zinc-700">
                  Excerpt
                  <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-2 h-24 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
                </label>
                <label className="block text-sm font-medium text-zinc-700">
                  Status
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm font-medium text-zinc-700 mt-4">
                Meta Description
                <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="mt-2 h-20 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>
              <label className="mt-4 block text-sm font-medium text-zinc-700">
                Publish date
                <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-black" />
              </label>

              <div className="mt-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-center gap-2" onMouseDown={saveEditorSelection}>
                  <button type="button" onClick={() => applyCommand('bold')} className="rounded-xl bg-white px-3 py-2 text-sm">Bold</button>
                  <button type="button" onClick={() => applyCommand('italic')} className="rounded-xl bg-white px-3 py-2 text-sm">Italic</button>
                  <button type="button" onClick={() => applyCommand('underline')} className="rounded-xl bg-white px-3 py-2 text-sm">Underline</button>
                  <button type="button" onClick={() => applyCommand('strikeThrough')} className="rounded-xl bg-white px-3 py-2 text-sm">Strike</button>
                  <button type="button" onClick={() => applyCommand('formatBlock', '<H1>')} className="rounded-xl bg-white px-3 py-2 text-sm">H1</button>
                  <button type="button" onClick={() => applyCommand('formatBlock', '<H2>')} className="rounded-xl bg-white px-3 py-2 text-sm">H2</button>
                  <button type="button" onClick={() => applyCommand('insertUnorderedList')} className="rounded-xl bg-white px-3 py-2 text-sm">Bullet</button>
                  <button type="button" onClick={() => applyCommand('insertOrderedList')} className="rounded-xl bg-white px-3 py-2 text-sm">Numbered</button>
                  <button type="button" onClick={() => applyCommand('formatBlock', '<BLOCKQUOTE>')} className="rounded-xl bg-white px-3 py-2 text-sm">Quote</button>
                  <button type="button" onClick={() => applyCommand('insertHorizontalRule')} className="rounded-xl bg-white px-3 py-2 text-sm">HR</button>
                </div>
              </div>

              {htmlView ? (
                <textarea
                  value={editorHtml}
                  onChange={(e) => setEditorHtml(e.target.value)}
                  className="mt-4 min-h-[340px] w-full rounded-3xl border border-zinc-300 bg-black/5 p-4 font-mono text-sm text-zinc-900 outline-none"
                />
              ) : (
                <div
                  id="cms-editor"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setEditorHtml(e.currentTarget.innerHTML)}
                  className="mt-4 min-h-[340px] w-full rounded-3xl border border-zinc-300 bg-white p-4 prose max-w-none focus:outline-none"
                  dangerouslySetInnerHTML={{ __html: editorHtml || '<p><br/></p>' }}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <h4 className="text-sm font-semibold text-zinc-900">Featured Image</h4>
                {featuredImage ? (
                  <img src={featuredImage} alt="Featured" className="mt-3 h-40 w-full rounded-3xl object-cover" />
                ) : (
                  <div className="mt-3 rounded-3xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">No featured image set.</div>
                )}
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <button type="button" onClick={() => openMediaPickerPage('featured')} className="rounded-2xl bg-black px-3 py-3 text-sm font-semibold text-white">Media Library</button>
                  <button type="button" onClick={() => featuredFileInputRef.current?.click()} className="rounded-2xl border border-zinc-300 bg-white px-3 py-3 text-sm font-semibold text-zinc-800">Upload from PC</button>
                  <button type="button" onClick={() => { const url = window.prompt('Enter featured image URL', featuredImage); if (url !== null) setFeaturedImage(url.trim()) }} className="rounded-2xl border border-zinc-300 bg-white px-3 py-3 text-sm font-semibold text-zinc-800">Use Image URL</button>
                </div>
                <input ref={featuredFileInputRef} type="file" accept="image/*" onChange={handleFeaturedImageUpload} className="hidden" />
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <h4 className="text-sm font-semibold text-zinc-900">Preview</h4>
                <p className="mt-3 text-sm text-zinc-600">This editor saves HTML content for your blog page. Use the HTML view for raw markup when needed.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button onClick={() => navigate('/admin/blogs')} className="rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700">Cancel</button>
            <button onClick={saveContent} className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white">{isCreateMode ? 'Create post' : 'Save post'}</button>
          </div>

          {floatingToolbar ? (
            <div
              className="fixed z-[10001] flex items-center gap-1 rounded-xl bg-zinc-900 p-1.5 text-white shadow-xl"
              style={{ top: floatingToolbar.top, left: floatingToolbar.left }}
              onMouseDown={(event) => {
                event.preventDefault()
                saveEditorSelection()
              }}
              role="toolbar"
              aria-label="Text editing tools"
            >
              <button type="button" onClick={() => applyCommand('bold')} className="rounded-lg px-2.5 py-1.5 text-xs font-bold transition hover:bg-zinc-700">Bold</button>
              <button type="button" onClick={() => applyCommand('italic')} className="rounded-lg px-2.5 py-1.5 text-xs italic transition hover:bg-zinc-700">Italic</button>
              <button type="button" onClick={openLinkDialog} className="rounded-lg px-2.5 py-1.5 text-xs transition hover:bg-zinc-700">Add link</button>
              <button type="button" onClick={openImageDialog} className="rounded-lg px-2.5 py-1.5 text-xs transition hover:bg-zinc-700">Add image</button>
            </div>
          ) : null}

          {renderImageDialog()}

          {buttonDialogOpen ? (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/40" onClick={() => setButtonDialogOpen(false)} />
              <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                <h4 className="text-lg font-semibold">Insert Button</h4>
                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium text-zinc-700">Button text<input value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none" /></label>
                  <label className="block text-sm font-medium text-zinc-700">URL<input value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none" /></label>
                  <label className="block text-sm font-medium text-zinc-700">Style<select value={buttonVariant} onChange={(e) => setButtonVariant(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none"><option value="primary">Primary</option><option value="secondary">Secondary</option><option value="outline">Outline</option></select></label>
                  <label className="block text-sm font-medium text-zinc-700">Alignment<select value={buttonAlign} onChange={(e) => setButtonAlign(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" onClick={() => setButtonDialogOpen(false)} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">Cancel</button>
                  <button type="button" onClick={insertButton} className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-black">Insert</button>
                </div>
              </div>
            </div>
          ) : null}

          {linkDialogOpen ? (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/40" onClick={() => setLinkDialogOpen(false)} />
              <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                <h4 className="text-lg font-semibold">Insert Link</h4>
                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-medium text-zinc-700">Link text<input value={linkText} onChange={(e) => setLinkText(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none" /></label>
                  <label className="block text-sm font-medium text-zinc-700">URL<input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none" /></label>
                  <label className="flex items-center gap-3 text-sm font-medium text-zinc-700">Target<select value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)} className="mt-2 rounded-2xl border border-zinc-300 bg-white px-4 py-3 outline-none"><option value="_blank">New tab</option><option value="_self">Same tab</option></select></label>
                  <label className="flex items-center gap-2 text-sm text-zinc-700"><input type="checkbox" checked={linkNofollow} onChange={(e) => setLinkNofollow(e.target.checked)} /> Add rel="nofollow"</label>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button type="button" onClick={() => setLinkDialogOpen(false)} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">Cancel</button>
                  <button type="button" onClick={insertLink} className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-black">Insert</button>
                </div>
              </div>
            </div>
          ) : null}

          {mediaPickerOpenPage ? (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
              <div className="absolute inset-0" onClick={() => setMediaPickerOpenPage(false)} />
              <div className="relative z-10 w-full max-w-4xl rounded-lg bg-white p-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{mediaPickerMode === 'featured' ? 'Choose Featured Image' : 'Insert Image'}</h4>
                  <button onClick={() => setMediaPickerOpenPage(false)} className="rounded-xl bg-zinc-100 px-3 py-1">Close</button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {mediaPickerImagesPage.map((img) => (
                    <div key={img.id} className="rounded-lg border p-2">
                      <img
                        onClick={async () => {
                          const imageUrl = `${apiHost}${img.file_path}`
                          if (mediaPickerMode === 'featured') {
                            setFeaturedImage(imageUrl)
                          } else if (mediaPickerMode === 'gallery' && editorType === 'areas-we-cover') {
                            setGallery((g) => Array.from(new Set([...(g || []), imageUrl])))
                          } else {
                            restoreEditorSelection()
                            document.execCommand('insertImage', false, imageUrl)
                            setEditorHtml(document.getElementById('cms-editor')?.innerHTML || editorHtml)
                          }
                          if (editorType === 'blogs') {
                            try { await addImageUsage(img.id, 'blog', 0, editorPage?.title || editorPage?.slug || 'Blog') } catch {}
                          }
                          if (editorType === 'areas-we-cover') {
                            try { await addImageUsage(img.id, 'area', 0, editorPage?.title || editorPage?.slug || 'Area') } catch {}
                          }
                          setMediaPickerOpenPage(false)
                        }}
                        src={`${apiHost}${img.file_path}`}
                        alt=""
                        className="cursor-pointer h-28 w-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
      </div>
    )
  }

  function NotificationsManager() {
    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">Notification History</h3>
            <p className="text-sm text-zinc-500">Bookings, contact forms, and website updates appear here.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={refreshNotifications} className="rounded-xl bg-zinc-100 px-3 py-2 text-sm">Refresh</button>
            <button type="button" onClick={markAllRead} className="rounded-xl bg-black px-3 py-2 text-sm text-white">Mark all read</button>
          </div>
        </div>
        <div className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200">
          {notifications.length === 0 ? <div className="p-6 text-sm text-zinc-500">No notifications yet.</div> : notifications.map((notification) => (
            <div key={notification.id} className={`flex items-start justify-between gap-4 p-4 ${notification.is_read ? 'bg-white' : 'bg-zinc-50'}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selectedNotifications.includes(notification.id)} onChange={() => toggleSelectNotification(notification.id)} />
                <div>
                  <div className="font-semibold text-zinc-900">{notification.title}</div>
                  <div className="mt-1 inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600">{notification.type || 'general'}</div>
                  <p className="mt-2 text-sm text-zinc-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-zinc-400">{new Date(notification.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {!notification.is_read && <button type="button" onClick={() => markRead(notification.id)} className="text-xs text-emerald-600">Mark read</button>}
                <button type="button" onClick={() => deleteNotificationLocal(notification.id)} className="text-xs text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function UsersManager() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newUserForm, setNewUserForm] = useState({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      permissions: { pages: ['dashboard'] },
    })
    const [editingUser, setEditingUser] = useState(null)
    const [selectedPages, setSelectedPages] = useState(['dashboard'])
    const [notice, setNotice] = useState('')

    const handleProfileImageUpload = async (userId, event) => {
      const file = event.target.files && event.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          await updateUser({ id: userId, profile_image: reader.result })
          setNotice('Profile image updated successfully')
          loadUsers()
        } catch (err) {
          setError(err.message || 'Failed to update profile image')
        }
      }
      reader.readAsDataURL(file)
    }

    const handleProfileImageRemove = async (userId) => {
      if (!window.confirm('Remove this profile image?')) return
      try {
        await updateUser({ id: userId, profile_image: '' })
        setNotice('Profile image removed successfully')
        loadUsers()
      } catch (err) {
        setError(err.message || 'Failed to remove profile image')
      }
    }

    const handlePasswordChangeRequest = async (userId, requested) => {
      try {
        await updateUser({ id: userId, password_change_requested: requested })
        setNotice(requested ? 'Password change requested' : 'Password change request cleared')
        loadUsers()
      } catch (err) {
        setError(err.message || 'Failed to update password request status')
      }
    }

    const handleSetPassword = async (userId) => {
      const nextPassword = window.prompt('Enter a new password for this admin user:')
      if (!nextPassword || !nextPassword.trim()) return
      try {
        await updateUser({ id: userId, password: nextPassword.trim() })
        setNotice('Password updated successfully')
        loadUsers()
      } catch (err) {
        setError(err.message || 'Failed to update password')
      }
    }

    const allPages = [
      'dashboard', 'bookings', 'privacy', 'terms', 'fleet', 'media',
      'notifications', 'areas', 'blogs', 'contact', 'forms', 'settings', 'users', 'theme', 'site-settings', 'social-links', 'testimonials', 'help'
    ]

    const loadUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUsers()
        setUsers(data.users || [])
      } catch (err) {
        setError(err.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      loadUsers()
    }, [cmsRefresh])

    const handleCreateUser = async (e) => {
      e.preventDefault()
      if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
        setError('Name, email, and password are required')
        return
      }
      try {
        await createUser({
          ...newUserForm,
          permissions: { pages: selectedPages }
        })
        setNotice('User created successfully')
        setNewUserForm({ name: '', email: '', password: '', role: 'admin', permissions: { pages: ['dashboard'] } })
        setSelectedPages(['dashboard'])
        setShowCreateForm(false)
        loadUsers()
      } catch (err) {
        setError(err.message || 'Failed to create user')
      }
    }

    const handleUpdateUserPermissions = async (user) => {
      try {
        await updateUser({
          id: user.id,
          permissions: { pages: selectedPages }
        })
        setNotice('User permissions updated')
        setEditingUser(null)
        loadUsers()
      } catch (err) {
        setError(err.message || 'Failed to update user')
      }
    }

    const handleDeleteUser = async (user) => {
      if (!user.is_deletable) {
        setError('This user cannot be deleted (main admin account)')
        return
      }
      if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) return
      try {
        await deleteUser(user.id)
        setNotice('User deleted successfully')
        loadUsers()
      } catch (err) {
        setError(err.message || 'Failed to delete user')
      }
    }

    return (
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Manage Users</h3>
            <p className="text-sm text-zinc-500">Create and manage admin users with specific permissions.</p>
          </div>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              + Add User
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
            <button onClick={() => setError(null)} className="ml-2 text-red-600 hover:underline">Dismiss</button>
          </div>
        )}

        {notice && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {notice}
            <button onClick={() => setNotice('')} className="ml-2 text-emerald-600 hover:underline">Dismiss</button>
          </div>
        )}

        {showCreateForm && (
          <form onSubmit={handleCreateUser} className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
            <h4 className="font-semibold text-zinc-900">Create New User</h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <select
                value={newUserForm.role}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-700 mb-2">Page Permissions</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {allPages.map(page => (
                  <label key={page} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedPages.includes(page)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPages(prev => [...prev, page])
                        } else {
                          setSelectedPages(prev => prev.filter(p => p !== page))
                        }
                      }}
                      className="rounded"
                    />
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Create User
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="mt-4 text-center text-sm text-zinc-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="mt-4 rounded-lg bg-white p-4 text-center text-sm text-zinc-500">
            No users created yet
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <label className="group relative flex h-12 w-12 cursor-pointer overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
                      {user.profile_image || user.image ? (
                        <img src={user.profile_image || user.image} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-sm font-bold text-zinc-600">{user.name?.charAt(0)?.toUpperCase() || 'A'}</span>
                      )}
                      <input type="file" accept="image/*" onChange={(event) => handleProfileImageUpload(user.id, event)} className="hidden" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">Change</span>
                    </label>
                    {(user.profile_image || user.image) && (
                      <button type="button" onClick={() => handleProfileImageRemove(user.id)} className="text-[10px] font-medium text-red-600 hover:underline">
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-zinc-900">{user.name}</h4>
                      {!user.is_deletable && (
                      <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        Main Admin
                      </span>
                    )}
                      <span className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-700 rounded">
                        {user.role}
                      </span>
                      {user.password_change_requested && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 bg-amber-100 text-amber-700 rounded">
                          Password request
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Pages: {user.permissions?.pages?.join(', ') || 'dashboard'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  {user.is_deletable === false && (
                    <button
                      onClick={() => handleSetPassword(user.id)}
                      className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white hover:bg-violet-700"
                    >
                      Change Password
                    </button>
                  )}
                  {!user.is_deletable && user.password_change_requested && (
                    <button
                      onClick={() => handlePasswordChangeRequest(user.id, false)}
                      className="rounded-lg bg-amber-200 px-3 py-2 text-xs font-medium text-amber-800 hover:bg-amber-300"
                    >
                      Clear Request
                    </button>
                  )}
                  {user.is_deletable !== false && (
                    <button
                      onClick={() => handlePasswordChangeRequest(user.id, true)}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white hover:bg-amber-600"
                    >
                      Request Password Change
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingUser(user)
                      setSelectedPages(user.permissions?.pages || ['dashboard'])
                    }}
                    className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-medium text-black hover:bg-yellow-500"
                  >
                    Edit Permissions
                  </button>
                  {user.is_deletable && (
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {editingUser && (
          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
            <h4 className="font-semibold text-zinc-900">Edit Permissions for {editingUser.name}</h4>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {allPages.map(page => (
                <label key={page} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPages(prev => [...prev, page])
                      } else {
                        setSelectedPages(prev => prev.filter(p => p !== page))
                      }
                    }}
                    className="rounded"
                  />
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleUpdateUserPermissions(editingUser)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Save Permissions
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  function ContactInfoManager() {
    const defaults = {
      phone: '+44 118 945 4545',
      email: 'hello@abbeycars.com',
      address: '18 Station Road, Reading, Berkshire, RG1 1AA',
      officeHours: 'Mon-Sat: 08:00 - 20:00\nSun: 10:00 - 16:00',
    }
    const [formData, setFormData] = useState(defaults)
    const [notice, setNotice] = useState('')

    useEffect(() => {
      const settings = getSiteSettings()
      setFormData({ ...defaults, ...(settings.contactInfo || {}) })
    }, [])

    const save = () => {
      setSiteSettings({ contactInfo: formData })
      notifySiteChange('Contact information updated', 'The public contact details were updated.')
      setNotice('Contact information saved successfully.')
      try { window.dispatchEvent(new Event('storage')) } catch {}
    }

    return (
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <h3 className="text-xl font-bold">Edit Public Contact Details</h3>
        <p className="mt-1 text-sm text-zinc-500">Update the phone, address, hours and email shown on the public contact page.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Phone Number
            <input value={formData.phone} onChange={(e) => setFormData((v) => ({ ...v, phone: e.target.value }))} className="mt-2 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-black" />
          </label>

          <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
            Email Address
            <input type="email" value={formData.email} onChange={(e) => setFormData((v) => ({ ...v, email: e.target.value }))} className="mt-2 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-black" />
          </label>

          <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
            Business Address
            <textarea value={formData.address} onChange={(e) => setFormData((v) => ({ ...v, address: e.target.value }))} className="mt-2 min-h-[90px] rounded-xl border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-black" />
          </label>

          <label className="flex flex-col text-sm font-medium text-zinc-700 md:col-span-2">
            Opening Hours
            <textarea value={formData.officeHours} onChange={(e) => setFormData((v) => ({ ...v, officeHours: e.target.value }))} className="mt-2 min-h-[100px] rounded-xl border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-black" />
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={save} className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white">Save Contact Info</button>
          {notice ? <span className="text-sm font-medium text-emerald-600">{notice}</span> : null}
        </div>
      </div>
    )
  }

  function ContactSubmissionsManager() {
    const [submissions, setSubmissions] = useState([])
    const [loadingSubmissions, setLoadingSubmissions] = useState(true)
    const [submissionError, setSubmissionError] = useState(null)
    const [approvalLoading, setApprovalLoading] = useState(null)
    const [viewMode, setViewMode] = useState('active')
    const [editSubmission, setEditSubmission] = useState(null)
    const [contactTab, setContactTab] = useState('info')

    const loadSubmissions = async () => {
      setLoadingSubmissions(true)
      setSubmissionError(null)
      try {
        const response = await getContactSubmissions(viewMode)
        setSubmissions(response.submissions || [])
      } catch (error) {
        setSubmissionError(error.message || 'Unable to load contact submissions.')
      } finally {
        setLoadingSubmissions(false)
      }
    }

    useEffect(() => {
      if (contactTab !== 'submissions') return
      loadSubmissions()
    }, [cmsRefresh, viewMode, contactTab])

    const toggleSubmissionStatus = async (submission) => {
      setApprovalLoading(submission.id)
      try {
        const nextStatus = submission.status === 'approved' ? 'pending' : 'approved'
        await updateContactSubmissionStatus(submission.id, nextStatus)
        setSubmissions((current) => current.map((item) => item.id === submission.id ? { ...item, status: nextStatus } : item))
      } catch (error) {
        setSubmissionError(error.message || 'Unable to update contact status.')
      } finally {
        setApprovalLoading(null)
      }
    }

    const moveSubmissionToTrash = async (id) => {
      try { await deleteContactSubmission(id); await loadSubmissions() } catch (error) { setSubmissionError(error.message || 'Unable to trash contact submission.') }
    }

    const recoverSubmission = async (id) => {
      try { await updateContactSubmissionStatus(id, 'pending', { action: 'restore' }); await loadSubmissions() } catch (error) { setSubmissionError(error.message || 'Unable to recover contact submission.') }
    }

    const permanentlyDeleteSubmission = async (id) => {
      if (!window.confirm('Delete this contact submission permanently?')) return
      try { await deleteContactSubmission(id, true); await loadSubmissions() } catch (error) { setSubmissionError(error.message || 'Unable to delete contact submission.') }
    }

    const saveEditedSubmission = async (event) => {
      event.preventDefault()
      try {
        await updateContactSubmissionStatus(editSubmission.id, editSubmission.status || 'pending', { action: 'update', ...editSubmission })
        setEditSubmission(null)
        await loadSubmissions()
      } catch (error) { setSubmissionError(error.message || 'Unable to update contact submission.') }
    }

    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold">Contact Information</h3>
            <p className="text-sm text-zinc-500">Manage the public details shown on the contact page and review message submissions.</p>
          </div>
          <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1">
            <button type="button" onClick={() => setContactTab('info')} className={`rounded-lg px-3 py-2 text-sm font-medium ${contactTab === 'info' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600'}`}>Contact Info</button>
            <button type="button" onClick={() => setContactTab('submissions')} className={`rounded-lg px-3 py-2 text-sm font-medium ${contactTab === 'submissions' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600'}`}>Submissions</button>
          </div>
        </div>

        {contactTab === 'info' ? (
          <ContactInfoManager />
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold">Contact Form Submissions</h3>
                <p className="text-sm text-zinc-500">Messages sent through the public contact form appear here.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setViewMode('active')} title="Show active contact submissions" aria-label="Show active contact submissions" className={`rounded-xl p-2.5 ${viewMode === 'active' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700'}`}><FiCheckCircle size={18} /></button>
                <button type="button" onClick={() => setViewMode('trashed')} title="Show trashed contact submissions" aria-label="Show trashed contact submissions" className={`rounded-xl p-2.5 ${viewMode === 'trashed' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700'}`}><FiTrash2 size={18} /></button>
                <button type="button" onClick={loadSubmissions} title="Refresh contact submissions" aria-label="Refresh contact submissions" className="rounded-xl bg-black p-2.5 text-white hover:bg-zinc-800"><FiRefreshCw size={18} /></button>
              </div>
            </div>

            {loadingSubmissions ? (
              <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">Loading contact messages...</div>
            ) : submissionError ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{submissionError}</div>
            ) : submissions.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">No contact messages yet.</div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                      <th className="px-3 py-3">Sender</th>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Phone</th>
                      <th className="px-3 py-3">Message</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Submitted</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-zinc-100 align-top hover:bg-zinc-50">
                        <td className="whitespace-nowrap px-3 py-4 font-semibold text-zinc-900">{submission.first_name} {submission.last_name}</td>
                        <td className="px-3 py-4"><a href={`mailto:${submission.email}`} className="text-sky-600 hover:underline">{submission.email}</a></td>
                        <td className="whitespace-nowrap px-3 py-4 text-zinc-700">{submission.phone}</td>
                        <td className="min-w-[18rem] max-w-md whitespace-pre-wrap px-3 py-4 text-zinc-600">{submission.message}</td>
                        <td className="whitespace-nowrap px-3 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${submission.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{submission.status || 'pending'}</span></td>
                        <td className="whitespace-nowrap px-3 py-4 text-zinc-500">{submission.created_at ? new Date(submission.created_at).toLocaleString() : '-'}</td>
                        <td className="px-3 py-4"><div className="flex gap-2">
                          {viewMode === 'trashed' ? <><button type="button" onClick={() => recoverSubmission(submission.id)} title="Recover contact submission" aria-label="Recover contact submission" className="rounded-xl bg-emerald-600 p-2.5 text-white"><FiRotateCcw size={17} /></button><button type="button" onClick={() => permanentlyDeleteSubmission(submission.id)} title="Delete permanently" aria-label="Delete permanently" className="rounded-xl bg-red-500 p-2.5 text-white"><FiTrash2 size={17} /></button></> : <><button type="button" onClick={() => toggleSubmissionStatus(submission)} disabled={approvalLoading === submission.id} title={submission.status === 'approved' ? 'Set status to pending' : 'Set status to approved'} aria-label={submission.status === 'approved' ? 'Set status to pending' : 'Set status to approved'} className={`rounded-xl p-2.5 text-white disabled:opacity-70 ${submission.status === 'approved' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}><FiEdit3 size={17} /></button><button type="button" onClick={() => moveSubmissionToTrash(submission.id)} title="Move to trash" aria-label="Move to trash" className="rounded-xl bg-zinc-700 p-2.5 text-white"><FiTrash2 size={17} /></button></>}
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {editSubmission ? <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"><div className="absolute inset-0" onClick={() => setEditSubmission(null)} /><form onSubmit={saveEditedSubmission} className="relative z-10 w-full max-w-xl space-y-4 rounded-2xl bg-white p-6"><div className="flex items-center justify-between"><h3 className="text-lg font-bold">Edit Contact Submission</h3><button type="button" onClick={() => setEditSubmission(null)} className="text-zinc-500">×</button></div><div className="grid gap-4 sm:grid-cols-2"><input required value={editSubmission.first_name} onChange={(e) => setEditSubmission((v) => ({ ...v, first_name: e.target.value }))} className="rounded-xl border px-3 py-2" placeholder="First name" /><input required value={editSubmission.last_name} onChange={(e) => setEditSubmission((v) => ({ ...v, last_name: e.target.value }))} className="rounded-xl border px-3 py-2" placeholder="Last name" /><input required type="email" value={editSubmission.email} onChange={(e) => setEditSubmission((v) => ({ ...v, email: e.target.value }))} className="rounded-xl border px-3 py-2" placeholder="Email" /><input required value={editSubmission.phone} onChange={(e) => setEditSubmission((v) => ({ ...v, phone: e.target.value }))} className="rounded-xl border px-3 py-2" placeholder="Phone" /></div><textarea required value={editSubmission.message} onChange={(e) => setEditSubmission((v) => ({ ...v, message: e.target.value }))} className="min-h-32 w-full rounded-xl border px-3 py-2" placeholder="Message" /><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditSubmission(null)} className="rounded-xl bg-zinc-100 px-4 py-2">Cancel</button><button type="submit" className="rounded-xl bg-black px-4 py-2 text-white">Save</button></div></form></div> : null}
          </>
        )}
      </div>
    )
  }

  const activeContent = sectionContent[activeSection] || {
    title: 'Settings',
    subtitle: 'Manage your site settings and editor tools.',
    cards: [],
  }

  // Check if user has permission to access this section
  const canAccessSection = user && hasPagePermission(activeSection)

  const saveTheme = () => {
    applyTheme(themeState)
    localStorage.setItem('abbeyTheme', JSON.stringify(themeState))
    notifySiteChange('Website theme updated', 'The site theme colors were changed.')
    setThemeSavedNotice('Theme saved and applied site-wide.')
  }

  const themeFields = [
    { key: 'background', label: 'Background Color' },
    { key: 'surface', label: 'Surface Color' },
    { key: 'text', label: 'Page Font Color' },
    { key: 'accent', label: 'Accent Color' },
    { key: 'accentText', label: 'Accent Text Color' },
    { key: 'muted', label: 'Muted Text Color' },
    { key: 'header', label: 'Header Background Color' },
    { key: 'headerText', label: 'Header Text Color' },
    { key: 'headerIcon', label: 'Header Icon Color' },
    { key: 'footer', label: 'Footer Background Color' },
    { key: 'footerText', label: 'Footer Text Color' },
    { key: 'footerIcon', label: 'Footer Icon Color' },
    { key: 'buttonBg', label: 'Book Now Button Background' },
    { key: 'buttonText', label: 'Book Now Button Text' },
    { key: 'border', label: 'Border Color' },
  ]

  function SiteSettings() {
    const existing = getSiteSettings()
    const [title, setTitle] = useState(existing.siteTitle || 'Abbey Cars')
    const [maintenance, setMaintenance] = useState(Boolean(existing.maintenance))
    const [favicon, setFavicon] = useState(existing.favicon || '')
    const [notifySoundEnabled, setNotifySoundEnabled] = useState(existing.notifySoundEnabled !== false)
    const [notifySoundData, setNotifySoundData] = useState(existing.notifySoundData || '')
    const [notifySoundUrl, setNotifySoundUrl] = useState(existing.notifySoundUrl || '')

    const save = () => {
      setSiteSettings({ siteTitle: title, maintenance, favicon, notifySoundEnabled, notifySoundData, notifySoundUrl })
      notifySiteChange('Site settings updated', 'Global site settings were changed.')
      // notify layout and other tabs
      try { window.dispatchEvent(new Event('storage')) } catch {}
    }

    const onFavicon = (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setFavicon(reader.result)
      reader.readAsDataURL(file)
    }

    const onSoundUpload = (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      if (!/audio\//.test(file.type)) {
        alert('Please upload a valid audio file (mp3, wav, ogg)')
        return
      }
      // set local data URL for immediate preview/storage
      const reader = new FileReader()
      reader.onload = () => setNotifySoundData(reader.result)
      reader.readAsDataURL(file)

      // attempt server upload (admin only)
      try {
        const fd = new FormData()
        fd.append('sound', file)
        const headers = {}
        const sid = localStorage.getItem('sessionId')
        if (sid) headers['X-Session-Id'] = sid
        fetch(`${apiBase}/upload-sound.php`, { method: 'POST', credentials: 'include', headers, body: fd })
          .then((r) => r.json())
          .then((j) => {
            if (j && j.success && j.url) setNotifySoundUrl(j.url)
          }).catch(() => {})
      } catch (err) {}
    }

    const previewSound = () => {
      try {
        const src = notifySoundUrl || notifySoundData
        if (!src) return
        const a = new Audio(src)
        a.volume = 0.2
        a.play().catch(() => {})
      } catch (err) {}
    }

    return (
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <h3 className="text-xl font-bold">Site Settings</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col">
            <span className="text-sm font-medium">Site Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 rounded-lg border px-3 py-2" />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium">Notification Sound</span>
            <div className="mt-2 flex items-center gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={notifySoundEnabled} onChange={(e) => setNotifySoundEnabled(e.target.checked)} />
                <span className="text-sm">Enable sound</span>
              </label>
              <input type="file" accept="audio/*" onChange={onSoundUpload} className="ml-2" />
              <button onClick={previewSound} className="ml-2 rounded-xl bg-zinc-200 px-3 py-1 text-sm">Preview</button>
            </div>
            {notifySoundUrl ? (
              <div className="mt-2 text-xs text-zinc-500">Custom sound uploaded to server: <a href={notifySoundUrl} className="text-yellow-600">Open</a></div>
            ) : notifySoundData ? (
              <div className="mt-2 text-xs text-zinc-500">Custom sound loaded locally.</div>
            ) : (
              <div className="mt-2 text-xs text-zinc-400">No custom sound; will use built-in beep.</div>
            )}
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium">Favicon Upload</span>
            <input type="file" accept="image/*" onChange={onFavicon} className="mt-2" />
            {favicon ? <img src={favicon} alt="favicon" className="mt-2 h-10 w-10" /> : null}
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} />
            <span className="text-sm">Put site into maintenance mode</span>
          </label>
        </div>

        <div className="mt-4">
          <button onClick={save} className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    )
  }

  function AddCmsPage({ type, onCreate }) {
    const [show, setShow] = useState(false)
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')

    const submit = () => {
      if (!title || !slug) return
      const created = createPage(type === 'areas-we-cover' ? 'areas-we-cover' : type, { title, slug, meta: { title }, content: '' })
      if (created) notifySiteChange('Website page created', `${title} was added to the ${type} section.`)
      setTitle('')
      setSlug('')
      setShow(false)
      try { window.dispatchEvent(new Event('storage')) } catch {}
      if (created) {
        navigate(`/admin/${type}/edit/${created.slug}`)
      }
      if (onCreate) onCreate()
    }

    if (type === 'blogs') {
      return (
        <button onClick={() => navigate('/admin/blogs/create')} className="rounded-xl bg-black px-3 py-1 text-sm text-white">Add Blog</button>
      )
    }

    if (type === 'areas-we-cover') {
      return (
        <button onClick={() => navigate('/admin/areas-we-cover/create')} className="rounded-xl bg-black px-3 py-1 text-sm text-white">Add Area</button>
      )
    }

    return (
      <div>
        {!show ? (
          <button onClick={() => setShow(true)} className="rounded-xl bg-black px-3 py-1 text-sm text-white">Add Page</button>
        ) : (
          <div className="flex items-center gap-2">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg border px-2 py-1" />
            <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-lg border px-2 py-1" />
            <button onClick={submit} className="rounded-xl bg-emerald-600 px-3 py-1 text-sm text-white">Create</button>
            <button onClick={() => setShow(false)} className="rounded-xl bg-zinc-200 px-3 py-1 text-sm">Cancel</button>
          </div>
        )}
      </div>
    )
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-sm uppercase tracking-[0.35em] text-zinc-400">Checking admin access...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
      <aside className={`flex flex-col border-r border-zinc-800 bg-black text-white transition-all duration-300 ${collapsed ? 'w-24' : 'w-80'}`}>
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold">A</div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold">Abbey Cars</div>
                <div className="text-xs text-zinc-400">Admin Portal</div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-5">
          {user?.image ? (
            <div className="flex h-12 w-12 overflow-hidden rounded-full bg-white">
              <img src={user.image} alt={user?.name || 'Admin User'} className="h-full w-full object-cover" />
            </div>
          ) : null}
          {!collapsed && (
            <div className="hidden">
              <div className="font-semibold">{user?.name || 'Admin User'}</div>
              <div className="text-xs text-emerald-400">● Active</div>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {getFilteredSections().map((item) => {
            const Icon = item.icon

            if (item.children) {
              return (
                <details
                  key={item.key}
                  className="group"
                  open={item.key === 'settings' && ['settings', 'theme', 'users', 'site-settings', 'social-links', 'testimonials'].includes(activeSection)}
                >
                  <summary
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm ${collapsed ? 'justify-center' : ''} text-zinc-300 hover:bg-zinc-900 hover:text-white`}
                    onClick={() => {
                      if (item.key === 'settings') {
                        setActiveSection('settings')
                        navigate(getAdminPath('settings'))
                      }
                    }}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{item.label}</span>}
                  </summary>
                  <div className="mt-2 space-y-1 px-3">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        onClick={() => {
                          setActiveSection(child.key)
                          navigate(getAdminPath(child.key))
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm ${
                          activeSection === child.key ? 'bg-white text-black' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        {!collapsed && <span className="ml-6">{child.label}</span>}
                        {collapsed && <span className="sr-only">{child.label}</span>}
                      </button>
                    ))}
                  </div>
                </details>
              )
            }

            const isActive = item.key === activeSection

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActiveSection(item.key)
                  navigate(getAdminPath(item.key))
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                  isActive ? 'bg-white text-black' : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-zinc-800 px-3 py-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            <FiChevronLeft size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b border-zinc-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Admin</p>
              <h1 className="text-2xl font-bold text-zinc-900">{activeContent.title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setActiveSection('settings')} className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition hover:bg-zinc-100">
                <FiSettings size={18} />
              </button>
              <div ref={notificationsRef} className="relative">
                <button type="button" onClick={() => setNotificationsOpen((v) => !v)} className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition hover:bg-zinc-100">
                  <FiBell size={18} />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 inline-block h-2 w-2 rounded-full bg-red-600" aria-hidden="true"></span>}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-[min(30rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={selectedNotifications.length > 0 && selectedNotifications.length === notifications.length} onChange={(e) => { if (e.target.checked) selectAllNotifications(); else clearSelection() }} />
                          <strong className="truncate text-sm">Notifications</strong>
                        </label>
                        <button type="button" onClick={refreshNotifications} title="Refresh notifications" aria-label="Refresh notifications" className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"><FiRefreshCw size={16} /></button>
                      </div>
                      <div className="flex items-center gap-1">
                        {selectedNotifications.length > 0 ? (
                          <>
                            <button type="button" onClick={() => bulkMarkSelected(true)} title="Mark selected as read" aria-label="Mark selected as read" className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50"><FiCheckCircle size={17} /></button>
                            <button type="button" onClick={() => bulkMarkSelected(false)} title="Mark selected as unread" aria-label="Mark selected as unread" className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100"><FiMail size={17} /></button>
                            <button type="button" onClick={bulkDeleteSelected} title="Delete selected notifications" aria-label="Delete selected notifications" className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"><FiTrash2 size={17} /></button>
                          </>
                        ) : (
                          <button type="button" onClick={markAllRead} title="Mark all notifications as read" aria-label="Mark all notifications as read" className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100"><FiCheck size={17} /></button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[min(28rem,65vh)] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-zinc-500">No notifications</div>
                      ) : notifications.map((n) => (
                        <div key={n.id} className={`border-b border-zinc-200 p-3 ${n.is_read ? 'bg-white' : 'bg-zinc-50'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <input type="checkbox" checked={selectedNotifications.includes(n.id)} onChange={() => toggleSelectNotification(n.id)} />
                              <div className="min-w-0 break-words">
                                <div className="break-words text-sm font-semibold text-zinc-900">{n.title}</div>
                                <div className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${n.type === 'site-change' ? 'bg-amber-100 text-amber-700' : n.type === 'contact' ? 'bg-sky-100 text-sky-700' : n.type === 'booking' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}`}>{n.type === 'site-change' ? <FiGlobe size={11} /> : n.type === 'contact' ? <FiMailIcon size={11} /> : n.type === 'booking' ? <FiCalendarIcon size={11} /> : null}{n.type === 'site-change' ? 'Site update' : n.type || 'General'}</div>
                                <div className="mt-1 break-words text-xs leading-5 text-zinc-500">{n.message}</div>
                                <div className="mt-2 break-words text-xs text-zinc-400">{new Date(n.created_at).toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="ml-2 flex shrink-0 flex-col items-end gap-1">
                              {!n.is_read && <button type="button" onClick={() => markRead(n.id)} title="Mark as read" aria-label="Mark as read" className="rounded-lg p-2 text-emerald-600 transition hover:bg-emerald-50"><FiCheck size={17} /></button>}
                              {n.reference_type === 'booking' && n.reference_id ? (
                                <button type="button" onClick={() => { setNotificationsOpen(false); navigate(getAdminPath('bookings') + `?highlight=${n.reference_id}`); }} title="View booking" aria-label="View booking" className="rounded-lg p-2 text-sky-600 transition hover:bg-sky-50"><FiExternalLink size={17} /></button>
                              ) : null}
                              <button type="button" onClick={() => deleteNotificationLocal(n.id)} title="Delete notification" aria-label="Delete notification" className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"><FiTrash2 size={17} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center text-xs text-zinc-500 border-t">
                      <button onClick={() => { setNotificationsOpen(false); setActiveSection('bookings'); navigate(getAdminPath('bookings')) }} className="text-sm">Open bookings</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2">
                {user?.image ? (
                  <img src={user.image} alt={user?.name || 'Admin User'} className="h-8 w-8 rounded-full object-cover" />
                ) : null}
                {!collapsed && <span className="text-sm font-medium">{user?.name || 'Admin User'}</span>}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {checkingAuth ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 text-center">
              <p className="text-zinc-500">Loading...</p>
            </div>
          ) : !canAccessSection ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <h2 className="text-2xl font-bold text-red-700">Access Denied</h2>
              <p className="mt-2 text-red-600">You don't have permission to access this section.</p>
              <button onClick={() => { setActiveSection('dashboard'); navigate(getAdminPath('dashboard')) }} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm font-medium text-zinc-500">{activeContent.title}</p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-900">{activeContent.subtitle}</h2>
          </div>

          {activeSection === 'settings' ? (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <h3 className="text-xl font-bold">Settings Dashboard</h3>
              <p className="text-sm text-zinc-500">Quick access to settings areas.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => { setActiveSection('users'); navigate(getAdminPath('users')) }} className="rounded-xl bg-zinc-100 px-4 py-2">Users</button>
                <button onClick={() => { setActiveSection('theme'); navigate(getAdminPath('theme')) }} className="rounded-xl bg-zinc-100 px-4 py-2">Theme</button>
                <button onClick={() => { setActiveSection('site-settings'); navigate(getAdminPath('site-settings')) }} className="rounded-xl bg-zinc-100 px-4 py-2">Site Settings</button>
                <button onClick={() => { setActiveSection('social-links'); navigate(getAdminPath('social-links')) }} className="rounded-xl bg-zinc-100 px-4 py-2">Social Links</button>
                <button onClick={() => { setActiveSection('testimonials'); navigate(getAdminPath('testimonials')) }} className="rounded-xl bg-zinc-100 px-4 py-2">Testimonials</button>
              </div>
            </div>
          ) : activeSection === 'theme' ? (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Theme</h3>
                  <p className="text-sm text-zinc-500">Update global design colors and apply them across the public site immediately.</p>
                </div>
                <button
                  type="button"
                  onClick={saveTheme}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Save Theme
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {themeFields.map((field) => (
                  <label key={field.key} className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                    <span className="text-sm font-medium text-zinc-700">{field.label}</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeState[field.key]}
                        onChange={(event) =>
                          setThemeState((value) => ({
                            ...value,
                            [field.key]: event.target.value,
                          }))
                        }
                        className="h-10 w-14 cursor-pointer rounded-lg border border-zinc-300 bg-white"
                      />
                      <input
                        type="text"
                        value={themeState[field.key]}
                        onChange={(event) =>
                          setThemeState((value) => ({
                            ...value,
                            [field.key]: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-zinc-600"
                      />
                    </div>
                  </label>
                ))}
              </div>

              {themeSavedNotice ? (
                <p className="mt-4 text-sm font-medium text-emerald-600">{themeSavedNotice}</p>
              ) : null}
            </div>
          ) : activeSection === 'site-settings' ? (
            <SiteSettings />
          ) : activeSection === 'users' ? (
            <UsersManager />
          ) : activeSection === 'social-links' ? (
            <SocialLinksManager />
          ) : activeSection === 'testimonials' ? (
            <TestimonialsManager />
          ) : activeSection === 'notifications' ? (
            <NotificationsManager />
          ) : activeSection === 'contact' ? (
            <ContactSubmissionsManager />
          ) : activeSection === 'forms' ? (
            <FormsManager />
          ) : activeSection === 'fleet' ? (
            <FleetManager />
          ) : activeSection === 'media' ? (
            <MediaManager />
          ) : activeSection === 'bookings' ? (
            <BookingsManager />
          ) : activeSection === 'help' ? (
            <HelpChatWidget currentUser={user} embedded />
          ) : activeSection === 'privacy' ? (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Privacy Policies</h3>
                <AddCmsPage type="privacy" onCreate={() => setCmsRefresh((v) => v + 1)} />
              </div>
              <div className="mt-4">
                {getPrivacyPages().map((p) => (
                  <div key={p.slug} className="py-2 flex items-center justify-between">
                    <div>
                      {editing === p.slug ? (
                        <div className="flex items-center gap-2">
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="rounded-lg border px-2 py-1" />
                          <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="rounded-lg border px-2 py-1" />
                          <button onClick={() => { updatePrivacyPage(p.slug, { title: editTitle, slug: editSlug }); notifySiteChange('Privacy page updated', `${editTitle} was updated.`); setEditing(null); setCmsRefresh((v)=>v+1) }} className="rounded-xl bg-emerald-600 px-2 py-1 text-white">Save</button>
                          <button onClick={() => setEditing(null)} className="rounded-xl bg-zinc-200 px-2 py-1">Cancel</button>
                        </div>
                      ) : (
                        <div>
                          {p.title} — <span className="text-sm text-zinc-500">/{`privacy/${p.slug}`}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/privacy/edit/${p.slug}`)} className="rounded-xl bg-yellow-400 px-2 py-1 text-black">Edit Content</button>
                      <button onClick={() => { updatePrivacyPage(p.slug, { enabled: p.enabled === false ? true : false }); setCmsRefresh((v)=>v+1); try { window.dispatchEvent(new Event('storage')) } catch {} }} className={`rounded-xl px-2 py-1 ${p.enabled === false ? 'bg-yellow-400' : 'bg-zinc-100'}`}>{p.enabled === false ? 'Enable' : 'Disable'}</button>
                      <button onClick={() => { if (confirm('Delete this page?')) { removePrivacyPage(p.slug); setCmsRefresh((v)=>v+1); try { window.dispatchEvent(new Event('storage')) } catch {} } }} className="rounded-xl bg-red-500 px-2 py-1 text-white">Delete</button>
                      {editing === p.slug ? null : (
                        <button onClick={() => { setEditing(p.slug); setEditTitle(p.title); setEditSlug(p.slug) }} className="rounded-xl bg-zinc-100 px-2 py-1">Edit</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'terms' ? (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Terms & Conditions</h3>
                <AddCmsPage type="terms" onCreate={() => setCmsRefresh((v) => v + 1)} />
              </div>
              <div className="mt-4">
                {getTermsPages().map((p) => (
                    <div key={p.slug} className="py-2 flex items-center justify-between">
                    <div>
                      {editing === `terms-${p.slug}` ? (
                        <div className="flex items-center gap-2">
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="rounded-lg border px-2 py-1" />
                          <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="rounded-lg border px-2 py-1" />
                          <button onClick={() => { updateTermsPage(p.slug, { title: editTitle, slug: editSlug }); notifySiteChange('Terms page updated', `${editTitle} was updated.`); setEditing(null); setCmsRefresh((v)=>v+1) }} className="rounded-xl bg-emerald-600 px-2 py-1 text-white">Save</button>
                          <button onClick={() => setEditing(null)} className="rounded-xl bg-zinc-200 px-2 py-1">Cancel</button>
                        </div>
                      ) : (
                        <div>
                          {p.title} — <span className="text-sm text-zinc-500">/{`terms/${p.slug}`}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/terms/edit/${p.slug}`)} className="rounded-xl bg-yellow-400 px-2 py-1 text-black">Edit Content</button>
                      <button onClick={() => { updateTermsPage(p.slug, { enabled: p.enabled === false ? true : false }); setCmsRefresh((v)=>v+1); try { window.dispatchEvent(new Event('storage')) } catch {} }} className={`rounded-xl px-2 py-1 ${p.enabled === false ? 'bg-yellow-400' : 'bg-zinc-100'}`}>{p.enabled === false ? 'Enable' : 'Disable'}</button>
                      <button onClick={() => { if (confirm('Delete this page?')) { removeTermsPage(p.slug); setCmsRefresh((v)=>v+1); try { window.dispatchEvent(new Event('storage')) } catch {} } }} className="rounded-xl bg-red-500 px-2 py-1 text-white">Delete</button>
                      {editing === `terms-${p.slug}` ? null : (
                        <button onClick={() => { setEditing(`terms-${p.slug}`); setEditTitle(p.title); setEditSlug(p.slug) }} className="rounded-xl bg-zinc-100 px-2 py-1">Edit</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'blogs' ? (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">Blogs</h3>
                <AddCmsPage type="blogs" onCreate={() => setCmsRefresh((v) => v + 1)} />
              </div>
              <div className="mt-4">
                {getBlogPosts().map((p) => (
                  <div key={p.slug} className="py-2 flex items-center justify-between">
                    <div>
                      {editing === `blog-${p.slug}` ? (
                        <div className="flex items-center gap-2">
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="rounded-lg border px-2 py-1" />
                          <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="rounded-lg border px-2 py-1" />
                          <button onClick={() => { updateBlogPost(p.slug, { title: editTitle, slug: editSlug }); notifySiteChange('Blog post updated', `${editTitle} was updated.`); setEditing(null); setCmsRefresh((v) => v + 1) }} className="rounded-xl bg-emerald-600 px-2 py-1 text-white">Save</button>
                          <button onClick={() => setEditing(null)} className="rounded-xl bg-zinc-200 px-2 py-1">Cancel</button>
                        </div>
                      ) : (
                        <div>
                          {p.title} — <span className="text-sm text-zinc-500">/{`blogs/${p.slug}`}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => navigate(`/admin/blogs/edit/${p.slug}`)} aria-label={`Edit ${p.title}`} title="Edit blog content" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 text-black transition hover:bg-yellow-500">
                        <FiEdit3 size={16} aria-hidden="true" />
                      </button>
                      <button onClick={() => { updateBlogPost(p.slug, { enabled: p.enabled === false ? true : false }); setCmsRefresh((v) => v + 1); try { window.dispatchEvent(new Event('storage')) } catch {} }} className={`rounded-xl px-2 py-1 ${p.enabled === false ? 'bg-yellow-400' : 'bg-zinc-100'}`}>{p.enabled === false ? 'Enable' : 'Disable'}</button>
                      <button onClick={() => { if (confirm('Delete this post?')) { removeBlogPost(p.slug); setCmsRefresh((v) => v + 1); try { window.dispatchEvent(new Event('storage')) } catch {} } }} className="rounded-xl bg-red-500 px-2 py-1 text-white">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeSection === 'areas' ? (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Areas</h3>
                <AddCmsPage type="areas-we-cover" onCreate={() => setCmsRefresh((v) => v + 1)} />
              </div>
              <div className="mt-4 space-y-2">
                {getAreas()
                  .filter((p) => p.label && (p.slug || p.to))
                  .map((p, idx) => {
                    // Generate unique key combining index + slug + to + label to ensure uniqueness
                    const uniqueKey = `area-${idx}-${p.slug || 'no-slug'}-${p.to || 'no-to'}-${p.label.replace(/\s+/g, '-').toLowerCase()}`;
                    return (
                      <div key={uniqueKey} className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 hover:bg-zinc-100 transition-colors">
                        <div className="flex-1">
                          {editing === `area-${p.slug || p.to}` ? (
                            <div className="flex items-center gap-2">
                              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="rounded-lg border px-2 py-1" />
                              <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="rounded-lg border px-2 py-1" />
                              <button onClick={() => { updateArea(p.slug || p.to.split('/').pop(), { label: editTitle, slug: editSlug, to: `/areas-we-cover/${editSlug}` }); notifySiteChange('Service area updated', `${editTitle} was updated.`); setEditing(null); setCmsRefresh((v)=>v+1) }} className="rounded-xl bg-emerald-600 px-3 py-1 text-white text-sm font-semibold">Save</button>
                              <button onClick={() => setEditing(null)} className="rounded-xl bg-zinc-300 px-3 py-1 text-sm font-semibold">Cancel</button>
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold text-zinc-900">{p.label}</div>
                              <div className="text-sm text-zinc-500">{p.to}</div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button onClick={() => openAreaEditor(p)} className="rounded-xl bg-yellow-400 hover:bg-yellow-500 px-3 py-1.5 text-black text-sm font-semibold transition-colors">Edit Content</button>
                          <button onClick={() => { updateArea(p.slug || p.to.split('/').pop(), { enabled: p.enabled === false ? true : false }); setCmsRefresh((v)=>v+1); try { window.dispatchEvent(new Event('storage')) } catch {} }} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${p.enabled === false ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-zinc-200 hover:bg-zinc-300'}`}>{p.enabled === false ? 'Enable' : 'Disable'}</button>
                          <button onClick={() => { if (confirm('Delete this area?')) { removeArea(p.slug || p.to.split('/').pop()); setCmsRefresh((v)=>v+1); try { window.dispatchEvent(new Event('storage')) } catch {} } }} className="rounded-xl bg-red-500 hover:bg-red-600 px-3 py-1.5 text-white text-sm font-semibold transition-colors">Delete</button>
                          {editing === `area-${p.slug || p.to}` ? null : (
                            <button onClick={() => openAreaEditor(p)} className="rounded-xl bg-zinc-200 hover:bg-zinc-300 px-3 py-1.5 text-sm font-semibold transition-colors">Edit</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeSection === 'dashboard' && dashboardSummary ? (
                <>
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                    <div className="text-sm text-zinc-500">Total Bookings</div>
                    <div className="mt-2 text-3xl font-bold text-zinc-900">{dashboardSummary.total_bookings}</div>
                    <div className="text-xs text-zinc-500">This month: {dashboardSummary.bookings_this_month}</div>
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                    <div className="text-sm text-zinc-500">Most Booked Car</div>
                    <div className="mt-2 text-2xl font-bold text-zinc-900">{dashboardSummary.most_booked ? dashboardSummary.most_booked.name : '—'}</div>
                    <div className="text-xs text-zinc-500">Bookings: {dashboardSummary.most_booked ? dashboardSummary.most_booked.bookings : 0}</div>
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                    <div className="text-sm text-zinc-500">Contact / Forms</div>
                    <div className="mt-2 text-3xl font-bold text-zinc-900">{dashboardSummary.contact_submissions}</div>
                    <div className="text-xs text-zinc-500">Blog posts: {dashboardSummary.blog_count}</div>
                  </div>

                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                    <div className="text-sm text-zinc-500">Fleet — Listed</div>
                    <div className="mt-2 text-3xl font-bold text-zinc-900">{dashboardSummary.fleet.listed}</div>
                    <div className="text-xs text-zinc-500">Available: {dashboardSummary.fleet.available} • Maintenance: {dashboardSummary.fleet.maintenance}</div>
                  </div>
                </>
              ) : activeSection === 'fleet' && dashboardSummary ? (
                <>
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                    <div className="text-sm text-zinc-500">Cars Listed</div>
                    <div className="mt-2 text-3xl font-bold text-zinc-900">{dashboardSummary.fleet.listed}</div>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                    <div className="text-sm text-zinc-500">Available</div>
                    <div className="mt-2 text-3xl font-bold text-zinc-900">{dashboardSummary.fleet.available}</div>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                    <div className="text-sm text-zinc-500">Maintenance</div>
                    <div className="mt-2 text-3xl font-bold text-zinc-900">{dashboardSummary.fleet.maintenance}</div>
                  </div>
                </>
              ) : (
                activeContent.cards.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
                    <div className="text-sm text-zinc-500">{item.label}</div>
                    <div className="mt-2 text-3xl font-bold text-zinc-900">{item.value}</div>
                  </div>
                ))
              )}
            </div>
          )}
            </>
          )}
          {/^\/admin\/(privacy|terms|areas-we-cover|blogs)\/(create|edit)/.test(location.pathname) && <PageEditor />}
        </main>
      </div>
      <HelpChatWidget currentUser={user} />
    </div>
  )
}

export default Admin
