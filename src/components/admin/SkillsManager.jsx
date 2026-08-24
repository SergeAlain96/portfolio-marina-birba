import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

const emptyForm = { name: '', category: '' }

export default function SkillsManager() {
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  async function refresh() {
    const { data } = await supabase.from('skills').select('*').order('category')
    setSkills(data ?? [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('skills').update(form).eq('id', editingId)
    } else {
      await supabase.from('skills').insert(form)
    }
    setForm(emptyForm)
    setEditingId(null)
    refresh()
  }

  function handleEdit(skill) {
    setEditingId(skill.id)
    setForm({ name: skill.name || '', category: skill.category || '' })
  }

  async function handleDelete(id) {
    await supabase.from('skills').delete().eq('id', id)
    refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <input
          required
          placeholder="Nom de la compétence"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          required
          placeholder="Catégorie (ex: SIG, Télédétection...)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="px-4 py-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {editingId ? 'Modifier' : 'Ajouter'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(emptyForm)
              }}
              className="px-6 py-3 rounded-xl border-2 border-secondary text-secondary font-semibold"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-2xl shadow-sm px-4 py-2 flex items-center gap-3">
            <span className="text-sm">
              <span className="font-semibold text-secondary">{skill.name}</span> · {skill.category}
            </span>
            <button onClick={() => handleEdit(skill)} className="text-primary text-sm font-medium">
              Modifier
            </button>
            <button onClick={() => handleDelete(skill.id)} className="text-red-600 text-sm font-medium">
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
