import { useRef, useState } from 'react'
import { TbCloudUpload, TbLoader2 } from 'react-icons/tb'

export default function FileDropzone({
  label,
  accept,
  multiple = false,
  uploading = false,
  hint,
  onFiles,
  children,
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    if (uploading) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onFiles(multiple ? files : files[0])
  }

  function handleChange(e) {
    const files = Array.from(e.target.files)
    if (files.length) onFiles(multiple ? files : files[0])
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-secondary">{label}</span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        disabled={uploading}
        className={`flex flex-col items-center justify-center gap-2 w-full px-6 py-8 rounded-xl border-2 border-dashed transition-colors ${
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-secondary/20 bg-background hover:border-primary hover:bg-primary/5'
        } disabled:opacity-60 disabled:cursor-wait`}
      >
        {uploading ? (
          <>
            <TbLoader2 size={28} className="text-primary animate-spin" />
            <span className="text-sm font-medium text-primary">Envoi en cours...</span>
          </>
        ) : (
          <>
            <TbCloudUpload size={28} className="text-primary" />
            <span className="text-sm font-medium text-secondary">
              Cliquez ou glissez {multiple ? 'des fichiers' : 'un fichier'} ici
            </span>
            {hint && <span className="text-xs text-text/60">{hint}</span>}
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      {children}
    </div>
  )
}
