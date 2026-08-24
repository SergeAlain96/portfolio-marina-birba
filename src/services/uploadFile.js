import { supabase } from './supabase'

export async function uploadFile(file, folder) {
  const path = `${folder}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('media').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}
