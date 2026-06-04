import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'TalentDash — Career Intelligence Platform',
  description: 'Structured, comparable salary data for India tech professionals.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-app-bg text-body-text antialiased">
        {children}
      </body>
    </html>
  )
}