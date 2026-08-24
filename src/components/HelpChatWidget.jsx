import { useMemo, useState } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'

const defaultAdmins = [
  { id: 'admin', name: 'Admin', role: 'Administrator', status: 'online' },
  { id: 'tester', name: 'tester', role: 'Tester', status: 'online' },
  { id: 'support-team', name: 'Support Team', role: 'Admin Support', status: 'online' },
  { id: 'operations', name: 'Operations', role: 'Fleet Admin', status: 'online' },
  { id: 'finance', name: 'Finance', role: 'Accounts Admin', status: 'away' },
]

const THREADS_KEY = 'abbey_admin_support_threads_v1'
const NOTIFICATIONS_KEY = 'abbey_admin_support_notifications_v1'

const readThreads = () => {
  try {
    const raw = localStorage.getItem(THREADS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const writeThreads = (threads) => {
  try {
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads))
  } catch {
    // ignore storage issues
  }
}

const readNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeNotifications = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
  } catch {
    // ignore storage issues
  }
}

const normalizeUserKey = (value) => String(value || '').trim().toLowerCase()

function HelpChatWidget({ currentUser, embedded = false }) {
  const [open, setOpen] = useState(embedded)
  const [selectedAdminId, setSelectedAdminId] = useState(defaultAdmins[0].id)
  const [input, setInput] = useState('')
  const [threads, setThreads] = useState(() => readThreads())

  const admins = useMemo(() => {
    const currentName = normalizeUserKey(currentUser?.name || 'You')
    return defaultAdmins.filter((admin) => normalizeUserKey(admin.name) !== currentName)
  }, [currentUser])

  useMemo(() => {
    if (!admins.length) return
    setSelectedAdminId((current) => (admins.some((admin) => admin.id === current) ? current : admins[0].id))
  }, [admins])

  const activeAdmin = admins.find((admin) => admin.id === selectedAdminId) || admins[0] || defaultAdmins[0]
  const activeMessages = threads[selectedAdminId] || []

  const sendMessage = () => {
    const cleaned = input.trim()
    if (!cleaned) return

    const senderId = currentUser?.id || 'me'
    const senderName = currentUser?.name || 'Admin'

    const userMessage = {
      id: Date.now(),
      senderId,
      senderName,
      text: cleaned,
      createdAt: new Date().toISOString(),
    }

    const updated = {
      ...threads,
      [selectedAdminId]: [...(threads[selectedAdminId] || []), userMessage],
    }

    setThreads(updated)
    writeThreads(updated)

    const targetAdmin = defaultAdmins.find((admin) => admin.id === selectedAdminId)
    if (targetAdmin) {
      const notifications = readNotifications()
      const newNotification = {
        id: Date.now() + 1,
        title: `New message from ${senderName}`,
        message: cleaned,
        type: 'admin-chat',
        reference_type: 'admin-chat',
        reference_id: selectedAdminId,
        targetUserId: normalizeUserKey(targetAdmin.name),
        targetUserKey: normalizeUserKey(targetAdmin.name),
        senderId,
        senderName,
        created_at: new Date().toISOString(),
        is_read: 0,
      }
      writeNotifications([newNotification, ...notifications])
      try {
        window.dispatchEvent(new Event('admin-chat-notification'))
      } catch {
        // ignore
      }
    }

    setInput('')
  }

  const chatPanel = (
    <div className={`${embedded ? 'mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm' : 'w-[24rem] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10'}`}>
      <div className={`flex items-center justify-between ${embedded ? 'bg-zinc-100 px-4 py-3' : 'bg-zinc-900 px-4 py-3 text-white'}`}>
        <div>
          <div className="text-sm font-semibold">Admin support</div>
          <div className={`text-[10px] uppercase tracking-[0.2em] ${embedded ? 'text-zinc-500' : 'text-zinc-300'}`}>Abbey Cars</div>
        </div>
        {!embedded && (
          <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 text-zinc-200 hover:bg-white/10" aria-label="Close help chat">
            <FiX size={16} />
          </button>
        )}
      </div>

      <div className="border-b border-zinc-200 bg-zinc-50 p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Choose admin</div>
        <div className="space-y-2">
          {admins.map((admin) => (
            <button
              key={admin.id}
              type="button"
              onClick={() => setSelectedAdminId(admin.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-2 py-2 text-left ${selectedAdminId === admin.id ? 'border-zinc-900 bg-white' : 'border-zinc-200 bg-zinc-100'}`}
            >
              <div>
                <div className="text-sm font-semibold text-zinc-900">{admin.name}</div>
                <div className="text-[11px] text-zinc-500">{admin.role}</div>
              </div>
              <span className={`inline-flex h-2.5 w-2.5 rounded-full ${admin.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`} aria-label={admin.status} />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white">
        <div className="border-b border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600">
          Chat with {activeAdmin.name}
        </div>
        <div className="max-h-[18rem] space-y-2 overflow-y-auto p-3">
          {activeMessages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-500">
              No messages yet. Send the first note to start the chat.
            </div>
          ) : activeMessages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === (currentUser?.id || 'me') ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.senderId === (currentUser?.id || 'me') ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'}`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-200 p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Quick message</span>
            <span>{activeAdmin.status === 'online' ? 'Online now' : 'Away'}</span>
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${activeAdmin.name}...`}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
            <button type="button" onClick={sendMessage} className="rounded-xl bg-zinc-900 p-2 text-white hover:bg-zinc-700">
              <FiSend size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (embedded) return chatPanel

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? chatPanel : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 transition hover:scale-105"
          aria-label="Open admin help chat"
        >
          <FiMessageCircle size={24} />
        </button>
      )}
    </div>
  )
}

export default HelpChatWidget
