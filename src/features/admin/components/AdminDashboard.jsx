import { useEffect, useState } from 'react'
import { listAllPosts, listUsers } from '../api/adminApi.js'
import { formatDate } from '../../../helpers/toolsHelper.js'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Panel Admin - Delcom Blog'
    Promise.all([listUsers(), listAllPosts()])
      .then(([u, p]) => {
        setUsers(u)
        setPosts(p)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const totalPublished = users.reduce((sum, u) => sum + u.total_published, 0)
  const cards = [
    { label: 'Total Pengguna', value: users.length },
    { label: 'Total Artikel', value: posts.length },
    { label: 'Total Terbit', value: totalPublished },
  ]

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold">Panel Administrasi</h1>
      {error && <p role="alert" className="alert-error mb-4">{error}</p>}
      {loading ? (
        <p role="status" className="muted">Memuat data...</p>
      ) : (
        <>
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-3" aria-label="Ringkasan sistem">
            {cards.map((c) => (
              <li key={c.label} className="card p-5">
                <p className="muted m-0 font-medium">{c.label}</p>
                <p className="m-0 text-4xl font-extrabold">{c.value}</p>
              </li>
            ))}
          </ul>

          <h2 className="mb-3 mt-8 text-xl font-bold">Direktori Pengguna</h2>
          <div className="card overflow-x-auto" role="region" aria-label="Tabel pengguna" tabIndex={0}>
            <table className="table">
              <caption className="sr-only">Daftar seluruh pengguna</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th><th scope="col">Username</th><th scope="col">Email</th>
                  <th scope="col">Role</th><th scope="col">Total Artikel</th><th scope="col">Total Terbit</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td><td>{u.username}</td><td>{u.email}</td><td>{u.role}</td>
                    <td>{u.total_articles}</td><td>{u.total_published}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mb-3 mt-8 text-xl font-bold">Semua Artikel</h2>
          <div className="card overflow-x-auto" role="region" aria-label="Tabel seluruh artikel" tabIndex={0}>
            <table className="table">
              <caption className="sr-only">Arsip seluruh artikel semua penulis</caption>
              <thead>
                <tr>
                  <th scope="col">Judul</th><th scope="col">Penulis</th><th scope="col">Kategori</th>
                  <th scope="col">Status</th><th scope="col">Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td className="font-semibold">{p.title}</td>
                    <td>{p.author_name}</td>
                    <td>{p.category}</td>
                    <td><span className={`badge ${p.is_published ? 'badge-ok' : 'badge-draft'}`}>{p.is_published ? 'Terbit' : 'Draf'}</span></td>
                    <td>{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
