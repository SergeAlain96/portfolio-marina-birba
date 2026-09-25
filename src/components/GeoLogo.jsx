/**
 * Logo geomatique : globe quadrille (meridiens + paralleles) avec un
 * point de releve. Dessine en courant de couleur, donc il suit la
 * couleur du texte parent.
 */
export default function GeoLogo({ className = '', size = 22 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      {/* paralleles */}
      <path d="M3.4 9.2h17.2M3.4 14.8h17.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* meridiens */}
      <ellipse cx="12" cy="12" rx="4.2" ry="9" stroke="currentColor" strokeWidth="1.2" />
      {/* point de releve, en vert pour rappeler la palette */}
      <circle cx="15.4" cy="9.2" r="2.1" fill="var(--color-accent)" />
      <circle cx="15.4" cy="9.2" r="2.1" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  )
}
