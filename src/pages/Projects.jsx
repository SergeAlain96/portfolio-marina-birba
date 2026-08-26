import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'

export default function Projects() {
  const { projects, loading } = useProjects()
  const [selected, setSelected] = useState(null)

  return (
    <section id="projects" className="bg-white scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-3xl font-bold text-secondary mb-6"
        >
          Projets
        </motion.h1>
        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={setSelected} />
            ))}
          </div>
        )}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
