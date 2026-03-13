import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'zrok Docs — Zero-Trust Sharing for Developers',
  description: 'The modern, interactive documentation for zrok — the open-source, zero-trust sharing platform. Learn, explore, and start sharing in minutes.',
  keywords: ['zrok', 'tunnel', 'ngrok', 'zero-trust', 'localhost sharing', 'developer tools'],
  openGraph: {
    title: 'zrok Docs — Zero-Trust Sharing for Developers',
    description: 'Modern interactive documentation for zrok.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-midnight-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
