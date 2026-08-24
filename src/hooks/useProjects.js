import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*, project_images(*)')
      .order('project_date', { ascending: false })
      .then(({ data }) => {
        setProjects(data ?? [])
        setLoading(false)
      })
  }, [])

  return { projects, loading }
}
