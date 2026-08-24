import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfile } from '../hooks/useProfile'
import TopoLines from '../components/TopoLines'

export default function Home() {
  const { profile, loading } = useProfile()

  if (loading) return null

  return (
    <section className="map-grid relative overflow-hidden px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="coord-label inline-block text-xs font-semibold text-primary uppercase mb-4">
            SIG · Cartographie · Télédétection
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
            {profile?.fullname || 'Marina Birba'}
          </h1>
          <p className="text-lg mt-3 text-primary font-medium">
            {profile?.title || 'Ingénieure Géomaticienne'}
          </p>
          {profile?.bio && <p className="mt-5 max-w-lg">{profile.bio}</p>}

          <div className="flex flex-wrap gap-4 mt-8">
            {profile?.cv_url && (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Télécharger CV
              </a>
            )}
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex justify-center"
        >
          <TopoLines className="absolute inset-0 w-full h-full text-primary/15 -z-10" />
          {profile?.photo_url ? (
            <img
              src={profile.photo_url}
              alt={profile.fullname}
              className="w-56 h-56 md:w-72 md:h-72 rounded-full object-cover shadow-xl ring-4 ring-white"
            />
          ) : (
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white/60 ring-4 ring-white shadow-xl" />
          )}
          <span className="coord-label absolute -bottom-2 bg-secondary text-white text-xs px-3 py-1 rounded-full">
            12.3714° N, 1.5197° W — Ouagadougou
          </span>
        </motion.div>
      </div>
    </section>
  )
}
