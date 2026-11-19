import ModalShell from '../../../components/ModalShell.jsx'
import AuthForm from '../components/AuthForm.jsx'

/** Modal login (mis. saat sesi berakhir). Input memakai id="login-username". */
export default function AuthModal({ open, message, onClose, onAuthenticated }) {
  if (!open) return null
  return (
    <ModalShell title="Masuk Kembali" onClose={onClose}>
      {message && <p className="muted mb-4">{message}</p>}
      <AuthForm mode="login" onSuccess={onAuthenticated} />
    </ModalShell>
  )
}
