import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { uploadFile } from '../../services/uploadFile'

const emptyProfile = {
  fullname: '',
  title: '',
  bio: '',
  photo_url: '',
  cv_url: '',
  email: '',
  phone: '',
  linkedin: '',
}

export default function ProfileManager() {
  const [profile, setProfile] = useState(emptyProfile)
  const [profileId, setProfileId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile(data)
          setProfileId(data.id)
        }
        setLoading(false)
      })
  }, [])

  async function handleUpload(field, file) {
    if (!file) return
    setUploading(field)
    setUploadError('')
    try {
      const url = await uploadFile(file, field === 'photo_url' ? 'profile' : 'cv')
      setProfile((p) => ({ ...p, [field]: url }))
    } catch (err) {
      setUploadError(err.message)
    }
    setUploading('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    if (profileId) {
      await supabase.from('profiles').update(profile).eq('id', profileId)
    } else {
      const { data } = await supabase.from('profiles').insert(profile).select().single()
      if (data) setProfileId(data.id)
    }
    setSaving(false)
  }

  if (loading) return null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
      <input
        placeholder="Nom complet"
        value={profile.fullname || ''}
        onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
        className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        placeholder="Titre professionnel"
        value={profile.title || ''}
        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
        className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
      />
      <textarea
        rows={5}
        placeholder="Biographie"
        value={profile.bio || ''}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
      />

      <label className="text-sm font-medium text-secondary">
        Photo
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload('photo_url', e.target.files[0])}
          className="block mt-1"
        />
        {uploading === 'photo_url' && <span className="text-sm text-primary">Envoi...</span>}
        {profile.photo_url && (
          <img src={profile.photo_url} alt="Photo" className="w-24 h-24 rounded-full object-cover mt-2" />
        )}
      </label>

      <label className="text-sm font-medium text-secondary">
        CV (PDF)
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleUpload('cv_url', e.target.files[0])}
          className="block mt-1"
        />
        {uploading === 'cv_url' && <span className="text-sm text-primary">Envoi...</span>}
        {profile.cv_url && (
          <a href={profile.cv_url} target="_blank" rel="noreferrer" className="text-primary text-sm underline">
            Voir le CV actuel
          </a>
        )}
      </label>

      <input
        placeholder="Email"
        value={profile.email || ''}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        placeholder="Téléphone"
        value={profile.phone || ''}
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        placeholder="LinkedIn"
        value={profile.linkedin || ''}
        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
        className="px-4 py-3 rounded-xl bg-background border border-secondary/10 outline-none focus:ring-2 focus:ring-primary"
      />

      {uploadError && <p className="text-red-600 text-sm font-medium">Upload échoué : {uploadError}</p>}

      <button
        type="submit"
        disabled={saving}
        className="self-start px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  )
}
