import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata = {
  title: 'ZipMyFile - Free Online File Compression',
  description: 'The fastest way to zip your files online. Free, secure, and works in any browser.',
  keywords: 'file compression, zip files, online file compression, reduce file size, ZipMyFile',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.className} bg-gradient-to-br from-indigo-50 to-rose-50 dark:from-gray-900 dark:to-gray-800`}>
        {children}
      </body>
    </html>
  )
}
