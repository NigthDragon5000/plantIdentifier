'use client'
import { useState, useRef } from 'react'
import Webcam from 'react-webcam'

export default function Home() {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // Cambiar entre 'user' y 'environment'
  const webcamRef = useRef(null)

  const startCamera = () => {
    setShowCamera(true)
  }

  const stopCamera = () => {
    setShowCamera(false)
  }

  const switchCamera = () => {
    // Alterna entre la cámara delantera y la trasera
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  const takePhoto = () => {
    if (webcamRef.current) {
      const photoUrl = webcamRef.current.getScreenshot()
      setPreview(photoUrl)
      stopCamera()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!preview) return

    setLoading(true)
    try {
      const base64 = preview.split(',')[1]
      const res = await fetch('/api/identify-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      })
      const data = await res.json()
      setResult(data.result)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Identificador de Plantas</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {showCamera ? (
              <div className="relative">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-48 object-cover rounded-lg"
                  videoConstraints={{ facingMode }} // Configura la cámara
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={takePhoto}
                    className="px-4 py-2 bg-white rounded-full shadow text-gray-800"
                  >
                    📸 Capturar
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-white rounded-full shadow text-gray-800"
                  >
                    ❌ Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={switchCamera}
                    className="px-4 py-2 bg-white rounded-full shadow text-gray-800"
                  >
                    🔄 Cambiar Cámara
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block cursor-pointer">
                  <div className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center
                    ${preview ? 'border-green-500' : 'border-gray-300'}`}>
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-center p-4">
                        <div className="text-4xl mb-2">📷</div>
                        <span className="text-sm text-gray-500">Haz clic para subir una foto</span>
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

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
                  >
                    📸 Usar Cámara
                  </button>
                </div>
              </div>
            )}

            {preview && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg bg-green-500 text-white font-medium 
                  disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Identificando...' : 'Identificar Planta'}
              </button>
            )}
          </form>

          {result && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{result}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}