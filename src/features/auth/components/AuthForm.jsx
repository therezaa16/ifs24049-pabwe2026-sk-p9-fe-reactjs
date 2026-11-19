import { useState } from 'react'
import useInput from '../../../hooks/useInput.js'
import { login, register } from '../api/authApi.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Form login/registrasi bersama (dipakai AuthPage dan AuthModal). */
export default function AuthForm({ mode = 'login', onSuccess }) {
  const isLogin = mode === 'login'
  const [values, onChange] = useInput({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!values.username.trim()) return 'Username wajib diisi'
    if (!isLogin && !EMAIL_RE.test(values.email)) return 'Format email tidak valid'
    if (!values.password) return 'Password wajib diisi'
    if (!isLogin && values.password.length < 6) return 'Password minimal 6 karakter'
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    const message = validate()
    setError(message)
    if (message) return
    setLoading(true)
    try {
      const result = isLogin
        ? await login({ username: values.username.trim(), password: values.password })
        : await register({ username: values.username.trim(), email: values.email.trim(), password: values.password })
      onSuccess(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const prefix = isLogin ? 'login' : 'register'

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {error && <p role="alert" className="alert-error">{error}</p>}
      <div>
        <label htmlFor={`${prefix}-username`} className="mb-1 block font-medium">{isLogin ? 'Username atau email' : 'Username'}</label>
        <input id={`${prefix}-username`} name="username" className="input" autoComplete="username" value={values.username} onChange={onChange} />
      </div>
      {!isLogin && (
        <div>
          <label htmlFor="register-email" className="mb-1 block font-medium">Email</label>
          <input id="register-email" name="email" type="email" className="input" autoComplete="email" value={values.email} onChange={onChange} />
        </div>
      )}
      <div>
        <label htmlFor={`${prefix}-password`} className="mb-1 block font-medium">Password</label>
        <input id={`${prefix}-password`} name="password" type="password" className="input" autoComplete={isLogin ? 'current-password' : 'new-password'} value={values.password} onChange={onChange} />
      </div>
      <button id={`${prefix}-submit`} type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
      </button>
    </form>
  )
}
