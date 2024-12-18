'use client'
import { useEffect, useRef, useState } from 'react';
import { zipSync } from 'fflate';
import CompressionOptions from './CompressionOptions';
import { words } from './words';
import ToggleSwitch from './ToggleSwitch';
import ReactGA from 'react-ga4';

const GA_TRACKING_ID = 'G-3TVBTMF9JR';

ReactGA.initialize(GA_TRACKING_ID);

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
    <div className="rounded-2xl bg-white/50 backdrop-blur-lg dark:bg-gray-800/50 p-6 shadow-xl">
      <h1 className="text-gray-900 dark:text-white">{message}</h1>
      <ToggleSwitch isDirectoryUpload={isDirectoryUpload} toggleUploadMode={toggleUploadMode} />
      <div 
        onDrop={handleDrop} 
        onDragOver={handleDragOver} 
        onClick={handleClick}
        className="relative group border-3 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-12 
          transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-600
          bg-gradient-to-br from-white/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-indigo-900/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="text-center relative z-10">
          <div className="mx-auto w-16 h-16 mb-4">
            <svg 
              className="w-full h-full text-indigo-500 dark:text-indigo-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            {isDirectoryUpload ? "Drop folder here" : "Drop files here"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            or <span className="text-indigo-500 dark:text-indigo-400 font-medium">browse</span>
          </p>
        </div>
        <input 
          type="file" 
          multiple={!isDirectoryUpload}
          webkitdirectory={isDirectoryUpload ? "true" : undefined}
          directory={isDirectoryUpload ? "true" : undefined}
          onChange={handleFileChange} 
          ref={fileInputRef} 
          className="hidden"
        />
      </div>
      {warning && <p className="text-red-500 dark:text-red-400">{warning}</p>}
      <CompressionOptions 
        onCompressionChange={handleCompressionLevelChange} 
        onZipFileNameChange={handleZipFileNameChange}
        zipFileName={zipFileName}
        compressionLevel={compressionLevel}
        generateNewName={generateNewName}
      />
      <button 
        onClick={zipFiles} 
        disabled={loading}
        className="w-full mt-6 px-6 py-3 rounded-xl font-semibold text-white 
          bg-indigo-500 hover:bg-indigo-600 transform transition-all duration-200 
          hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 
          disabled:cursor-not-allowed disabled:hover:translate-y-0 
          disabled:hover:shadow-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating ZIP...
          </>
        ) : (
          <>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download ZIP
          </>
        )}
      </button>
      {loading && (
        <div className="mt-8 space-y-4">
          {/* Progress bar container */}
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/50">
                Compressing Files
              </span>
              <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-300">
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current file and ETA info */}
          <div className="bg-white/30 dark:bg-gray-900/30 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {currentFile}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated time remaining: {eta} seconds
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Files count badge */}
      {files.length > 0 && !loading && (
        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {files.length} files ready to compress
        </div>
      )}
    </div>
  );
}
