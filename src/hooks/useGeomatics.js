import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const sectionFields = 'id, label, title, intro, detail, note, pillars, fields_title, fields'

export function useGeomatics() {
  const [section, setSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadSection() {
      const { data, error: requestError } = await supabase
        .from('geomatics')
        .select(sectionFields)
        .limit(1)
        .maybeSingle()

      if (!mounted) return
      if (requestError) {
        setError('La section géomatique ne peut pas être chargée pour le moment.')
      } else {
        setError('')
        setSection(data)
      }
      setLoading(false)
    }

    loadSection()

    const handleFocus = () => loadSection()
    window.addEventListener('focus', handleFocus)

    return () => {
      mounted = false
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return { section, loading, error }
}
