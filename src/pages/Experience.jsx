import { motion } from 'framer-motion'
import { TbRoute } from 'react-icons/tb'
import { useExperiences } from '../hooks/useExperiences'
import { useEducation } from '../hooks/useEducation'
import ExperienceCard from '../components/ExperienceCard'

export default function Experience() {
  const { experiences, loading: loadingExp } = useExperiences()
  const { education, loading: loadingEdu } = useEducation()

  return (
    <section id="experience" className="max-w-3xl mx-auto px-6 py-16 scroll-mt-20">
      <h1 className="flex items-center gap-2 text-3xl font-bold text-secondary mb-10">
        <TbRoute className="text-accent" />
        Expériences Professionnelles
      </h1>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-accent/30" />
        <div className="flex flex-col gap-8">
          {!loadingExp &&
            experiences.map((experience) => (
              <div key={experience.id} className="relative pl-8">
                <span className="absolute left-0 top-2 w-4 h-4 rounded-full bg-accent ring-4 ring-background" />
                <ExperienceCard experience={experience} />
              </div>
            ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-secondary mt-16 mb-6">Formations</h2>
      <div className="flex flex-col gap-4">
        {!loadingEdu &&
          education.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-accent"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold text-secondary">{item.degree}</h3>
                <span className="coord-label text-sm text-primary font-medium">{item.year}</span>
              </div>
              <p className="text-sm font-medium mt-1">
                {item.institution}
                {item.country ? ` · ${item.country}` : ''}
              </p>
            </motion.div>
          ))}
      </div>
    </section>
  )
}
