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
    <div className="bg-white rounded-2xl shadow-sm p-6 border-t-2 border-primary/30">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-secondary mb-3">
        <Icon className="text-primary" />
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
    </div>
  )
}
