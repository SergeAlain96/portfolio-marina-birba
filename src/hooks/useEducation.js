import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export function useEducation() {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('education')
      .select('*')
      .order('year', { ascending: false })
      .then(({ data }) => {
        setEducation(data ?? [])
        setLoading(false)
      })
  }, [])

  return { education, loading }
}
