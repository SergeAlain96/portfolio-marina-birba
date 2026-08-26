import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TbLock, TbMapPinFilled, TbMenu2, TbX } from 'react-icons/tb'

const links = [
  { to: '#home', label: 'Accueil' },
  { to: '#about', label: 'À propos' },
  { to: '#experience', label: 'Expériences' },
  { to: '#projects', label: 'Projets' },
  { to: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary/5">
      <div className="flex items-center justify-between px-6 py-4">
        <a
          href="#home"
          onClick={() => setOpen(false)}
          aria-label="Retour à l'accueil"
          className="flex items-center text-accent hover:opacity-80 transition-opacity"
        >
          <TbMapPinFilled size={22} />
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="py-1 text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/admin"
            aria-label="Connexion administration"
            title="Connexion administration"
            className="text-secondary/40 hover:text-primary transition-colors"
          >
            <TbLock size={18} />
          </Link>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/admin"
            aria-label="Connexion administration"
            title="Connexion administration"
            className="text-secondary/40 hover:text-primary transition-colors"
          >
            <TbLock size={20} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            className="text-secondary"
          >
            {open ? <TbX size={24} /> : <TbMenu2 size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden flex flex-col border-t border-secondary/5 px-6 py-2">
          {links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
