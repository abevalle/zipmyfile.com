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
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded mt-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Compression Options</h2>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <div className="flex flex-col items-start md:w-1/2 relative">
          <label htmlFor="zipFileName" className="text-gray-900 dark:text-white mb-2">ZIP File Name:</label>
          <div className="flex w-full">
            <input
              type="text"
              id="zipFileName"
              value={zipFileName}
              onChange={handleZipFileNameChange}
              className="flex-grow p-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l text-gray-900 dark:text-white truncate"
              placeholder="Enter ZIP file name"
            />
            <button
              type="button"
              onClick={handleGenerateNewName}
              className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faSyncAlt} />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start md:w-1/2">
          <label htmlFor="compressionLevel" className="text-gray-900 dark:text-white mb-2">Compression Level: {compressionLevel}</label>
          <input
            type="range"
            id="compressionLevel"
            min="1"
            max="9"
            value={compressionLevel}
            onChange={handleCompressionLevelChange}
            className="w-full"
          />
          <div className="flex justify-between w-full text-gray-400 dark:text-gray-500 text-xs mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
