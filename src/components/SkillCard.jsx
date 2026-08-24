export default function SkillCard({ category, skills }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-secondary mb-3">{category}</h3>
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
