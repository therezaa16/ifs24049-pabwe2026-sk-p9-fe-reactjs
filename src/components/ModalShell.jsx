import { useEffect, useId, useRef } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Kerangka modal aksesibel: role=dialog, aria-modal, Esc untuk menutup,
 * jebakan fokus, pemulihan fokus, header & footer berwarna kontras.
 */
export default function ModalShell({ title, onClose, footer, size = 'md', children }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previous = document.activeElement
    const dialog = dialogRef.current
    const first = dialog.querySelector('input,select,textarea') || dialog.querySelector(FOCUSABLE)
    first?.focus()
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...dialog.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) return
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault()
        firstItem.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [])

  const sizeClass = size === 'full' ? 'h-[94vh] w-full max-w-[96vw]' : 'w-full max-w-md'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`card flex max-h-[96vh] flex-col overflow-hidden shadow-2xl ${sizeClass}`}>
        <div className="modal-header flex items-center justify-between px-5 py-3">
          <h2 id={titleId} className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup dialog" className="rounded px-2 text-2xl leading-none text-white">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="modal-footer flex justify-end gap-2 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}
