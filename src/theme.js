export const defaultTheme = {
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  accent: '#facc15',
  accentText: '#111827',
  muted: '#64748b',
  header: '#020617',
  headerText: '#ffffff',
  headerIcon: '#facc15',
  footer: '#020617',
  footerText: '#ffffff',
  footerIcon: '#facc15',
  buttonBg: '#facc15',
  buttonText: '#111827',
  border: '#e2e8f0',
}

const cssVarMap = {
  background: '--site-bg',
  surface: '--site-surface',
  text: '--site-text',
  accent: '--site-accent',
  accentText: '--site-accent-text',
  muted: '--site-muted',
  header: '--site-header',
  headerText: '--site-header-text',
  headerIcon: '--site-header-icon',
  footer: '--site-footer',
  footerText: '--site-footer-text',
  footerIcon: '--site-footer-icon',
  buttonBg: '--site-button-bg',
  buttonText: '--site-button-text',
  border: '--site-border',
}

export function applyTheme(theme = defaultTheme) {
  if (typeof document === 'undefined') return

  const normalized = { ...defaultTheme, ...theme }

  Object.entries(cssVarMap).forEach(([key, cssVar]) => {
    document.documentElement.style.setProperty(cssVar, normalized[key])
  })
}

export function loadStoredTheme() {
  if (typeof window === 'undefined') {
    return defaultTheme
  }

  try {
    const raw = window.localStorage.getItem('abbeyTheme')
    if (!raw) return defaultTheme

    const parsed = JSON.parse(raw)
    return { ...defaultTheme, ...parsed }
  } catch {
    return defaultTheme
  }
}
