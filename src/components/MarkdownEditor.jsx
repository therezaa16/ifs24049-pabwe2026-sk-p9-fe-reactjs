import { useEffect, useRef } from 'react'

/** Wrapper Toast UI Editor (Markdown + preview tab); pustaka dimuat malas. */
export default function MarkdownEditor({ value, onChange, theme = 'light', height = '55vh' }) {
  const ref = useRef(null)
  const editorRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const initialValue = useRef(value)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [{ default: Editor }] = await Promise.all([
        import('@toast-ui/editor'),
        import('@toast-ui/editor/dist/toastui-editor.css'),
        import('@toast-ui/editor/dist/theme/toastui-editor-dark.css'),
      ])
      if (cancelled || !ref.current) return
      const editor = new Editor({
        el: ref.current,
        height,
        initialEditType: 'markdown',
        previewStyle: 'tab',
        theme: theme === 'dark' ? 'dark' : 'light',
        initialValue: initialValue.current || '',
        usageStatistics: false,
        events: { change: () => onChangeRef.current?.(editor.getMarkdown()) },
      })
      editorRef.current = editor
    })()
    return () => {
      cancelled = true
      editorRef.current?.destroy?.()
      editorRef.current = null
    }
  }, [height, theme])

  // Sinkronkan perubahan nilai dari luar (mis. draf AI).
  useEffect(() => {
    const editor = editorRef.current
    if (editor && editor.getMarkdown() !== (value || '')) editor.setMarkdown(value || '')
  }, [value])

  return <div ref={ref} data-testid="markdown-editor" />
}
