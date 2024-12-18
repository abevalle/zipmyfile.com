'use client'
import { useState } from 'react';
import Nav from './Nav';
import Upload from './Upload';
import FileList from './FileList';
import Footer from './Footer';

export default function Home() {
  const [files, setFiles] = useState([]);

  const handleDelete = (pathToDelete) => {
    setFiles((prevFiles) => prevFiles.filter((fileObj) => !fileObj.path.startsWith(pathToDelete)));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-rose-500">
                Compress Files in Seconds
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Free, secure, and works right in your browser. No signup required.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"> {/* Added pb-24 for bottom padding */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <Upload files={files} setFiles={setFiles} />
            </div>
            <div className="lg:w-1/2">
              <FileList files={files} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
