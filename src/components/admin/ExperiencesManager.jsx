import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

const emptyForm = {
  title: '',
  company: '',
  location: '',
  start_date: '',
  end_date: '',
  description: '',
}

export default function ExperiencesManager() {
  const [experiences, setExperiences] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  async function refresh() {
    const { data } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false })
    setExperiences(data ?? [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('experiences').update(form).eq('id', editingId)
    } else {
      await supabase.from('experiences').insert(form)
    }
    setForm(emptyForm)
    setEditingId(null)
    refresh()
  }

  function handleEdit(experience) {
    setEditingId(experience.id)
    setForm({
      title: experience.title || '',
      company: experience.company || '',
      location: experience.location || '',
      start_date: experience.start_date || '',
      end_date: experience.end_date || '',
      description: experience.description || '',
    })
  }

  async function handleDelete(id) {
    await supabase.from('experiences').delete().eq('id', id)
    refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <input
          required
          placeholder="Poste"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          required
          placeholder="Structure"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          placeholder="Localisation"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-4">
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary flex-1"
          />
          <input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary flex-1"
          />
        </div>
        <textarea
          rows={4}
          placeholder="Missions réalisées"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
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

      <div className="flex flex-col gap-3">
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-background rounded-2xl border border-secondary/10 p-4 flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold text-secondary">{experience.title}</p>
              <p className="text-sm">{experience.company}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(experience)} className="text-primary text-sm font-medium">
                Modifier
              </button>
              <button onClick={() => handleDelete(experience.id)} className="text-red-600 text-sm font-medium">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
