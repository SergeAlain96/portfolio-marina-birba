import { motion } from 'framer-motion'
import { TbDatabase, TbGps, TbMap, TbSettings } from 'react-icons/tb'
import { useGeomatics } from '../hooks/useGeomatics'

const pillarIcons = {
  gps: TbGps,
  settings: TbSettings,
  database: TbDatabase,
  map: TbMap,
}

export default function Geomatics() {
  const { section, loading, error } = useGeomatics()

  if (loading) return null
  if (error || !section) return null

  const pillars = Array.isArray(section.pillars) ? section.pillars : []
  const fields = Array.isArray(section.fields) ? section.fields : []
  const hasFieldsBlock = Boolean(section.fields_title) && fields.length > 0
  const hasBlocks = pillars.length > 0 || hasFieldsBlock

  return (
    <section id="geomatique" className="relative overflow-hidden scroll-mt-20">
      <div className="relative max-w-3xl mx-auto px-6 py-16">
        {section.label && (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="coord-label inline-block text-xs font-semibold text-accent uppercase mb-4"
          >
            {section.label}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-3xl font-bold text-secondary mb-6"
        >
          {section.title}
        </motion.h1>

        <div className={hasBlocks ? 'mb-12' : ''}>
          {section.intro && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="text-lg mb-4 text-justify hyphens-auto"
            >
              {section.intro}
            </motion.p>
          )}

          {section.detail && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="text-text/70 mb-4 text-justify hyphens-auto"
            >
              {section.detail}
            </motion.p>
          )}

          {section.note && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="text-text/60 text-sm text-justify hyphens-auto"
            >
              {section.note}
            </motion.p>
          )}
        </div>

        {pillars.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {pillars.map((pillar, index) => {
              const Icon = pillarIcons[pillar.icon] || TbMap
              return (
                <motion.div
                  key={`${pillar.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="card-lift bg-white rounded-2xl shadow-sm p-6 border-t-2 border-accent"
                >
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-secondary mb-2">
                    <Icon className="text-accent shrink-0" />
                    {pillar.title}
                  </h3>
                  {pillar.text && (
                    <p className="text-sm text-text/70 text-justify hyphens-auto">{pillar.text}</p>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        {hasFieldsBlock && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">{section.fields_title}</h2>
            <div className="flex flex-wrap gap-2">
              {fields.map((field, index) => (
                <span
                  key={`${field}-${index}`}
                  className="px-3 py-1 rounded-full bg-accent/30 text-secondary text-sm font-medium"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
