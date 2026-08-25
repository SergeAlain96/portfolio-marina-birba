import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { uploadFile } from '../../services/uploadFile'
import FileDropzone from './FileDropzone'

const emptyForm = { title: '', description: '', cover_image: '', project_date: '' }

export default function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGalleryFor, setUploadingGalleryFor] = useState(null)
  const [uploadError, setUploadError] = useState('')

  async function refresh() {
    const { data } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .order('project_date', { ascending: false })
    setProjects(data ?? [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCoverUpload(file) {
    if (!file) return
    setUploadingCover(true)
    setUploadError('')
    try {
      const url = await uploadFile(file, 'projects')
      setForm((f) => ({ ...f, cover_image: url }))
    } catch (err) {
      setUploadError(err.message)
    }
    setUploadingCover(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('projects').update(form).eq('id', editingId)
    } else {
      await supabase.from('projects').insert(form)
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
      cover_image: project.cover_image || '',
      project_date: project.project_date || '',
    })
  }

  async function handleDelete(id) {
    await supabase.from('projects').delete().eq('id', id)
    refresh()
  }

  async function handleGalleryUpload(projectId, files) {
    setUploadingGalleryFor(projectId)
    setUploadError('')
    try {
      for (const file of files) {
        const url = await uploadFile(file, 'projects')
        await supabase.from('project_images').insert({ project_id: projectId, image_url: url })
      }
    } catch (err) {
      setUploadError(err.message)
    }
    setUploadingGalleryFor(null)
    refresh()
  }

  async function handleGalleryDelete(imageId) {
    await supabase.from('project_images').delete().eq('id', imageId)
    refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
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
        <FileDropzone
          label="Image de couverture"
          accept="image/*"
          hint="JPG ou PNG"
          uploading={uploadingCover}
          onFiles={handleCoverUpload}
        >
          {form.cover_image && (
            <img src={form.cover_image} alt="Couverture" className="w-32 h-20 object-cover rounded-lg" />
          )}
        </FileDropzone>

        {uploadError && (
          <p className="text-red-600 text-sm font-medium">Upload échoué : {uploadError}</p>
        )}

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

      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-background rounded-2xl border border-secondary/10 p-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-semibold text-secondary">{project.title}</p>
                <p className="text-sm">{project.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(project)} className="text-primary text-sm font-medium">
                  Modifier
                </button>
                <button onClick={() => handleDelete(project.id)} className="text-red-600 text-sm font-medium">
                  Supprimer
                </button>
              </div>
            </div>

            <div className="mt-4">
              <FileDropzone
                label="Galerie du projet"
                accept="image/*"
                multiple
                hint="Plusieurs images possibles"
                uploading={uploadingGalleryFor === project.id}
                onFiles={(files) => handleGalleryUpload(project.id, files)}
              >
                <div className="flex flex-wrap gap-2">
                  {project.project_images?.map((image) => (
                    <div key={image.id} className="relative">
                      <img src={image.image_url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => handleGalleryDelete(image.id)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ×
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
