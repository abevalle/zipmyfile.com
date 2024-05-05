import Image from 'next/image'
import Nav from './Nav.js'
import Upload from './Upload.js'
import ArchiveInfo from './ArchiveInfo.js'

export default function Home() {
  return (
    <main className="bg-gray-800">
      <Nav/>
      <div class="flex mb-4 h-svh">
        <div class="w-full">
          <Upload/>
        </div>
      </div>

    </main>
  )
}
