import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ZipMyFile - Efficient File Compression',
  description: 'Compress your files quickly and efficiently with ZipMyFile. Save space and reduce file size effortlessly.',
  keywords: 'file compression, zip files, online file compression, reduce file size, ZipMyFile',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
