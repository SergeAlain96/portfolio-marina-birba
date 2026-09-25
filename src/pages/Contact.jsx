import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLinkedin, FiPhone } from 'react-icons/fi'
import { TbBrandWhatsapp } from 'react-icons/tb'
import { supabase } from '../services/supabase'
import { useProfile } from '../hooks/useProfile'
import AmbientBackground from '../components/AmbientBackground'

const emptyForm = { name: '', email: '', subject: '', message: '' }

function toWhatsappLink(number) {
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}`
}

function ContactItem({ icon: Icon, label, value, href, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-secondary/8 hover:border-accent/40 hover:shadow-sm transition-all"
    >
      <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-secondary/45">
          {label}
        </span>
        <span className="block text-sm font-medium text-secondary truncate">{value}</span>
      </span>
    </a>
  )
}

export default function Contact() {
  const { profile } = useProfile()
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [sentVia, setSentVia] = useState(null)

  const phones = profile?.phone ? profile.phone.split('/').map((n) => n.trim()).filter(Boolean) : []
  const whatsapps = profile?.whatsapp
    ? profile.whatsapp.split('/').map((n) => n.trim()).filter(Boolean)
    : []

  function buildMessageText() {
    return [
      'Bonjour,',
      '',
      `Nom : ${form.name}`,
      `Email : ${form.email}`,
      `Sujet : ${form.subject}`,
      '',
      form.message,
    ].join('\n')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const { error } = await supabase.from('messages').insert(form)
    if (error) {
      setStatus('error')
      return
    }
    setForm(emptyForm)
    setSentVia(null)
    setStatus('sent')
  }

  async function handleDeliver(channel) {
    const body = encodeURIComponent(buildMessageText())
    setStatus('sending')
    const { error } = await supabase.from('messages').insert(form)
    if (error) {
      setStatus('error')
      return
    }
    setForm(emptyForm)
    setSentVia(channel)
    setStatus('sent')

    window.open(`${toWhatsappLink(whatsapps[0])}?text=${body}`, '_blank', 'noopener')
  }

  return (
    <section id="contact" className="relative overflow-hidden scroll-mt-20">
      <AmbientBackground />
      <div className="relative max-w-5xl mx-auto px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-3xl font-bold text-secondary"
        >
          Contact
        </motion.h1>
        <p className="text-text/60 mt-2 mb-8">
          Une question, une collaboration ? Écrivez-moi, je réponds rapidement.
        </p>

        <div className="grid md:grid-cols-[1.25fr_1fr] gap-8 items-start">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-3"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                required
                placeholder="Nom"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <input
              required
              placeholder="Sujet"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              required
              rows={6}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white border border-secondary/10 outline-none focus:ring-2 focus:ring-primary resize-y"
            />
            <div className="flex flex-wrap items-center gap-3">
              {whatsapps.length > 0 && (
                <button
                  type="button"
                  disabled={status === 'sending'}
                  onClick={(e) => {
                    if (!e.currentTarget.form.reportValidity()) return
                    handleDeliver('whatsapp')
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <TbBrandWhatsapp />
                  Envoyer via WhatsApp
                </button>
              )}
              {whatsapps.length === 0 && (
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {status === 'sending' ? 'Envoi...' : 'Envoyer le message'}
                </button>
              )}
            </div>
            {status === 'sent' && (
              <p className="text-accent text-sm font-medium">
                {sentVia === 'whatsapp' ? 'Message envoyé via WhatsApp, merci !' : 'Message envoyé, merci !'}
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-sm font-medium">Erreur lors de l'envoi, réessayez.</p>
            )}
            <p className="text-text/50 text-xs">
              Votre message est aussi enregistré dans mon espace administrateur.
            </p>
          </motion.form>

          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-col gap-2.5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary/45 mb-0.5">
                Coordonnées directes
              </p>

              {phones.map((number) => (
                <ContactItem
                  key={`tel-${number}`}
                  icon={FiPhone}
                  label="Téléphone"
                  value={number}
                  href={`tel:${number.replace(/[^0-9+]/g, '')}`}
                />
              ))}

              {whatsapps.map((number) => (
                <ContactItem
                  key={`wa-${number}`}
                  icon={TbBrandWhatsapp}
                  label="WhatsApp"
                  value={number}
                  href={toWhatsappLink(number)}
                  external
                />
              ))}

              {profile.email && (
                <ContactItem
                  icon={FiMail}
                  label="Email"
                  value={profile.email}
                  href={`mailto:${profile.email}`}
                />
              )}

              {profile.linkedin && (
                <ContactItem
                  icon={FiLinkedin}
                  label="LinkedIn"
                  value="Voir le profil"
                  href={profile.linkedin}
                  external
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
