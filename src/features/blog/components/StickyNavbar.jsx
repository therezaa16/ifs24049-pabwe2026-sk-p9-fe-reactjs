import { IconMoon, IconSun } from '@tabler/icons-react'
import { ACCENTS } from '../../../hooks/useTheme.js'

export default function StickyNavbar({ path, user, onNavigate, onLogout, theme, onToggleTheme, accent, onAccentChange }) {
  const go = (to) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    onNavigate(to)
  }

  const items = [{ to: '/', label: 'Beranda' }]
  if (user) items.push({ to: '/author', label: 'Ruang Penulis' })
  if (user?.role === 'admin') items.push({ to: '/admin', label: 'Admin' })
  if (!user) items.push({ to: '/login', label: 'Masuk' }, { to: '/register', label: 'Daftar' })

  const isCurrent = (to) => (to === '/' ? path === '/' || path === '/public' : path === to)

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]">
      <nav aria-label="Navigasi utama" className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" onClick={go('/')} className="mr-2 text-lg font-extrabold no-underline">Delcom Blog</a>
        <ul className="m-0 flex flex-1 list-none flex-wrap items-center gap-1 p-0">
          {items.map((item) => (
            <li key={item.to}>
              <a href={item.to} onClick={go(item.to)} aria-current={isCurrent(item.to) ? 'page' : undefined} className="rounded px-3 py-1 font-medium no-underline aria-[current=page]:bg-[var(--accent-soft)]">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <label htmlFor="accent-select" className="sr-only">Warna aksen</label>
          <select id="accent-select" className="input !w-auto" value={accent} onChange={(e) => onAccentChange(e.target.value)}>
            {ACCENTS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <button type="button" onClick={onToggleTheme} className="btn btn-secondary" aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}>
            {theme === 'dark' ? <IconSun size={20} aria-hidden="true" /> : <IconMoon size={20} aria-hidden="true" />}
          </button>
          {user && (
            <button type="button" onClick={onLogout} className="btn btn-secondary">Keluar</button>
          )}
        </div>
      </nav>
    </header>
  )
}
