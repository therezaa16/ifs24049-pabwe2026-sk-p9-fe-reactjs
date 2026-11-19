import { useState } from 'react'
import ModalShell from '../../../components/ModalShell.jsx'
import MarkdownViewer from '../../../components/MarkdownViewer.jsx'
import useInput from '../../../hooks/useInput.js'
import { CATEGORIES, aiGenerate, createPost } from '../api/blogApi.js'

const INITIAL = { topic: '', category: '', use_search: true }

export default function AiPostGeneratorModal({ open, onClose, onSaved }) {
  const [values, onChange] = useInput(INITIAL)
  const [draft, setDraft] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const generate = async () => {
    if (!values.topic.trim()) {
      setError('Topik wajib diisi')
      return
    }
    setBusy(true)
    setError('')
    try {
      setDraft(await aiGenerate({ topic: values.topic.trim(), category: values.category, use_search: values.use_search }))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    setBusy(true)
    try {
      await createPost({ title: draft.title, category: draft.category, excerpt: draft.excerpt, content: draft.content, is_published: false })
      onSaved('Draf AI disimpan sebagai draf')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell
      title="AI Blog Generator"
      size="full"
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
          <button type="button" className="btn btn-primary" onClick={save} disabled={!draft || busy}>Simpan</button>
        </>
      )}
    >
      <div className="space-y-4">
        {error && <p role="alert" className="alert-error">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="ai-topic" className="mb-1 block font-medium">Topik artikel</label>
            <input id="ai-topic" name="topic" className="input" placeholder="Contoh: Perkembangan AI di pendidikan" value={values.topic} onChange={onChange} />
          </div>
          <div>
            <label htmlFor="ai-category" className="mb-1 block font-medium">Kategori</label>
            <select id="ai-category" name="category" className="input" value={values.category} onChange={onChange}>
              <option value="">Otomatis</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 font-medium">
          <input type="checkbox" name="use_search" checked={values.use_search} onChange={onChange} className="h-4 w-4" />
          Gunakan penelusuran Search Engine untuk fakta terkini
        </label>
        <button type="button" className="btn btn-primary" onClick={generate} disabled={busy}>{busy ? 'Memproses...' : 'Generate Draf'}</button>

        {draft && (
          <section aria-label="Hasil draf" className="card p-4">
            <h3 className="m-0 text-xl font-bold">{draft.title}</h3>
            <p className="muted">{draft.category} &middot; {draft.excerpt}</p>
            {draft.sources?.length > 0 && (
              <>
                <h4 className="font-bold">Sumber rujukan</h4>
                <ul>
                  {draft.sources.map((s) => (
                    <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title || s.url}</a></li>
                  ))}
                </ul>
              </>
            )}
            <MarkdownViewer content={draft.content} />
          </section>
        )}
      </div>
    </ModalShell>
  )
}
