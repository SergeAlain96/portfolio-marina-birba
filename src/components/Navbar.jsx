import { Link, NavLink } from 'react-router-dom'
import { TbMapPinFilled } from 'react-icons/tb'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/about', label: 'À propos' },
  { to: '/experience', label: 'Expériences' },
  { to: '/projects', label: 'Projets' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-secondary/5">
      <Link to="/" className="flex items-center gap-2 font-bold text-secondary">
        <TbMapPinFilled className="text-primary" size={20} />
        Marina Birba
      </Link>
      <div className="flex gap-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `relative py-1 text-sm font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-secondary hover:text-primary'
              } after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-primary after:transition-all ${
                isActive ? 'after:w-full' : 'after:w-0'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
