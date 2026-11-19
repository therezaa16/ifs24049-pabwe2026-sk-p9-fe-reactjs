import { useCallback, useEffect, useState } from 'react'

export const ACCENTS = ['indigo', 'emerald', 'rose']
const THEME_KEY = 'delcom_theme'
const ACCENT_KEY = 'delcom_accent'

function read(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

/** Tema dark/light dan aksen warna, disimpan di localStorage dan diterapkan ke <html>. */
export default function useTheme() {
  const [theme, setTheme] = useState(() =>
    read(THEME_KEY, window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  )
  const [accent, setAccentState] = useState(() => {
    const saved = read(ACCENT_KEY, 'indigo')
    return ACCENTS.includes(saved) ? saved : 'indigo'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.accent = accent
    localStorage.setItem(ACCENT_KEY, accent)
  }, [accent])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  const setAccent = useCallback((a) => setAccentState(ACCENTS.includes(a) ? a : 'indigo'), [])

  return { theme, toggleTheme, accent, setAccent }
}
