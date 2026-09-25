import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export function useSkills() {
  const [skillsByCategory, setSkillsByCategory] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .then(({ data }) => {
        const grouped = (data ?? []).reduce((acc, skill) => {
          const category = skill.category || 'Autres'
          acc[category] = acc[category] ? [...acc[category], skill] : [skill]
          return acc
        }, {})
        setSkillsByCategory(grouped)
        setLoading(false)
      })
  }, [])

  return { skillsByCategory, loading }
}
