import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const serviceFields = 'id, title, description, icon, image_url, display_order, created_at, updated_at'

export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    let latestRequest = 0

    async function loadServices() {
      const requestId = ++latestRequest
      try {
        const { data, error: requestError } = await supabase
          .from('services')
          .select(serviceFields)
          .eq('status', 'published')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true })

        if (!mounted || requestId !== latestRequest) return
        if (requestError) {
          setError('Les services ne peuvent pas être chargés pour le moment.')
        } else {
          setError('')
          setServices(data ?? [])
        }
      } catch {
        if (mounted && requestId === latestRequest) {
          setError('Les services ne peuvent pas être chargés pour le moment.')
        }
      } finally {
        if (mounted && requestId === latestRequest) setLoading(false)
      }
    }

    loadServices()

    const channel = supabase
      .channel('public-services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, loadServices)
      .subscribe()

    const handleFocus = () => loadServices()
    window.addEventListener('focus', handleFocus)
    const pollTimer = window.setInterval(loadServices, 15000)

    return () => {
      mounted = false
      window.removeEventListener('focus', handleFocus)
      window.clearInterval(pollTimer)
      supabase.removeChannel(channel)
    }
  }, [])

  return { services, loading, error }
}
