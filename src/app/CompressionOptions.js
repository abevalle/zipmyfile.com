'use client'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga4';

const GA_TRACKING_ID = 'G-3TVBTMF9JR';

ReactGA.initialize(GA_TRACKING_ID);

export default function CompressionOptions({ onCompressionChange, onZipFileNameChange, zipFileName, compressionLevel, generateNewName }) {
  const handleZipFileNameChange = (e) => {
    onZipFileNameChange(e);
    ReactGA.event({
      category: 'User Interaction',
      action: 'Change ZIP File Name',
      label: 'Changed ZIP file name',
    });
  };

  const handleGenerateNewName = () => {
    generateNewName();
    ReactGA.event({
      category: 'User Interaction',
      action: 'Generate New ZIP File Name',
      label: 'Generated new ZIP file name',
    });
  };

  const handleCompressionLevelChange = (e) => {
    onCompressionChange(Number(e.target.value));
    ReactGA.event({
      category: 'User Interaction',
      action: 'Change Compression Level',
      label: `Changed compression level to ${e.target.value}`,
    });
  };

  return (
    <div className="p-6 bg-white/50 backdrop-blur-lg dark:bg-gray-800/50 rounded-xl shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Compression Options
      </h2>
      <div className="flex flex-col space-y-6">
        <div className="space-y-3">
          <label htmlFor="zipFileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ZIP File Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="zipFileName"
              value={zipFileName}
              onChange={handleZipFileNameChange}
              className="flex-1 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="Enter ZIP file name"
            />
            <button
              onClick={handleGenerateNewName}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 
                transition-all duration-200 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-indigo-500"
              title="Generate new name"
            >
              <FontAwesomeIcon icon={faSyncAlt} className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="compressionLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Compression Level
            </label>
            <span className="text-sm font-semibold text-indigo-500 dark:text-indigo-400">
              {compressionLevel}
            </span>
          </div>
          <input
            type="range"
            id="compressionLevel"
            min="1"
            max="9"
            value={compressionLevel}
            onChange={handleCompressionLevelChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Faster compression</span>
            <span>Better compression</span>
          </div>
        </div>
      </div>
    </div>
  );
}
