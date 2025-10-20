import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Protein Tracker',
  description: 'Track your daily protein intake by analyzing meal photos with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
