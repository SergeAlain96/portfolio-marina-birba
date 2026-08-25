import { motion } from 'framer-motion'
import { TbChartDots3, TbFileSpreadsheet, TbGps, TbMap, TbSatellite, TbTopologyStar3 } from 'react-icons/tb'

const categoryIcons = {
  SIG: TbMap,
  Télédétection: TbSatellite,
  'Collecte de données': TbGps,
  'Analyse spatiale': TbChartDots3,
  Bureautique: TbFileSpreadsheet,
}

export default function SkillCard({ category, skills }) {
  const Icon = categoryIcons[category] || TbTopologyStar3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-white rounded-2xl shadow-sm p-6 border-t-2 border-accent"
    >
      <h3 className="flex items-center gap-2 text-lg font-semibold text-secondary mb-3">
        <Icon className="text-accent" />
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="px-3 py-1 rounded-full bg-accent/30 text-secondary text-sm font-medium"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
