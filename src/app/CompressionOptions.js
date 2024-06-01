'use client'
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

export default function CompressionOptions({ onCompressionChange, onZipFileNameChange, zipFileName, compressionLevel, generateNewName }) {
  return (
    <div className="p-4 bg-gray-700 rounded mt-4">
      <h2 className="text-lg font-bold text-white mb-2">Compression Options</h2>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <div className="flex flex-col items-start md:w-1/2 relative">
          <label htmlFor="zipFileName" className="text-white mb-2">ZIP File Name:</label>
          <div className="flex w-full">
            <input
              type="text"
              id="zipFileName"
              value={zipFileName}
              onChange={onZipFileNameChange}
              className="flex-grow p-2 bg-gray-800 border border-gray-600 rounded-l text-white truncate"
              placeholder="Enter ZIP file name"
            />
            <button
              type="button"
              onClick={generateNewName}
              className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faSyncAlt} />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start md:w-1/2">
          <label htmlFor="compressionLevel" className="text-white mb-2">Compression Level: {compressionLevel}</label>
          <input
            type="range"
            id="compressionLevel"
            min="1"
            max="9"
            value={compressionLevel}
            onChange={(e) => onCompressionChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between w-full text-gray-400 text-xs mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
