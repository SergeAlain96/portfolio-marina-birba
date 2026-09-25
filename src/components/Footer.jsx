export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="h-1 bg-accent" />
      <div className="bg-secondary text-white text-center py-6">
        <p>© {new Date().getFullYear()} Marina Birba — Tous droits réservés.</p>
      </div>
    </footer>
  )
}
