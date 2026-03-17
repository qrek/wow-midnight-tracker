import './globals.css'
import Nav from '@/components/Nav'

export const metadata = {
  title: 'Midnight Tracker — WoW Guild Dashboard',
  description: 'Suivi de progression guilde pour WoW Midnight Saison 1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-void-950 text-void-100 min-h-screen">
        <div className="flex min-h-screen">
          <Nav />
          <main className="flex-1 ml-64 min-h-screen bg-stars">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
