import { useState } from 'react'
import { supabase } from '../../services/supabase'

export default function PasswordManager() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }
    setPassword('')
    setConfirm('')
    setSuccess(true)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <p className="text-sm text-text/60">
        Choisis un nouveau mot de passe pour la connexion à <span className="font-medium">/admin</span>.
      </p>

      <input
        required
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        required
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        type="submit"
        disabled={saving}
        className="self-start px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? 'Enregistrement...' : 'Changer le mot de passe'}
      </button>

      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      {success && (
        <p className="text-accent text-sm font-medium">Mot de passe changé avec succès.</p>
      )}
    </form>
  )
}
