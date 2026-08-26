import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbCalendar, TbDownload, TbPhoto, TbX } from 'react-icons/tb'

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export default function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!project) return

    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-secondary/60 backdrop-blur-sm p-4 sm:p-8"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl my-auto bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-secondary shadow-sm hover:bg-white transition-colors"
            >
              <TbX size={20} />
            </button>

            {project.cover_image && (
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-56 sm:h-72 object-cover"
              />
            )}

            <div className="p-6 sm:p-8">
              <h2
                id="project-modal-title"
                className={`text-2xl font-bold text-secondary ${project.cover_image ? '' : 'pr-12'}`}
              >
                {project.title}
              </h2>

              {project.project_date && (
                <p className="coord-label flex items-center gap-2 text-sm text-accent font-medium mt-2">
                  <TbCalendar size={16} />
                  {formatDate(project.project_date)}
                </p>
              )}

              {project.description && (
                <p className="mt-5 whitespace-pre-line leading-relaxed">{project.description}</p>
              )}

              {project.project_images?.length > 0 && (
                <div className="mt-8">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase text-secondary/60 mb-3">
                    <TbPhoto size={16} className="text-accent" />
                    Galerie
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.project_images.map((image) => (
                      <a
                        key={image.id}
                        href={image.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-xl"
                      >
                        <img
                          src={image.image_url}
                          alt=""
                          className="w-full h-28 object-cover hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {project.document_url && (
                <a
                  href={project.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-5 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <TbDownload size={18} />
                  Télécharger le document
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
