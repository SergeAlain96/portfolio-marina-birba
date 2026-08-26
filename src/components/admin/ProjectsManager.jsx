import { useEffect, useRef, useState } from 'react'
import { TbFileText, TbPencil, TbTrash, TbX } from 'react-icons/tb'
import { supabase } from '../../services/supabase'
import { deleteFile, filenameFromUrl, uploadFile } from '../../services/uploadFile'
import FileDropzone from './FileDropzone'

const emptyForm = { title: '', description: '', project_date: '' }

export default function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(null) // `${projectId}:${champ}`
  const [error, setError] = useState('')
  const formRef = useRef(null)

  async function refresh() {
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .order('project_date', { ascending: false })
    if (error) setError(error.message)
    setProjects(data ?? [])
  }

  useEffect(() => {
    refresh()
  }, [])

  // --- infos texte (formulaire du haut) ---

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const query = editingId
      ? supabase.from('projects').update(form).eq('id', editingId)
      : supabase.from('projects').insert(form)

    const { error } = await query
    if (error) {
      setError(error.message)
      return
    }
    setForm(emptyForm)
    setEditingId(null)
    refresh()
  }

  function handleEdit(project) {
    setEditingId(project.id)
    setForm({
      title: project.title || '',
      description: project.description || '',
      project_date: project.project_date || '',
    })
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleDeleteProject(project) {
    if (!window.confirm(`Supprimer définitivement le projet « ${project.title} » ?`)) return
    setError('')

    // nettoie les fichiers associes avant de supprimer la ligne
    await deleteFile(project.cover_image)
    await deleteFile(project.document_url)
    for (const image of project.project_images ?? []) {
      await deleteFile(image.image_url)
    }

    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    if (error) setError(error.message)
    if (editingId === project.id) cancelEdit()
    refresh()
  }

  // --- fichiers (sauvegarde immediate sur la carte) ---

  async function replaceProjectFile(project, field, file, folder) {
    if (!file) return
    setBusy(`${project.id}:${field}`)
    setError('')
    try {
      const url = await uploadFile(file, folder)
      const { error } = await supabase.from('projects').update({ [field]: url }).eq('id', project.id)
      if (error) throw error
      await deleteFile(project[field]) // supprime l'ancien fichier devenu orphelin
      await refresh()
    } catch (err) {
      setError(err.message)
    }
    setBusy(null)
  }

  async function removeProjectFile(project, field, label) {
    if (!window.confirm(`Supprimer ${label} de « ${project.title} » ?`)) return
    setBusy(`${project.id}:${field}`)
    setError('')
    try {
      const { error } = await supabase.from('projects').update({ [field]: null }).eq('id', project.id)
      if (error) throw error
      await deleteFile(project[field])
      await refresh()
    } catch (err) {
      setError(err.message)
    }
    setBusy(null)
  }

  async function handleGalleryUpload(project, files) {
    setBusy(`${project.id}:gallery`)
    setError('')
    try {
      for (const file of files) {
        const url = await uploadFile(file, 'projects')
        const { error } = await supabase
          .from('project_images')
          .insert({ project_id: project.id, image_url: url })
        if (error) throw error
      }
      await refresh()
    } catch (err) {
      setError(err.message)
    }
    setBusy(null)
  }

  async function handleGalleryDelete(image) {
    setError('')
    const { error } = await supabase.from('project_images').delete().eq('id', image.id)
    if (error) {
      setError(error.message)
      return
    }
    await deleteFile(image.image_url)
    refresh()
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Formulaire : creation / modification des infos texte */}
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-semibold text-secondary">
            {editingId ? 'Modifier les informations' : 'Nouveau projet'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm font-medium text-secondary/60 hover:text-secondary"
            >
              Annuler
            </button>
          )}
        </div>

        <input
          required
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="date"
          value={form.project_date}
          onChange={(e) => setForm({ ...form, project_date: e.target.value })}
          className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          className="self-start px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {editingId ? 'Enregistrer les modifications' : 'Créer le projet'}
        </button>

        {!editingId && (
          <p className="text-xs text-text/50">
            Images et document s'ajoutent ensuite sur la fiche du projet, ci-dessous.
          </p>
        )}
      </form>

      {error && <p className="text-red-600 text-sm font-medium">Erreur : {error}</p>}

      {/* Fiches projets : gestion complete des fichiers, sauvegarde immediate */}
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`rounded-2xl border p-5 transition-colors ${
              editingId === project.id
                ? 'border-primary bg-primary/5'
                : 'border-secondary/10 bg-background'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-secondary">{project.title}</p>
                {project.project_date && (
                  <p className="text-xs text-text/50 mt-0.5">
                    {new Date(project.project_date).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
                {project.description && (
                  <p className="text-sm mt-2 line-clamp-2">{project.description}</p>
                )}
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="flex items-center gap-1 text-primary text-sm font-medium"
                >
                  <TbPencil size={16} /> Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(project)}
                  className="flex items-center gap-1 text-red-600 text-sm font-medium"
                >
                  <TbTrash size={16} /> Supprimer
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-5 pt-5 border-t border-secondary/10">
              {/* Couverture */}
              <div>
                {project.cover_image ? (
                  <div>
                    <p className="text-sm font-medium text-secondary mb-2">Image de couverture</p>
                    <div className="relative inline-block">
                      <img
                        src={project.cover_image}
                        alt="Couverture"
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeProjectFile(project, 'cover_image', 'la couverture')}
                        aria-label="Supprimer la couverture"
                        className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        <TbX size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <FileDropzone
                    label="Image de couverture"
                    accept="image/*"
                    hint="JPG ou PNG"
                    uploading={busy === `${project.id}:cover_image`}
                    onFiles={(file) => replaceProjectFile(project, 'cover_image', file, 'projects')}
                  />
                )}
              </div>

              {/* Document */}
              <div>
                {project.document_url ? (
                  <div>
                    <p className="text-sm font-medium text-secondary mb-2">Document</p>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-secondary/10">
                      <TbFileText size={18} className="text-accent shrink-0" />
                      <a
                        href={project.document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary underline truncate"
                      >
                        {filenameFromUrl(project.document_url)}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeProjectFile(project, 'document_url', 'le document')}
                        aria-label="Supprimer le document"
                        className="ml-auto shrink-0 text-red-600 hover:text-red-700"
                      >
                        <TbTrash size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <FileDropzone
                    label="Document (rapport)"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    hint="PDF ou Word"
                    uploading={busy === `${project.id}:document_url`}
                    onFiles={(file) => replaceProjectFile(project, 'document_url', file, 'documents')}
                  />
                )}
              </div>
            </div>

            {/* Galerie */}
            <div className="mt-5">
              <FileDropzone
                label={`Galerie (${project.project_images?.length ?? 0})`}
                accept="image/*"
                multiple
                hint="Plusieurs images possibles"
                uploading={busy === `${project.id}:gallery`}
                onFiles={(files) => handleGalleryUpload(project, files)}
              >
                <div className="flex flex-wrap gap-2">
                  {project.project_images?.map((image) => (
                    <div key={image.id} className="relative">
                      <img src={image.image_url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => handleGalleryDelete(image)}
                        aria-label="Supprimer cette image"
                        className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        <TbX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </FileDropzone>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
