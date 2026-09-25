import { supabase } from './supabase'

function sanitizeFilename(name) {
  const lastDot = name.lastIndexOf('.')
  const base = lastDot > 0 ? name.slice(0, lastDot) : name
  const ext = lastDot > 0 ? name.slice(lastDot) : ''

  const safeBase = base
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // enleve les accents (é -> e, û -> u...)
    .replace(/[^a-zA-Z0-9-_]+/g, '-') // remplace espaces, virgules, etc.
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `${safeBase || 'fichier'}${ext.toLowerCase()}`
}

export async function uploadFile(file, folder) {
  const path = `${folder}/${Date.now()}-${sanitizeFilename(file.name)}`
  const { error } = await supabase.storage.from('media').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

// Retrouve le chemin interne du fichier a partir de son URL publique
// (.../object/public/media/projects/123-photo.png -> projects/123-photo.png)
function pathFromPublicUrl(url) {
  const marker = '/object/public/media/'
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
}

export async function deleteFile(url) {
  if (!url) return null
  const path = pathFromPublicUrl(url)
  if (!path) return null
  const { error } = await supabase.storage.from('media').remove([path])
  return error
}

export async function deleteFileStrict(url) {
  const error = await deleteFile(url)
  if (error) throw error
}

export function filenameFromUrl(url) {
  const path = pathFromPublicUrl(url) || url
  const name = path.split('/').pop() || 'document'
  // retire le prefixe timestamp ajoute a l'upload
  return name.replace(/^\d{10,}-/, '')
}
