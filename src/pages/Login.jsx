import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { TbArrowLeft } from 'react-icons/tb'
import { supabase } from '../services/supabase'
import { useAuth } from '../hooks/useAuth'
import AmbientBackground from '../components/AmbientBackground'

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-16">
      <AmbientBackground />

      <div className="relative w-full max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary/50 hover:text-secondary transition-colors mb-6"
        >
          <TbArrowLeft size={16} />
          Retour au site
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-secondary/5 p-7">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary text-white text-sm font-bold">
              MB
            </span>
            <h1 className="text-lg font-bold text-secondary">Administration</h1>
          </div>
          <p className="text-sm text-text/55 mb-6">Connecte-toi pour gérer le contenu du site.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              required
              type="password"
              autoComplete="current-password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Connexion...' : 'Se connecter'}
            </button>
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
