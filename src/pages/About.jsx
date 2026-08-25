import { motion } from 'framer-motion'
import { useProfile } from '../hooks/useProfile'
import { useSkills } from '../hooks/useSkills'
import SkillCard from '../components/SkillCard'

export default function About() {
  const { profile, loading } = useProfile()
  const { skillsByCategory } = useSkills()

  if (loading) return null

  return (
    <section id="about" className="bg-white scroll-mt-20">
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-3xl font-bold text-secondary mb-6"
      >
        À propos
      </motion.h1>
      {profile?.bio && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="whitespace-pre-line"
        >
          {profile.bio}
        </motion.p>
      )}

      {Object.keys(skillsByCategory).length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-secondary mb-4">Domaines d'expertise</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <SkillCard key={category} category={category} skills={skills} />
            ))}
          </div>
        </div>
      )}
    </div>
    </section>
  )
}
