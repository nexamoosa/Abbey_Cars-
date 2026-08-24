import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

function Login() {
  usePageTitle('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setMessageType('')

    const loginUrl = import.meta.env.DEV
      ? 'http://localhost/Abbey_Cars/api/login.php'
      : 'api/login.php'

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const responseText = await response.text()
      let data = null
      try {
        data = JSON.parse(responseText)
      } catch {
        data = null
      }

      if (!response.ok) {
        const reason = data?.message || response.statusText || `HTTP ${response.status}`
        setMessage(`Login failed: ${reason}`)
        setMessageType('error')
        return
      }

      if (data?.success) {
        // store session id token if provided (fallback when cookies are blocked)
        if (data.session_id) {
          try { localStorage.setItem('sessionId', data.session_id) } catch {}
        }
        navigate('/admin')
      } else {
        const reason = data?.message || 'Invalid login response from server.'
        const details = data ? JSON.stringify(data) : responseText
        navigate('/error-bouncing', { state: { reason: 'Login attempt failed', detail: `${reason}\n${details}` } })
      }
    } catch (error) {
      setMessage('Network error: ' + (error.message || 'Unable to reach API'))
      setMessageType('error')
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-bold text-black">
            A
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign in to access the Abbey Cars dashboard.</p>
        </div>

        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-2 text-sm text-zinc-300">
            <span>Email</span>
            <input
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </label>

          <label className="grid gap-2 text-sm text-zinc-300">
            <span>Password</span>
            <input
              type="password"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            Login
          </button>
        </form>

        {message ? (
          <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            messageType === 'error'
              ? 'border-red-500/40 bg-red-500/10 text-red-300'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          }`}>
            {message}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export default Login
