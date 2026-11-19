import { useEffect, useState } from 'react'
import ModalShell from '../../../components/ModalShell.jsx'
import MarkdownEditor from '../../../components/MarkdownEditor.jsx'
import useInput from '../../../hooks/useInput.js'
import { CATEGORIES, createPost, updatePost } from '../api/blogApi.js'

const EMPTY = { title: '', category: 'Umum', excerpt: '', cover_image_path: '', is_published: false }

export default function PostModal({ open, post, theme, onClose, onSaved }) {
  const [values, onChange, reset] = useInput(EMPTY)
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    reset(post ? {
      title: post.title, category: post.category, excerpt: post.excerpt || '',
      cover_image_path: post.cover_image_path || '', is_published: post.is_published,
    } : EMPTY)
    setContent(post?.content || '')
    setError('')
  }, [open, post, reset])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    if (!values.title.trim() || !content.trim()) {
      setError('Judul dan konten artikel wajib diisi')
      return
    }
    setSaving(true)
    try {
      const body = { ...values, content }
      if (post) await updatePost(post.id, body)
      else await createPost(body)
      onSaved(post ? 'Artikel diperbarui' : 'Artikel dibuat')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalShell
      title={post ? 'Edit Artikel' : 'Tambah Artikel'}
      size="full"
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button type="submit" form="post-form" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
        </>
      )}
    >
      <form id="post-form" onSubmit={submit} noValidate className="space-y-4">
        {error && <p role="alert" className="alert-error">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="post-title" className="mb-1 block font-medium">Judul</label>
            <input id="post-title" name="title" className="input" value={values.title} onChange={onChange} />
          </div>
          <div>
            <label htmlFor="post-category" className="mb-1 block font-medium">Kategori</label>
            <select id="post-category" name="category" className="input" value={values.category} onChange={onChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="post-excerpt" className="mb-1 block font-medium">Ringkasan</label>
          <textarea id="post-excerpt" name="excerpt" rows={2} className="input" value={values.excerpt} onChange={onChange} />
        </div>
        <div>
          <label htmlFor="post-cover" className="mb-1 block font-medium">Alamat gambar sampul (opsional)</label>
          <input id="post-cover" name="cover_image_path" className="input" value={values.cover_image_path} onChange={onChange} />
        </div>
        <div>
          <p id="post-content-label" className="mb-1 font-medium">Konten (Markdown)</p>
          <MarkdownEditor value={content} onChange={setContent} theme={theme} />
        </div>
        <label className="flex items-center gap-2 font-medium">
          <input type="checkbox" name="is_published" checked={values.is_published} onChange={onChange} className="h-4 w-4" />
          Terbitkan artikel ini
        </label>
      </form>
    </ModalShell>
  )
}
