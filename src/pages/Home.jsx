import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfile } from '../hooks/useProfile'

export default function Home() {
  const { profile, loading } = useProfile()

  if (loading) return null

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {profile?.photo_url && (
          <img
            src={profile.photo_url}
            alt={profile.fullname}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-6 shadow-md"
          />
        )}
        <h1 className="text-4xl font-bold text-secondary">
          {profile?.fullname || 'Marina Birba'}
        </h1>
        <p className="text-lg mt-2 text-primary font-medium">
          {profile?.title || 'Ingénieure Géomaticienne'}
        </p>
        {profile?.bio && <p className="mt-4 max-w-xl mx-auto">{profile.bio}</p>}

        <div className="flex justify-center gap-4 mt-8">
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
    </section>
  )
}
