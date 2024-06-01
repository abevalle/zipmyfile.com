'use client'
import { useEffect, useRef, useState } from 'react';
import { zipSync } from 'fflate';
import CompressionOptions from './CompressionOptions';
import { words } from './words';
import ToggleSwitch from './ToggleSwitch';
import ReactGA from 'react-ga4';

export default function Upload({ files, setFiles }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(6);
  const [zipFileName, setZipFileName] = useState(generateRandomName());
  const [warning, setWarning] = useState('');
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState('');
  const [currentFile, setCurrentFile] = useState('');
  const [isDirectoryUpload, setIsDirectoryUpload] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initWasm = async () => {
      const response = await fetch('/wasm_zipper_rust_bg.wasm');
      const buffer = await response.arrayBuffer();
      const wasm = await WebAssembly.instantiate(buffer, {});
      const { greet } = wasm.instance.exports;
      setMessage(greet('User'));
    };
    initWasm();
  }, []);

  function generateRandomName() {
    const getRandomWord = () => words[Math.floor(Math.random() * words.length)];
    const randomWord1 = getRandomWord();
    const randomWord2 = getRandomWord();
    const randomTwoDigitNumber = Math.floor(Math.random() * 90 + 10).toString();
    const date = new Date();
    const mmddyy = `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getFullYear()).slice(-2)}`;
    return `${randomWord1}-${randomWord2}-${randomTwoDigitNumber}-${mmddyy}`;
  }

  const generateNewName = () => {
    setZipFileName(generateRandomName());
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    if (newFiles.length === 0) return;

    const newFileObjects = newFiles.map((file) => ({ file, path: file.webkitRelativePath || file.name }));
    setFiles((prevFiles) => [...prevFiles, ...newFileObjects]);
    setWarning('');

    // Google Analytics event for file upload
    ReactGA.event({
      category: 'User Interaction',
      action: 'File Upload',
      label: 'Files Uploaded',
      value: newFiles.length,
    });
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const newFiles = [];

    const readEntries = async (entry, path = '') => {
      if (entry.isFile) {
        const file = await new Promise((resolve) => entry.file(resolve));
        newFiles.push({ file, path: path + entry.name });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const entries = await new Promise((resolve) => reader.readEntries(resolve));
        for (const subEntry of entries) {
          await readEntries(subEntry, path + entry.name + '/');
        }
      }
    };

    for (const item of event.dataTransfer.items) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        await readEntries(entry);
      }
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setWarning('');

    // Google Analytics event for file drop
    ReactGA.event({
      category: 'User Interaction',
      action: 'File Drop',
      label: 'Files Dropped',
      value: newFiles.length,
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleCompressionLevelChange = (level) => {
    setCompressionLevel(level);
  };

  const handleZipFileNameChange = (event) => {
    setZipFileName(event.target.value);
  };

  const toggleUploadMode = () => {
    setIsDirectoryUpload(!isDirectoryUpload);
  };

  const zipFiles = () => {
    if (files.length === 0) {
      setWarning('No files uploaded. Please upload files before attempting to compress.');
      return;
    }

    setLoading(true);
    setProgress(0);
    setEta('');
    setCurrentFile('');

    const totalSize = files.reduce((acc, fileObj) => acc + fileObj.file.size, 0);
    const startTime = Date.now();

    const fileData = {};
    let processedSize = 0;

    files.forEach(({ file, path }, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        fileData[path] = new Uint8Array(e.target.result);
        processedSize += file.size;
        setCurrentFile(path);

        const elapsedTime = (Date.now() - startTime) / 1000;
        const progress = (processedSize / totalSize) * 100;
        setProgress(progress);

        const estimatedTotalTime = (elapsedTime / progress) * 100;
        const eta = Math.max(0, estimatedTotalTime - elapsedTime).toFixed(2);
        setEta(eta);

        if (Object.keys(fileData).length === files.length) {
          const zipped = zipSync(fileData, { level: compressionLevel });
          const blob = new Blob([zipped], { type: 'application/zip' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${zipFileName}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setLoading(false);
          setEta('');
          setCurrentFile('');

          // Google Analytics event for file compression
          ReactGA.event({
            category: 'User Interaction',
            action: 'File Compression',
            label: 'Files Compressed',
            value: files.length,
          });
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-white">{message}</h1>
      <ToggleSwitch isDirectoryUpload={isDirectoryUpload} toggleUploadMode={toggleUploadMode} />
      <div 
        onDrop={handleDrop} 
        onDragOver={handleDragOver} 
        onClick={handleClick}
        className="border-dashed border-2 border-gray-400 p-4 my-2 text-white text-center rounded cursor-pointer"
      >
        {isDirectoryUpload ? "Click to upload a directory or drag and drop files/directories here" : "Click to upload files or drag and drop files here"}
        <input 
          type="file" 
          multiple={!isDirectoryUpload}
          webkitdirectory={isDirectoryUpload ? "true" : undefined}
          directory={isDirectoryUpload ? "true" : undefined}
          onChange={handleFileChange} 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
        />
      </div>
      {warning && <p className="text-red-500">{warning}</p>}
      <CompressionOptions 
        onCompressionChange={handleCompressionLevelChange} 
        onZipFileNameChange={handleZipFileNameChange}
        zipFileName={zipFileName}
        compressionLevel={compressionLevel}
        generateNewName={generateNewName}
      />
      <button onClick={zipFiles} className="my-2 p-2 bg-blue-500 text-white rounded" disabled={loading}>
        {loading ? 'Compressing...' : 'Download ZIP'}
      </button>
      {loading && (
        <div className="w-full bg-gray-800 rounded mt-4">
          <div className="bg-blue-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded" style={{ width: `${progress}%` }}> 
            {progress.toFixed(2)}%
          </div>
        </div>
      )}
      {loading && (
        <div className="text-white mt-2">
          <p>Current file: {currentFile}</p>
          <p>ETA: {eta} seconds</p>
        </div>
      )}
      {files.length > 0 && (
        <div className="text-white mt-2">
          <p>{files.length} files added.</p>
        </div>
      )}
    </div>
  );
}
