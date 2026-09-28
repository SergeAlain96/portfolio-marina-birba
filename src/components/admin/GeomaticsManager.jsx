import { useEffect, useState } from 'react'
import { TbArrowDown, TbArrowUp, TbCheck, TbLoader2, TbPlus, TbTrash } from 'react-icons/tb'
import { supabase } from '../../services/supabase'

const iconOptions = [
  { value: 'gps', label: 'GPS / acquisition' },
  { value: 'settings', label: 'Traitement' },
  { value: 'database', label: 'Stockage' },
  { value: 'map', label: 'Restitution' },
]

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary'

function createEmptyForm() {
  return {
    label: '',
    title: '',
    intro: '',
    detail: '',
    note: '',
    fields_title: '',
    pillars: [],
  }
}

function toForm(data) {
  return {
    label: data?.label || '',
    title: data?.title || '',
    intro: data?.intro || '',
    detail: data?.detail || '',
    note: data?.note || '',
    fields_title: data?.fields_title || '',
    pillars: Array.isArray(data?.pillars) ? data.pillars : [],
  }
}

function readableError(error) {
  if (error?.code === '42501') {
    return 'Vous ne disposez pas des droits administrateur nécessaires pour cette action.'
  }
  if (error?.message) {
    return error.message
  }
  return "L'enregistrement a échoué, réessayez."
}

export default function GeomaticsManager() {
  const [form, setForm] = useState(createEmptyForm)
  const [fieldsText, setFieldsText] = useState('')
  const [sectionId, setSectionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('geomatics')
      .select('id, label, title, intro, detail, note, fields_title, pillars, fields')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        const fields = Array.isArray(data?.fields) ? data.fields : []
        setForm(toForm(data))
        setFieldsText(fields.join('\n'))
        if (data) setSectionId(data.id)
        setLoading(false)
      })
  }, [])

  function updatePillar(index, patch) {
    setForm((current) => ({
      ...current,
      pillars: current.pillars.map((pillar, position) =>
        position === index ? { ...pillar, ...patch } : pillar,
      ),
    }))
  }

  function addPillar() {
    setForm((current) => ({
      ...current,
      pillars: [...current.pillars, { icon: 'map', title: '', text: '' }],
    }))
  }

  function removePillar(index) {
    setForm((current) => ({
      ...current,
      pillars: current.pillars.filter((_, position) => position !== index),
    }))
  }

  function movePillar(index, offset) {
    setForm((current) => {
      const target = index + offset
      if (target < 0 || target >= current.pillars.length) return current
      const pillars = [...current.pillars]
      ;[pillars[index], pillars[target]] = [pillars[target], pillars[index]]
      return { ...current, pillars }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    setSaved(false)

    const payload = {
      label: form.label,
      title: form.title,
      intro: form.intro,
      detail: form.detail,
      note: form.note,
      fields_title: form.fields_title,
      pillars: form.pillars
        .map((pillar) => ({
          icon: pillar.icon || 'map',
          title: (pillar.title || '').trim(),
          text: (pillar.text || '').trim(),
        }))
        .filter((pillar) => pillar.title || pillar.text),
      fields: fieldsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    }

    if (!payload.title.trim()) {
      setSaveError('Le titre de la section est obligatoire.')
      setSaving(false)
      return
    }

    if (payload.pillars.some((pillar) => !pillar.title)) {
      setSaveError('Chaque pilier doit avoir un titre.')
      setSaving(false)
      return
    }

    const { error } = sectionId
      ? await supabase.from('geomatics').update(payload).eq('id', sectionId)
      : await supabase.from('geomatics').insert(payload).select('id').single()

    if (error) {
      setSaveError(readableError(error))
      setSaving(false)
      return
    }

    const { data } = await supabase
      .from('geomatics')
      .select('id, label, title, intro, detail, note, fields_title, pillars, fields')
      .limit(1)
      .maybeSingle()

    if (data) {
      const fields = Array.isArray(data.fields) ? data.fields : []
      setForm(toForm(data))
      setFieldsText(fields.join('\n'))
      setSectionId(data.id)
    }

    setSaved(true)
    setSaving(false)
  }

  if (loading) return null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      <div className="flex flex-col gap-4">
        <p className="text-xs text-text/50">
          Ces textes alimentent la section « Géomatique » du site public. Laisser un champ vide le masque
          sur le site.
        </p>

        <div>
          <input
            placeholder="Sur-titre (optionnel)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-text/50 mt-1">
            Petit texte au-dessus du titre, en vert et en majuscules. Laisser vide pour n'afficher rien.
          </p>
        </div>

        <input
          required
          placeholder="Titre de la section"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
        />

        <div>
          <textarea
            rows={4}
            placeholder="Paragraphe d'introduction"
            value={form.intro}
            onChange={(e) => setForm({ ...form, intro: e.target.value })}
            className={`${inputClass} resize-y`}
          />
          <p className="text-xs text-text/50 mt-1">Texte mis en avant, juste sous le titre.</p>
        </div>

        <textarea
          rows={4}
          placeholder="Paragraphe de développement"
          value={form.detail}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
          className={`${inputClass} resize-y`}
        />

        <div>
          <textarea
            rows={2}
            placeholder="Précision en petit (optionnel)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className={`${inputClass} resize-y`}
          />
          <p className="text-xs text-text/50 mt-1">Note discrète affichée après les paragraphes.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-secondary">Piliers</p>
          <button
            type="button"
            onClick={addPillar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            <TbPlus size={16} />
            Ajouter un pilier
          </button>
        </div>

        {form.pillars.length === 0 && (
          <p className="text-sm text-text/50">Aucun pilier : la grille de cartes ne s'affichera pas.</p>
        )}

        {form.pillars.map((pillar, index) => (
          <div key={index} className="rounded-2xl border border-secondary/10 bg-background p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={pillar.icon || 'map'}
                onChange={(e) => updatePillar(index, { icon: e.target.value })}
                className="px-3 py-2 rounded-lg bg-white border border-secondary/10 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 ml-auto">
                <button
                  type="button"
                  onClick={() => movePillar(index, -1)}
                  disabled={index === 0}
                  aria-label="Monter le pilier"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-secondary hover:bg-secondary/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <TbArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => movePillar(index, 1)}
                  disabled={index === form.pillars.length - 1}
                  aria-label="Descendre le pilier"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-secondary hover:bg-secondary/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <TbArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removePillar(index)}
                  aria-label="Supprimer le pilier"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TbTrash size={16} />
                </button>
              </div>
            </div>

            <input
              placeholder="Titre du pilier"
              value={pillar.title || ''}
              onChange={(e) => updatePillar(index, { title: e.target.value })}
              className={inputClass}
            />
            <textarea
              rows={3}
              placeholder="Description du pilier"
              value={pillar.text || ''}
              onChange={(e) => updatePillar(index, { text: e.target.value })}
              className={`${inputClass} resize-y`}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-secondary">Domaines d'application</p>
        <div>
          <input
            placeholder="Titre du bloc (ex: Domaines d'application)"
            value={form.fields_title}
            onChange={(e) => setForm({ ...form, fields_title: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-text/50 mt-1">Laisser vide pour masquer le bloc entier.</p>
        </div>
        <div>
          <textarea
            rows={6}
            placeholder={'Un domaine par ligne\nex: Urbanisme et aménagement'}
            value={fieldsText}
            onChange={(e) => setFieldsText(e.target.value)}
            className={`${inputClass} resize-y`}
          />
          <p className="text-xs text-text/50 mt-1">Un domaine par ligne, chaque ligne devient une étiquette.</p>
        </div>
      </div>

      {saveError && <p className="text-red-600 text-sm font-medium">Enregistrement échoué : {saveError}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 self-start px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? <TbLoader2 size={18} className="animate-spin" /> : <TbCheck size={18} />}
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {saved && !saving && <p className="text-accent text-sm font-medium">Modifications enregistrées.</p>}
      </div>
    </form>
  )
}
