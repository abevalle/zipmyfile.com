import React from 'react';
import ReactGA from 'react-ga4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';

const GA_TRACKING_ID = 'G-3TVBTMF9JR';

ReactGA.initialize(GA_TRACKING_ID);

export default function ToggleSwitch({ isDirectoryUpload, toggleUploadMode }) {
  const handleToggle = () => {
    toggleUploadMode();

    // Google Analytics event for toggle switch
    ReactGA.event({
      category: 'User Interaction',
      action: 'Toggle Upload Mode',
      label: isDirectoryUpload ? 'Switched to File Upload' : 'Switched to Directory Upload',
    });
  };

  return (
    <div className="flex items-center justify-center space-x-8 mb-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm p-4 rounded-xl">
      <button
        onClick={() => isDirectoryUpload && handleToggle()}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
          ${!isDirectoryUpload 
            ? 'bg-indigo-500 text-white shadow-lg' 
            : 'text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400'
          }`}
      >
        <FontAwesomeIcon icon={faFile} className="w-4 h-4" />
        <span className="font-medium">Files</span>
      </button>

      <button
        onClick={() => !isDirectoryUpload && handleToggle()}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
          ${isDirectoryUpload 
            ? 'bg-indigo-500 text-white shadow-lg' 
            : 'text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400'
          }`}
      >
        <FontAwesomeIcon icon={faFolder} className="w-4 h-4" />
        <span className="font-medium">Folder</span>
      </button>
    </div>
  );
}
