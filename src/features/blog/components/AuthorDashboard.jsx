import { useCallback, useEffect, useRef, useState } from 'react'
import { IconDotsVertical } from '@tabler/icons-react'
import { deletePost, getStats, listMyPosts, togglePublish } from '../api/blogApi.js'
import { confirmDelete, formatDate, showError, showSuccess } from '../../../helpers/toolsHelper.js'
import PostStats from './PostStats.jsx'
import PostModal from '../modals/PostModal.jsx'
import AiPostGeneratorModal from '../modals/AiPostGeneratorModal.jsx'

function RowMenu({ post, onEdit, onDelete, onView }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const act = (fn) => () => {
    setOpen(false)
    fn(post)
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" className="btn btn-secondary !px-2" aria-label={`Menu tindakan untuk ${post.title}`} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
        <IconDotsVertical size={20} aria-hidden="true" />
      </button>
      {open && (
        <div className="card absolute right-0 z-20 mt-1 flex w-40 flex-col p-1 shadow-lg">
          {post.is_published && <button type="button" className="btn btn-secondary !justify-start !border-0" onClick={act(onView)}>Lihat</button>}
          <button type="button" className="btn btn-secondary !justify-start !border-0" onClick={act(onEdit)}>Edit</button>
          <button type="button" className="btn btn-secondary !justify-start !border-0 !text-[var(--danger-text)]" onClick={act(onDelete)}>Hapus</button>
        </div>
      )}
    </div>
  )
}

export default function AuthorDashboard({ theme, onNavigate }) {
  const [stats, setStats] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | post
  const [aiOpen, setAiOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const [s, p] = await Promise.all([getStats(), listMyPosts()])
      setStats(s)
      setPosts(p)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    document.title = 'Ruang Penulis - Delcom Blog'
    load()
  }, [load])

  const toggle = async (post) => {
    try {
      await togglePublish(post.id)
      await load()
    } catch (err) {
      showError(err.message)
    }
  }

  const remove = async (post) => {
    if (!(await confirmDelete(`Artikel "${post.title}" akan dihapus permanen.`))) return
    try {
      await deletePost(post.id)
      await load()
      showSuccess('Artikel dihapus')
    } catch (err) {
      showError(err.message)
    }
  }

  const saved = async (message) => {
    setEditing(null)
    setAiOpen(false)
    await load()
    showSuccess(message)
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-3xl font-extrabold">Ruang Kerja Penulis</h1>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => setAiOpen(true)}>AI Generator</button>
          <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>Tambah Artikel</button>
        </div>
      </div>

      {error && <p role="alert" className="alert-error mb-4">{error}</p>}
      <PostStats stats={stats} />

      <h2 className="mb-3 mt-8 text-xl font-bold">Artikel Saya</h2>
      {loading ? (
        <p role="status" className="muted">Memuat artikel...</p>
      ) : (
        <div className="card overflow-x-auto" role="region" aria-label="Tabel artikel saya" tabIndex={0}>
          <table className="table">
            <caption className="sr-only">Daftar artikel milik Anda</caption>
            <thead>
              <tr>
                <th scope="col">Judul</th>
                <th scope="col">Kategori</th>
                <th scope="col">Status</th>
                <th scope="col">Dibuat</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr><td colSpan={5} className="muted">Belum ada artikel. Klik &quot;Tambah Artikel&quot; untuk memulai.</td></tr>
              )}
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold">{p.title}</td>
                  <td>{p.category}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button type="button" role="switch" className="switch" aria-checked={p.is_published} aria-label={`Terbitkan ${p.title}`} onClick={() => toggle(p)} />
                      <span className={`badge ${p.is_published ? 'badge-ok' : 'badge-draft'}`}>{p.is_published ? 'Terbit' : 'Draf'}</span>
                    </div>
                  </td>
                  <td>{formatDate(p.created_at)}</td>
                  <td>
                    <RowMenu post={p} onEdit={setEditing} onDelete={remove} onView={(post) => onNavigate(`/posts/${post.slug}`)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PostModal open={editing !== null} post={editing === 'new' ? null : editing} theme={theme} onClose={() => setEditing(null)} onSaved={saved} />
      <AiPostGeneratorModal open={aiOpen} theme={theme} onClose={() => setAiOpen(false)} onSaved={saved} />
    </div>
  )
}
