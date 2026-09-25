import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export function useExperiences() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })
      .then(({ data }) => {
        setExperiences(data ?? [])
        setLoading(false)
      })
  }, [])

  return { experiences, loading }
}
