// src/app/page.js
'use client'
import { useState } from 'react';
import Nav from './Nav';
import Upload from './Upload';
import FileList from './FileList';

export default function Home() {
  const [files, setFiles] = useState([]);

  const handleDelete = (pathToDelete) => {
    setFiles((prevFiles) => prevFiles.filter((fileObj) => !fileObj.path.startsWith(pathToDelete)));
  };

  return (
    <main className="bg-gray-800 min-h-screen">
      <Nav />
      <div className="flex flex-col md:flex-row md:space-x-4 p-4">
        <div className="md:w-1/2">
          <Upload files={files} setFiles={setFiles} />
        </div>
        <div className="md:w-1/2">
          <FileList files={files} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}
