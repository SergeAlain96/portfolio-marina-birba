import { Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'À propos' },
  { to: '/experience', label: 'Expériences' },
  { to: '/projects', label: 'Projets' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md">
      <span className="font-bold text-secondary">Marina Birba</span>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-secondary hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
