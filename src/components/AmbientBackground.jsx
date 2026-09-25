/**
 * Halos flous qui derivent lentement en arriere-plan d'une section.
 * Purement decoratif : aucun contenu, ignore par les lecteurs d'ecran,
 * et immobile si le systeme demande de reduire les animations.
 */
export default function AmbientBackground({ variant = 'default' }) {
  const positions =
    variant === 'alt'
      ? ['-top-24 -right-16 w-80 h-80', 'bottom-0 -left-20 w-72 h-72']
      : ['-top-32 -left-16 w-96 h-96', 'bottom-[-6rem] right-[-4rem] w-80 h-80']

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute ${positions[0]} rounded-full bg-primary/10 blur-3xl animate-drift-a`}
      />
      <div
        className={`absolute ${positions[1]} rounded-full bg-accent/10 blur-3xl animate-drift-b`}
      />
    </div>
  )
}
