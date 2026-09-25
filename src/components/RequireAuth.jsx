import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RequireAuth({ children }) {
  const { session, loading, isAdmin } = useAuth()

  if (loading) return null
  if (!session || !isAdmin) return <Navigate to="/admin" replace />

  return children
}
