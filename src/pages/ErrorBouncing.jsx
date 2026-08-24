import { Link, useLocation } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

function ErrorBouncing() {
  usePageTitle('Error Bouncing')
  const { state } = useLocation()
  const reason = state?.reason || 'Unknown bounce detected.'
  const detail = state?.detail || state?.responseText || 'No additional details available.'

  return (
    <section className="page-card">
      <h1>ErrorBouncing</h1>
      <p>
        The login flow bounced back to the login page. This page is for debugging that failure.
      </p>
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.75rem' }}>
        <p><strong>Reason:</strong> {reason}</p>
        <p><strong>Details:</strong></p>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{detail}</pre>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/login" style={{ color: '#1d4ed8' }}>Back to Login</Link>
      </div>
    </section>
  )
}

export default ErrorBouncing
