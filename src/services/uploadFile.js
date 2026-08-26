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
