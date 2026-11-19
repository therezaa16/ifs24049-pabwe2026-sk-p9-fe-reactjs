import { useEffect, useState } from 'react'
import { getPublicPost } from '../api/blogApi.js'
import { formatDate } from '../../../helpers/toolsHelper.js'
import MarkdownViewer from '../../../components/MarkdownViewer.jsx'

export default function PublicArticleDetail({ slug, onNavigate }) {
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setPost(null)
    setError('')
    getPublicPost(slug)
      .then((data) => {
        if (cancelled) return
        setPost(data)
        document.title = `${data.title} - Delcom Blog`
      })
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [slug])

  const back = (
    <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/') }}>&larr; Kembali ke beranda</a>
  )

  if (error) {
    return (
      <div className="w-full px-4 py-8 sm:px-8">
        <h1 className="mb-2 text-2xl font-bold">Artikel tidak ditemukan</h1>
        <p role="alert" className="alert-error mb-4">{error}</p>
        {back}
      </div>
    )
  }
  if (!post) return <p role="status" className="muted px-4 py-8 sm:px-8">Memuat artikel...</p>

  return (
    <article className="w-full px-4 py-8 sm:px-8 lg:px-12">
      <p className="mb-4">{back}</p>
      <p className="muted m-0 text-sm">{post.category} &middot; {post.reading_time} menit baca</p>
      <h1 className="my-2 text-3xl font-extrabold">{post.title}</h1>
      <p className="muted mb-6">Oleh {post.author_name} &middot; {formatDate(post.published_at)}</p>
      {post.cover_image_path && (
        <img src={post.cover_image_path} alt={`Sampul artikel ${post.title}`} width="1200" height="630" className="mb-6 h-auto w-full rounded-lg object-cover" />
      )}
      <MarkdownViewer content={post.content} />
    </article>
  )
}
