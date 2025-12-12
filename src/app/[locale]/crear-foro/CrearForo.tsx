'use client'
import { useEffect, useState } from 'react'

interface Planta {
  PlantaID: number
  NombreComun: string
}

interface ForoForm {
  PlantaID: number
  Comentario: string
  ImagenURL: string
  Latitud: string
  Longitud: string
}

export default function CrearForo() {
  const [usuarioId, setUsuarioId] = useState<number | null>(null)
  const [form, setForm] = useState<ForoForm>({
    PlantaID: 0,
    Comentario: '',
    ImagenURL: '',
    Latitud: '',
    Longitud: ''
  })
  const [plantas, setPlantas] = useState<Planta[]>([])
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  // Obtener usuario desde localStorage
  useEffect(() => {
    const user = localStorage.getItem('authUser')
    if (user) {
      const userData = JSON.parse(user)
      setUsuarioId(userData.id)
    }
  }, [])

  // Cargar plantas desde API
  useEffect(() => {
    const fetchPlantas = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plantas`)
        const data = await res.json()
        setPlantas(data)
      } catch {
  console.error('Error cargando plantas')
}

    }
    fetchPlantas()
  }, [])

  // Obtener ubicación automáticamente
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setForm(prev => ({
          ...prev,
          Latitud: position.coords.latitude.toString(),
          Longitud: position.coords.longitude.toString()
        }))
      },
      error => console.error('Error de geolocalización:', error)
    )
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setForm(prev => ({ ...prev, ImagenURL: data.secure_url }))
    } catch{
      console.error('Error al subir imagen:')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!usuarioId) {
      setMensaje('Debes iniciar sesión para crear un foro.')
      return
    }

    setCargando(true)
    setMensaje('')

    const payload = {
      UsuarioID: usuarioId,
      ...form
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/foro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const resultado = await res.json()

      if (res.ok) {
        setMensaje('Foro creado correctamente.')
        setForm({ PlantaID: 0, Comentario: '', ImagenURL: '', Latitud: '', Longitud: '' })
      } else {
        setMensaje(`Error al crear foro: ${resultado.message || 'Revisa los datos.'}`)
      }
      } catch {
  setMensaje(' Error al enviar los datos del foro.')
}


    setCargando(false)
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Crear nuevo foro</h2>

      {mensaje && (
        <div className="mb-4 p-3 border rounded text-sm bg-gray-100 text-gray-800">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Planta</label>
          <select
            name="PlantaID"
            value={form.PlantaID}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value={0}>-- Selecciona una planta --</option>
            {plantas.map(planta => (
              <option key={planta.PlantaID} value={planta.PlantaID}>
                {planta.NombreComun}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Comentario</label>
          <textarea
            name="Comentario"
            value={form.Comentario}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Subir imagen (galería o cámara)</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="w-full"
          />
          {form.ImagenURL && (
            <img src={form.ImagenURL} alt="Vista previa" className="mt-2 max-h-40 object-cover rounded" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Latitud</label>
            <input
              type="text"
              name="Latitud"
              value={form.Latitud}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              readOnly
            />
          </div>
          <div>
            <label className="block font-medium">Longitud</label>
            <input
              type="text"
              name="Longitud"
              value={form.Longitud}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              readOnly
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {cargando ? 'Publicando...' : 'Publicar foro'}
        </button>
      </form>
    </div>
  )
}
