import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TbLock, TbMenu2, TbX } from 'react-icons/tb'

const links = [
  { id: 'home', label: 'Accueil' },
  { id: 'about', label: 'À propos' },
  { id: 'experience', label: 'Expériences' },
  { id: 'projects', label: 'Projets' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Met en evidence le lien de la section actuellement a l'ecran
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_20px_-8px_rgba(13,71,161,0.25)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#home"
          onClick={() => setOpen(false)}
          aria-label="Retour à l'accueil"
          className="group flex items-center gap-2.5"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary text-white text-sm font-bold tracking-tight transition-transform group-hover:scale-105">
            MB
          </span>
          <span className="hidden sm:block h-5 w-px bg-secondary/15" />
          <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary/50">
            Portfolio Professionnel
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                active === link.id
                  ? 'text-primary'
                  : 'text-secondary/70 hover:text-secondary hover:bg-secondary/5'
              }`}
            >
              {link.label}
              {active === link.id && (
                <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-accent" />
              )}
            </a>
          ))}
          <span className="mx-2 h-5 w-px bg-secondary/10" />
          <Link
            to="/admin"
            aria-label="Connexion administration"
            title="Connexion administration"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-secondary/35 hover:text-primary hover:bg-secondary/5 transition-colors"
          >
            <TbLock size={17} />
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/admin"
            aria-label="Connexion administration"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-secondary/35 hover:text-primary transition-colors"
          >
            <TbLock size={18} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-secondary hover:bg-secondary/5 transition-colors"
          >
            {open ? <TbX size={22} /> : <TbMenu2 size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-secondary/5 px-6 py-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center py-3 text-sm font-medium border-l-2 pl-4 transition-colors ${
                active === link.id
                  ? 'border-accent text-primary'
                  : 'border-transparent text-secondary/70 hover:text-secondary'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
