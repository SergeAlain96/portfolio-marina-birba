import { motion } from 'framer-motion'

function formatDate(date) {
  if (!date) return 'Présent'
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}

export default function ExperienceCard({ experience }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-secondary">{experience.title}</h3>
        <span className="text-sm text-primary font-medium">
          {formatDate(experience.start_date)} — {formatDate(experience.end_date)}
        </span>
      </div>
      <p className="text-sm font-medium mt-1">
        {experience.company}
        {experience.location ? ` · ${experience.location}` : ''}
      </p>
      {experience.description && <p className="mt-3 text-sm">{experience.description}</p>}
    </motion.div>
  )
}
