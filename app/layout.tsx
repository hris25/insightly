import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Relationnel - Découvrez vos socles relationnels',
  description: 'Une application pour définir les socles qui comptent le plus dans une relation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fdf2f8',
              color: '#be185d',
              border: '1px solid #fce7f3',
            },
          }}
        />
      </body>
    </html>
  )
}
