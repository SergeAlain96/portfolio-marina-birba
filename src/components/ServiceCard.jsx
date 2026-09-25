import { motion } from 'framer-motion'
import {
  TbBriefcase,
  TbChartDots3,
  TbCode,
  TbDatabase,
  TbMap,
  TbPalette,
  TbSettings,
  TbSparkles,
  TbTopologyStar3,
} from 'react-icons/tb'

const serviceIcons = {
  briefcase: TbBriefcase,
  map: TbMap,
  chart: TbChartDots3,
  code: TbCode,
  palette: TbPalette,
  database: TbDatabase,
  settings: TbSettings,
  sparkles: TbSparkles,
}

export default function ServiceCard({ service }) {
  const Icon = serviceIcons[service.icon] || TbTopologyStar3

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="card-lift bg-white rounded-2xl shadow-sm border-t-2 border-accent overflow-hidden flex flex-col"
    >
      {service.image_url ? (
        <img
          src={service.image_url}
          alt=""
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-32 bg-accent/10 text-accent">
          <Icon size={52} strokeWidth={1.3} />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start gap-3">
          {service.image_url && (
            <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-accent/10 text-accent">
              <Icon size={21} />
            </span>
          )}
          <h3 className="text-lg font-semibold text-secondary">{service.title}</h3>
        </div>
        <p className="mt-3 text-sm text-text/70 flex-1 whitespace-pre-line">{service.description}</p>
      </div>
    </motion.article>
  )
}
