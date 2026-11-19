import { useEffect, useRef } from 'react'

/** Wrapper Toast UI Viewer; pustaka dimuat malas (dynamic import). */
export default function MarkdownViewer({ content }) {
  const ref = useRef(null)

  useEffect(() => {
    let cancelled = false
    let viewer = null
    ;(async () => {
      const [{ default: Viewer }] = await Promise.all([
        import('@toast-ui/editor/dist/toastui-editor-viewer'),
        import('@toast-ui/editor/dist/toastui-editor-viewer.css'),
      ])
      if (cancelled || !ref.current) return
      viewer = new Viewer({ el: ref.current, initialValue: content || '' })
    })()
    return () => {
      cancelled = true
      viewer?.destroy?.()
    }
  }, [content])

  return <div ref={ref} className="prose-box" data-testid="markdown-viewer" />
}
