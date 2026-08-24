import { useProjects } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
  const { projects, loading } = useProjects()

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-6">Projets</h1>
      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
