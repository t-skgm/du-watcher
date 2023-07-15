import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'DU Watcher'
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap'
})

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
        {modal}
      </body>
    </html>
  )
}
