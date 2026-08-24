import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { session, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (loading) return null
  if (session) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) {
      setError('Identifiants incorrects')
      return
    }
    navigate('/admin/dashboard')
  }

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold text-secondary mb-6">Connexion Administration</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          required
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? 'Connexion...' : 'Se connecter'}
        </button>
        {error && <p className="text-red-600 font-medium">{error}</p>}
      </form>
    </section>
  )
}
