import { useState } from 'react'
import { FiMail, FiPhone, FiLinkedin } from 'react-icons/fi'
import { supabase } from '../services/supabase'
import { useProfile } from '../hooks/useProfile'

const emptyForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { profile } = useProfile()
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await supabase.from('messages').insert(form)
    if (error) {
      setStatus('error')
      return
    }
    setForm(emptyForm)
    setStatus('sent')
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-6">Contact</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          required
          placeholder="Sujet"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          required
          rows={5}
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="self-start px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'sending' ? 'Envoi...' : 'Envoyer'}
        </button>
        {status === 'sent' && <p className="text-primary font-medium">Message envoyé, merci !</p>}
        {status === 'error' && (
          <p className="text-red-600 font-medium">Erreur lors de l'envoi, réessayez.</p>
        )}
      </form>

      {profile && (
        <div className="flex flex-col gap-3 mt-10 text-sm">
          {profile.phone && (
            <span className="flex items-center gap-2">
              <FiPhone className="text-primary" /> {profile.phone}
            </span>
          )}
          {profile.email && (
            <span className="flex items-center gap-2">
              <FiMail className="text-primary" /> {profile.email}
            </span>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-primary"
            >
              <FiLinkedin className="text-primary" /> LinkedIn
            </a>
          )}
        </div>
      )}
    </section>
  )
}
