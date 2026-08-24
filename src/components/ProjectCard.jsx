import { motion } from 'framer-motion'

export default function ProjectCard({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
    >
      {project.cover_image && (
        <img src={project.cover_image} alt={project.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-secondary">{project.title}</h3>
        {project.project_date && (
          <span className="text-sm text-primary font-medium mt-1">
            {new Date(project.project_date).toLocaleDateString('fr-FR', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
        {project.description && <p className="mt-3 text-sm flex-1">{project.description}</p>}
        <button
          type="button"
          className="mt-4 self-start px-4 py-2 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
        >
          Voir le projet
        </button>
      </div>
    </motion.div>
  )
}
