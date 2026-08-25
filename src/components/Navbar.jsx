import { TbMapPinFilled } from 'react-icons/tb'

const links = [
  { to: '#home', label: 'Accueil' },
  { to: '#about', label: 'À propos' },
  { to: '#experience', label: 'Expériences' },
  { to: '#projects', label: 'Projets' },
  { to: '#contact', label: 'Contact' },
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-secondary/5">
      <a href="#home" className="flex items-center gap-2 font-bold text-secondary">
        <TbMapPinFilled className="text-accent" size={20} />
        Marina Birba
      </a>
      <div className="flex gap-6">
        {links.map((link) => (
          <a
            key={link.to}
            href={link.to}
            className="relative py-1 text-sm font-medium text-secondary hover:text-primary transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
