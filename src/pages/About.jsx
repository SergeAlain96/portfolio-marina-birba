import { useProfile } from '../hooks/useProfile'
import { useSkills } from '../hooks/useSkills'
import SkillCard from '../components/SkillCard'

export default function About() {
  const { profile, loading } = useProfile()
  const { skillsByCategory } = useSkills()

  if (loading) return null

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-6">À propos</h1>
      {profile?.bio && <p className="whitespace-pre-line">{profile.bio}</p>}

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
    </section>
  )
}
