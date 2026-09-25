import { useEffect, useRef, useState } from 'react'
import { TbCheck, TbLoader2, TbPencil, TbTrash, TbX } from 'react-icons/tb'
import { supabase } from '../../services/supabase'
import { deleteFileStrict, uploadFile } from '../../services/uploadFile'
import FileDropzone from './FileDropzone'

const iconOptions = [
  { value: 'briefcase', label: 'Mission / accompagnement' },
  { value: 'map', label: 'Cartographie' },
  { value: 'chart', label: 'Analyse et visualisation' },
  { value: 'code', label: 'Développement' },
  { value: 'palette', label: 'Design / communication' },
  { value: 'database', label: 'Bases de données' },
  { value: 'settings', label: 'Configuration / outils' },
  { value: 'sparkles', label: 'Conseil / innovation' },
]

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const maxImageSize = 5 * 1024 * 1024

function createEmptyForm() {
  return {
    title: '',
    description: '',
    icon: 'briefcase',
    image_url: null,
    status: 'draft',
    display_order: 0,
  }
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function readableError(error, fallback) {
  if (error?.code === '42501') {
    return 'Vous ne disposez pas des droits administrateur nécessaires pour cette action.'
  }
  if (error?.code === '23514' || error?.code === '23502') {
    return 'Certaines informations ne respectent pas les règles de validation.'
  }
  return error?.message || fallback
}

async function fetchServices() {
  return supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
}

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(createEmptyForm)
  const [editingId, setEditingId] = useState(null)
  const [originalImageUrl, setOriginalImageUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [previewObjectUrl, setPreviewObjectUrl] = useState('')
  const [orderInputs, setOrderInputs] = useState({})
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const formRef = useRef(null)
  const refreshTokenRef = useRef(0)
  const isLocked = saving || Boolean(busy)

  async function refresh() {
    const token = ++refreshTokenRef.current
    setLoading(true)
    try {
      const { data, error: requestError } = await fetchServices()
      if (token !== refreshTokenRef.current) return true
      if (requestError) {
        setError(readableError(requestError, 'Impossible de charger les services.'))
        return false
      }
      setServices(data ?? [])
      setOrderInputs(
        Object.fromEntries((data ?? []).map((service) => [service.id, service.display_order])),
      )
      return true
    } catch (requestError) {
      if (token === refreshTokenRef.current) {
        setError(readableError(requestError, 'Impossible de charger les services.'))
      }
      return false
    } finally {
      if (token === refreshTokenRef.current) {
        setLoading(false)
        setHasLoaded(true)
      }
    }
  }

  useEffect(() => {
    let active = true

    fetchServices()
      .then(({ data, error: requestError }) => {
        if (!active) return
        if (requestError) {
          setError(readableError(requestError, 'Impossible de charger les services.'))
        } else {
          setServices(data ?? [])
          setOrderInputs(
            Object.fromEntries((data ?? []).map((service) => [service.id, service.display_order])),
          )
        }
        setLoading(false)
        setHasLoaded(true)
      })
      .catch((requestError) => {
        if (!active) return
        setError(readableError(requestError, 'Impossible de charger les services.'))
        setLoading(false)
        setHasLoaded(true)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl)
    }
  }, [previewObjectUrl])

  const previewUrl = imageFile ? previewObjectUrl : form.image_url || ''

  function resetForm() {
    setForm(createEmptyForm())
    setEditingId(null)
    setOriginalImageUrl(null)
    setImageFile(null)
    setPreviewObjectUrl('')
    setNotice('')
    setError('')
  }

  function validateForm() {
    const title = form.title.trim()
    const description = form.description.trim()
    const displayOrder = Number(form.display_order)

    if (!title) {
      setError('Le titre du service est obligatoire.')
      return null
    }
    if (title.length > 160) {
      setError('Le titre ne peut pas dépasser 160 caractères.')
      return null
    }
    if (!description) {
      setError('La description du service est obligatoire.')
      return null
    }
    if (description.length > 5000) {
      setError('La description ne peut pas dépasser 5 000 caractères.')
      return null
    }
    if (!Number.isInteger(displayOrder) || displayOrder < 0 || displayOrder > 9999) {
      setError("L'ordre d'affichage doit être un nombre entier compris entre 0 et 9 999.")
      return null
    }
    if (!form.icon && !imageFile && !form.image_url) {
      setError('Ajoutez une icône ou une image pour le service.')
      return null
    }

    return {
      title,
      description,
      icon: form.icon || null,
      status: form.status,
      display_order: displayOrder,
    }
  }

  function handleImage(file) {
    if (!file) return
    if (!imageTypes.has(file.type)) {
      setError('Choisissez une image JPG, PNG, WebP, GIF ou AVIF.')
      return
    }
    if (file.size > maxImageSize) {
      setError("L'image ne doit pas dépasser 5 Mo.")
      return
    }

    setImageFile(file)
    setPreviewObjectUrl(URL.createObjectURL(file))
    setForm((current) => ({ ...current, image_url: null }))
    setError('')
    setNotice('')
  }

  function handleRemoveImage() {
    setImageFile(null)
    setPreviewObjectUrl('')
    setForm((current) => ({ ...current, image_url: null }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const payload = validateForm()
    if (!payload) return

    const wasEditing = Boolean(editingId)
    const previousImageUrl = originalImageUrl
    let uploadedImageUrl = null
    let cleanupWarning = ''

    setSaving(true)
    setError('')
    setNotice('')

    try {
      if (imageFile) {
        uploadedImageUrl = await uploadFile(imageFile, 'services')
      }

      const requestPayload = {
        ...payload,
        image_url: imageFile ? uploadedImageUrl : form.image_url || null,
      }
      const request = editingId
        ? supabase.from('services').update(requestPayload).eq('id', editingId)
        : supabase.from('services').insert(requestPayload)
      const { data: savedService, error: requestError } = editingId
        ? await request.select('id').maybeSingle()
        : await request.select('id').single()

      if (requestError) throw requestError
      if (!savedService) throw new Error("Le service n'existe plus ou l'action a été refusée.")

      if (previousImageUrl && previousImageUrl !== requestPayload.image_url) {
        try {
          await deleteFileStrict(previousImageUrl)
        } catch {
          cleanupWarning = 'Le service a été enregistré, mais l’ancienne image n’a pas pu être supprimée du stockage.'
        }
      }

      resetForm()
      const refreshed = await refresh()
      setNotice(
        refreshed
          ? (wasEditing ? 'Service modifié avec succès' : 'Service créé avec succès')
          : `${wasEditing ? 'Service modifié' : 'Service créé'}, mais la liste n’a pas pu être actualisée.`,
      )
      if (cleanupWarning) setError(cleanupWarning)
    } catch (requestError) {
      let cleanupErrorMessage = ''
      if (uploadedImageUrl) {
        try {
          await deleteFileStrict(uploadedImageUrl)
        } catch {
          cleanupErrorMessage = ' Le fichier temporaire n’a pas pu être nettoyé.'
        }
      }
      setError(`${readableError(requestError, 'La sauvegarde du service a échoué.')}${cleanupErrorMessage}`)
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(service) {
    setEditingId(service.id)
    setOriginalImageUrl(service.image_url || null)
    setForm({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || '',
      image_url: service.image_url || null,
      status: service.status || 'draft',
      display_order: service.display_order ?? 0,
    })
    setImageFile(null)
    setPreviewObjectUrl('')
    setError('')
    setNotice('')
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleDelete(service) {
    if (!window.confirm(`Supprimer définitivement le service « ${service.title} » ?`)) return

    setBusy(`${service.id}:delete`)
    setError('')
    setNotice('')
    let cleanupWarning = ''

    try {
      const { data: deletedService, error: requestError } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id)
        .select('id')
        .maybeSingle()
      if (requestError) throw requestError
      if (!deletedService) throw new Error("Le service n'existe plus ou l'action a été refusée.")

      if (service.image_url) {
        try {
          await deleteFileStrict(service.image_url)
        } catch {
          cleanupWarning = 'Le service a été supprimé, mais son image n’a pas pu être supprimée du stockage.'
        }
      }
      if (editingId === service.id) resetForm()
      const refreshed = await refresh()
      setNotice(refreshed ? 'Service supprimé avec succès' : 'Service supprimé, mais la liste n’a pas pu être actualisée.')
      if (cleanupWarning) setError(cleanupWarning)
    } catch (requestError) {
      setError(readableError(requestError, 'La suppression du service a échoué.'))
    } finally {
      setBusy(null)
    }
  }

  async function handleStatusToggle(service) {
    const nextStatus = service.status === 'published' ? 'draft' : 'published'
    setBusy(`${service.id}:status`)
    setError('')
    setNotice('')

    try {
      const { data: updatedService, error: requestError } = await supabase
        .from('services')
        .update({ status: nextStatus })
        .eq('id', service.id)
        .select('id')
        .maybeSingle()
      if (requestError) throw requestError
      if (!updatedService) throw new Error("Le service n'existe plus ou l'action a été refusée.")
      const refreshed = await refresh()
      setNotice(refreshed ? 'Statut mis à jour avec succès' : 'Statut mis à jour, mais la liste n’a pas pu être actualisée.')
    } catch (requestError) {
      setError(readableError(requestError, 'La mise à jour du statut a échoué.'))
    } finally {
      setBusy(null)
    }
  }

  async function handleOrderSave(service) {
    const rawValue = orderInputs[service.id]
    const value = Number(rawValue)
    if (rawValue === '' || rawValue === null || rawValue === undefined || !Number.isInteger(value) || value < 0 || value > 9999) {
      setError("L'ordre d'affichage doit être un nombre entier compris entre 0 et 9 999.")
      return
    }

    setBusy(`${service.id}:order`)
    setError('')
    setNotice('')

    try {
      const { data: updatedService, error: requestError } = await supabase
        .from('services')
        .update({ display_order: value })
        .eq('id', service.id)
        .select('id')
        .maybeSingle()
      if (requestError) throw requestError
      if (!updatedService) throw new Error("Le service n'existe plus ou l'action a été refusée.")
      const refreshed = await refresh()
      setNotice(refreshed ? 'Ordre mis à jour avec succès' : 'Ordre mis à jour, mais la liste n’a pas pu être actualisée.')
    } catch (requestError) {
      setError(readableError(requestError, "La mise à jour de l'ordre a échoué."))
    } finally {
      setBusy(null)
    }
  }

  if (loading && !hasLoaded) {
    return <p className="text-sm text-text/50">Chargement des services...</p>
  }

  return (
    <div className="flex flex-col gap-8">
      {notice && (
        <p role="status" className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
          <TbCheck size={18} />
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Erreur : {error}
        </p>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold text-secondary">
            {editingId ? 'Modifier le service' : 'Ajouter un service'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={isLocked}
              className="text-sm font-medium text-secondary/60 hover:text-secondary disabled:opacity-50"
            >
              Annuler
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="service-title" className="text-sm font-medium text-secondary">
            Titre du service
          </label>
          <input
            id="service-title"
            required
            maxLength={160}
            placeholder="Ex. Cartographie thématique"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="service-description" className="text-sm font-medium text-secondary">
            Description
          </label>
          <textarea
            id="service-description"
            required
            rows={5}
            maxLength={5000}
            placeholder="Décrivez la prestation et son objectif"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="service-icon" className="text-sm font-medium text-secondary">
              Icône
            </label>
            <select
              id="service-icon"
              value={form.icon}
              onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
              className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
            >
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              <option value="">Aucune icône (image requise)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="service-status" className="text-sm font-medium text-secondary">
              Statut
            </label>
            <select
              id="service-status"
              required
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
              className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-xs">
          <label htmlFor="service-order" className="text-sm font-medium text-secondary">
            Ordre d'affichage
          </label>
          <input
            id="service-order"
            required
            type="number"
            min="0"
            max="9999"
            step="1"
            value={form.display_order}
            onChange={(event) => setForm((current) => ({ ...current, display_order: event.target.value }))}
            className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <FileDropzone
          label="Image du service (optionnelle si une icône est sélectionnée)"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          hint="JPG, PNG, WebP, GIF ou AVIF, 5 Mo maximum"
          uploading={saving && Boolean(imageFile)}
          onFiles={handleImage}
        >
          {previewUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-secondary/10 bg-background p-3">
              <img
                src={previewUrl}
                alt="Aperçu du service"
                className="w-24 h-20 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <TbX size={16} />
                Supprimer l'image
              </button>
            </div>
          )}
        </FileDropzone>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isLocked}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <span className="inline-flex items-center gap-2"><TbLoader2 size={18} className="animate-spin" />Enregistrement...</span> : editingId ? 'Enregistrer les modifications' : 'Créer le service'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={isLocked}
              className="px-6 py-3 rounded-xl border-2 border-secondary text-secondary font-semibold disabled:opacity-50"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold text-secondary">Services enregistrés</h2>
          <span className="text-sm text-text/50">{services.length} service(s)</span>
        </div>

        {services.length === 0 ? (
          <p className="rounded-2xl bg-background border border-secondary/10 p-6 text-sm text-text/60">
            Aucun service n'a encore été ajouté.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-secondary/10">
            <table className="w-full min-w-[820px] text-left text-sm">
              <caption className="sr-only">Liste des services du portfolio</caption>
              <thead className="bg-background text-secondary">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Service</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Statut</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Ordre</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Dates</th>
                  <th scope="col" className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {services.map((service) => {
                  const isBusy = isLocked
                  return (
                    <tr key={service.id} className="align-top">
                      <td className="px-4 py-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          {service.image_url ? (
                            <img src={service.image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          ) : (
                            <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xs font-semibold shrink-0">
                              {iconOptions.find((option) => option.value === service.icon)?.label?.split(' ')[0] || 'Icône'}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-secondary">{service.title}</p>
                            <p className="text-xs text-text/55 line-clamp-2 mt-1">{service.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${service.status === 'published' ? 'bg-accent/15 text-accent' : 'bg-secondary/10 text-secondary/70'}`}>
                          {service.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusToggle(service)}
                          className="mt-2 block text-xs font-medium text-primary hover:underline disabled:opacity-50"
                        >
                          {service.status === 'published' ? 'Dépublier' : 'Publier'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            required
                            min="0"
                            max="9999"
                            step="1"
                            aria-label={`Ordre d'affichage pour ${service.title}`}
                            disabled={isLocked}
                            value={orderInputs[service.id] ?? ''}
                            onChange={(event) => setOrderInputs((current) => ({
                              ...current,
                              [service.id]: event.target.value,
                            }))}
                            className="w-20 px-2 py-2 rounded-lg bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleOrderSave(service)}
                            className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-text/55 whitespace-nowrap">
                        <p>Créé : {formatDate(service.created_at)}</p>
                        <p className="mt-1">Modifié : {formatDate(service.updated_at)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleEdit(service)}
                            className="inline-flex items-center gap-1 text-primary text-sm font-medium disabled:opacity-50"
                          >
                            <TbPencil size={16} />
                            Modifier
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(service)}
                            className="inline-flex items-center gap-1 text-red-600 text-sm font-medium disabled:opacity-50"
                          >
                            <TbTrash size={16} />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
