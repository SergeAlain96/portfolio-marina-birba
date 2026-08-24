import { useExperiences } from '../hooks/useExperiences'
import { useEducation } from '../hooks/useEducation'
import ExperienceCard from '../components/ExperienceCard'

export default function Experience() {
  const { experiences, loading: loadingExp } = useExperiences()
  const { education, loading: loadingEdu } = useEducation()

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-6">Expériences Professionnelles</h1>
      <div className="flex flex-col gap-4">
        {!loadingExp &&
          experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
      </div>

      <h2 className="text-2xl font-bold text-secondary mt-16 mb-6">Formations</h2>
      <div className="flex flex-col gap-4">
        {!loadingEdu &&
          education.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-secondary">{item.degree}</h3>
                <span className="text-sm text-primary font-medium">{item.year}</span>
              </div>
              <p className="text-sm font-medium mt-1">
                {item.institution}
                {item.country ? ` · ${item.country}` : ''}
              </p>
            </div>
          ))}
      </div>
    </section>
  )
}
