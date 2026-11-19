import { useEffect } from 'react'
import AuthForm from './AuthForm.jsx'

export default function AuthPage({ mode = 'login', onAuthenticated, onNavigate }) {
  const isLogin = mode === 'login'

  useEffect(() => {
    document.title = isLogin ? 'Masuk - Delcom Blog' : 'Daftar - Delcom Blog'
  }, [isLogin])

  const target = isLogin ? '/register' : '/login'

  return (
    <section className="mx-auto w-full max-w-md px-4 py-10">
      <div className="card p-6">
        <h1 className="mb-1 text-2xl font-bold">{isLogin ? 'Masuk ke Delcom Blog' : 'Daftar Akun Penulis'}</h1>
        <p className="muted mb-5">{isLogin ? 'Gunakan akun Anda untuk mengelola artikel.' : 'Buat akun untuk mulai menulis artikel.'}</p>
        <AuthForm key={mode} mode={mode} onSuccess={onAuthenticated} />
        <p className="mt-5 text-center">
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <a href={target} onClick={(e) => { e.preventDefault(); onNavigate(target) }} className="font-semibold underline">
            {isLogin ? 'Daftar' : 'Masuk'}
          </a>
        </p>
      </div>
    </section>
  )
}
