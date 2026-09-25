import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

const emptyForm = { degree: '', institution: '', country: '', year: '' }

export default function EducationManager() {
  const [education, setEducation] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  async function refresh() {
    const { data } = await supabase.from('education').select('*').order('year', { ascending: false })
    setEducation(data ?? [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('education').update(form).eq('id', editingId)
    } else {
      await supabase.from('education').insert(form)
    }
    setForm(emptyForm)
    setEditingId(null)
    refresh()
  }

  function handleEdit(item) {
    setEditingId(item.id)
    setForm({
      degree: item.degree || '',
      institution: item.institution || '',
      country: item.country || '',
      year: item.year || '',
    })
  }

  async function handleDelete(id) {
    await supabase.from('education').delete().eq('id', id)
    refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <input
          required
          placeholder="Diplôme"
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          required
          placeholder="Établissement"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          placeholder="Pays"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          placeholder="Année"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
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
        {education.map((item) => (
          <div key={item.id} className="bg-background rounded-2xl border border-secondary/10 p-4 flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold text-secondary">{item.degree}</p>
              <p className="text-sm">{item.institution}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleEdit(item)} className="text-primary text-sm font-medium">
                Modifier
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600 text-sm font-medium">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
