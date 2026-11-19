import { useCallback, useState } from 'react'

/** State form berbasis objek: const [values, onChange, reset, setValues] = useInput({...}) */
export default function useInput(initial) {
  const [values, setValues] = useState(initial)

  const onChange = useCallback((e) => {
    const { name, type, value, checked } = e.target
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }, [])

  const reset = useCallback((next) => setValues(next ?? initial), [initial])

  return [values, onChange, reset, setValues]
}
