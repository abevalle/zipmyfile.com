'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFolder, faFolderOpen, faTrashAlt, faBroom } from '@fortawesome/free-solid-svg-icons';
import ReactGA from 'react-ga4';

const GA_TRACKING_ID = 'G-3TVBTMF9JR';

ReactGA.initialize(GA_TRACKING_ID);

const FileTree = ({ node, path = '', onDelete, collapsedDirs, toggleCollapse }) => {
  return Object.keys(node).map((key) => {
    const fullPath = path ? `${path}/${key}` : key;
    const isFile = !!node[key].file;

    return (
      <div key={fullPath} className="group">
        <div className="flex items-center py-2 px-3 rounded-lg hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors duration-200">
          <div className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => !isFile && toggleCollapse(fullPath)}
              className={`flex items-center space-x-2 min-w-0 ${!isFile ? 'cursor-pointer' : ''}`}
            >
              <FontAwesomeIcon
                icon={isFile ? faFile : collapsedDirs[fullPath] ? faFolder : faFolderOpen}
                className={`w-4 h-4 ${
                  isFile 
                    ? 'text-indigo-500 dark:text-indigo-400' 
                    : 'text-amber-500 dark:text-amber-400'
                }`}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {key}
              </span>
            </button>
            {isFile && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {(node[key].file.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
          <button 
            onClick={() => onDelete(fullPath)}
            className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
              text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
          </button>
        </div>
        {!isFile && !collapsedDirs[fullPath] && (
          <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <FileTree 
              node={node[key]} 
              path={fullPath} 
              onDelete={onDelete} 
              collapsedDirs={collapsedDirs} 
              toggleCollapse={toggleCollapse} 
            />
          </div>
        )}
      </div>
    );
  });
};

export default function FileList({ files = [], onDelete }) {
  const [collapsedDirs, setCollapsedDirs] = useState({});

  const deleteAllFiles = () => {
    onDelete([]);
    ReactGA.event({
      category: 'User Interaction',
      action: 'Delete All Files',
      label: 'Deleted all files',
    });
  };

  if (files.length === 0) {
    return (
      <div className="rounded-2xl bg-white/50 backdrop-blur-lg dark:bg-gray-800/50 p-6 shadow-xl text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <FontAwesomeIcon icon={faFolder} className="w-12 h-12 mb-4 opacity-50" />
          <p>No files staged for compression</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/50 backdrop-blur-lg dark:bg-gray-800/50 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
          Files ({files.length})
        </h2>
        <button 
          onClick={deleteAllFiles} 
          className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 
            dark:hover:text-red-400 transition-colors duration-200" 
          title="Clear all files"
        >
          <FontAwesomeIcon icon={faBroom} className="w-5 h-5" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-24rem)] rounded-lg">
        <FileTree 
          node={buildFileTree(files)} 
          onDelete={onDelete} 
          collapsedDirs={collapsedDirs} 
          toggleCollapse={toggleCollapse}
        />
      </div>
    </div>
  );

  function buildFileTree(files) {
    return files.reduce((acc, fileObj) => {
      const parts = fileObj.path.split('/');
      let current = acc;
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = index === parts.length - 1 ? fileObj : {};
        }
        current = current[part];
      });
      return acc;
    }, {});
  }

  function toggleCollapse(path) {
    setCollapsedDirs(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  }
}
