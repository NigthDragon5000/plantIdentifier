import './globals.css'

export const metadata = {
  title: 'Identificador de Plantas',
  description: 'Identifica plantas mediante IA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}