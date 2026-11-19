import { useEffect, useState } from 'react'
import { CATEGORIES, getCategories, listPublicPosts } from '../api/blogApi.js'
import { formatDate } from '../../../helpers/toolsHelper.js'

export default function PublicArticleList({ onNavigate }) {
  const [categories, setCategories] = useState(['Semua', ...CATEGORIES])
  const [category, setCategory] = useState('Semua')
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Delcom Blog - Artikel Teknologi, Pendidikan, dan Gaya Hidup'
    getCategories().then((list) => setCategories(['Semua', ...list])).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listPublicPosts({ q: debounced, category })
      .then((data) => {
        if (cancelled) return
        setPosts(data)
        setError('')
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [debounced, category])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-extrabold">Delcom Blog</h1>
      <p className="muted mb-6 mt-1 max-w-2xl">Kumpulan artikel pilihan seputar teknologi, pendidikan, gaya hidup, bisnis, dan opini.</p>

      <div role="search" className="mb-4">
        <label htmlFor="search-input" className="sr-only">Cari artikel</label>
        <input id="search-input" type="search" className="input" placeholder="Cari artikel berdasarkan judul atau isi..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
        {categories.map((c) => (
          <button key={c} type="button" className="pill" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {error && <p role="alert" className="alert-error mb-4">{error}</p>}
      <p role="status" className="muted mb-4">{loading ? 'Memuat artikel...' : `${posts.length} artikel ditemukan`}</p>

      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.id}>
            <article className="card flex h-full flex-col p-5">
              <p className="muted m-0 text-sm">{p.category} &middot; {p.reading_time} menit baca</p>
              <h2 className="my-2 text-xl font-bold">
                <a href={`/posts/${p.slug}`} onClick={(e) => { e.preventDefault(); onNavigate(`/posts/${p.slug}`) }}>{p.title}</a>
              </h2>
              <p className="flex-1">{p.excerpt}</p>
              <p className="muted m-0 mt-3 text-sm">Oleh {p.author_name} &middot; {formatDate(p.published_at)}</p>
            </article>
          </li>
        ))}
      </ul>
      {!loading && !error && posts.length === 0 && <p className="muted">Belum ada artikel yang cocok.</p>}
    </div>
  )
}
