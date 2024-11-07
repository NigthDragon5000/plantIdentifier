

// components/PlantForm.jsx
'use client'
import { useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import ResultCard from './ResultCard'

export default function PlantForm() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    try {
      const base64 = preview.split(',')[1]
      const res = await fetch('/api/identify-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: base64 }),
      })
      
      const data = await res.json()
      setResult(data.result)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <label className="relative cursor-pointer">
            <div className={`h-64 w-64 rounded-lg border-2 border-dashed flex items-center justify-center
              ${preview ? 'border-green-500' : 'border-gray-300'}`}>
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm text-gray-600">
                    Selecciona una imagen
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!file || loading}
            className={`px-4 py-2 rounded-lg text-white font-medium
              ${!file || loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}
              transition-colors duration-200`}
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2" />
                Identificando...
              </span>
            ) : (
              'Identificar Planta'
            )}
          </button>
        </div>
      </form>

      {result && <ResultCard result={result} />}
    </div>
  )
}
