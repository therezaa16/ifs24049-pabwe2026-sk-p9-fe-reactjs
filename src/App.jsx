import { useCallback, useEffect, useState } from 'react'
import useTheme from './hooks/useTheme.js'
import { getToken, setToken } from './helpers/apiHelper.js'
import { logout as logoutApi } from './features/auth/api/authApi.js'
import AuthPage from './features/auth/components/AuthPage.jsx'
import AuthModal from './features/auth/modals/AuthModal.jsx'
import StickyNavbar from './features/blog/components/StickyNavbar.jsx'
import PublicArticleList from './features/blog/components/PublicArticleList.jsx'
import PublicArticleDetail from './features/blog/components/PublicArticleDetail.jsx'
import AuthorDashboard from './features/blog/components/AuthorDashboard.jsx'
import AdminDashboard from './features/admin/components/AdminDashboard.jsx'

const USER_KEY = 'delcom_user'

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return getToken() && raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const home = (user) => (user?.role === 'admin' ? '/admin' : '/author')

export default function App() {
  const { theme, toggleTheme, accent, setAccent } = useTheme()
  const [path, setPath] = useState(() => window.location.pathname)
  const [user, setUser] = useState(loadUser)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to, replace = false) => {
    if (replace) window.history.replaceState(null, '', to)
    else if (to !== window.location.pathname) window.history.pushState(null, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }, [])

  const startSession = useCallback(({ token, user: u }) => {
    setToken(token)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
  }, [])

  const endSession = useCallback(() => {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  useEffect(() => {
    const onExpired = () => {
      endSession()
      setExpired(true)
    }
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [endSession])

  // Penjaga rute
  useEffect(() => {
    if (path === '/author' && !user) navigate('/login', true)
    else if (path === '/admin' && user?.role !== 'admin') navigate(user ? '/author' : '/login', true)
    else if ((path === '/login' || path === '/register') && user) navigate(home(user), true)
  }, [path, user, navigate])

  const handleAuthenticated = (result) => {
    startSession(result)
    setExpired(false)
    if (path === '/login' || path === '/register') navigate(home(result.user), true)
  }

  const handleLogout = async () => {
    try {
      await logoutApi()
    } catch {
      // token tetap dibuang di sisi klien
    }
    endSession()
    navigate('/')
  }

  let view
  const detail = path.match(/^\/posts\/([^/]+)$/)
  if (path === '/' || path === '/public') view = <PublicArticleList onNavigate={navigate} />
  else if (detail) view = <PublicArticleDetail slug={decodeURIComponent(detail[1])} onNavigate={navigate} />
  else if (path === '/login' || path === '/register') view = user ? null : <AuthPage mode={path.slice(1)} onAuthenticated={handleAuthenticated} onNavigate={navigate} />
  else if (path === '/author') view = user ? <AuthorDashboard theme={theme} onNavigate={navigate} /> : null
  else if (path === '/admin') view = user?.role === 'admin' ? <AdminDashboard /> : null
  else {
    view = (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Halaman tidak ditemukan</h1>
        <p className="muted my-3">Alamat yang Anda buka tidak tersedia.</p>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Kembali ke beranda</a>
      </div>
    )
  }

  return (
    <>
      <a href="#main" className="skip-link">Lewati ke konten utama</a>
      <StickyNavbar path={path} user={user} onNavigate={navigate} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} accent={accent} onAccentChange={setAccent} />
      <main id="main" tabIndex={-1}>{view}</main>
      <footer className="mt-12 border-t border-[var(--border)] bg-[var(--footer-bg)] px-4 py-6 text-center">
        <p className="m-0">&copy; 2026 Delcom Blog. Dibuat untuk praktikum PABWE.</p>
      </footer>
      <AuthModal open={expired} message="Sesi Anda telah berakhir. Silakan masuk kembali." onClose={() => setExpired(false)} onAuthenticated={handleAuthenticated} />
    </>
  )
}
