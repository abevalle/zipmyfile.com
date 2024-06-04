import React from 'react';
import ReactGA from 'react-ga4';

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
    <div className="flex items-center mb-4">
      <span className="text-gray-900 dark:text-white mr-2">File Upload</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isDirectoryUpload} 
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
      <span className="text-gray-900 dark:text-white ml-2">Directory Upload</span>
    </div>
  );
}
