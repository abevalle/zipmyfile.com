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
      <div key={fullPath} className="relative">
        <div className="flex items-center space-x-2">
          {!isFile && (
            <span className="absolute left-0 top-1/2 w-4 border-l-2 border-gray-500" style={{ transform: 'translateY(-50%)' }}></span>
          )}
          <span className="absolute left-4 top-0 h-full border-b-2 border-gray-500" style={{ transform: 'translateY(-50%)' }}></span>
          <FontAwesomeIcon
            icon={isFile ? faFile : collapsedDirs[fullPath] ? faFolder : faFolderOpen}
            className={isFile ? 'text-blue-500 ml-4' : 'text-yellow-500 cursor-pointer ml-4'}
            onClick={() => !isFile && toggleCollapse(fullPath)}
          />
          <span className={`text-white ${isFile ? '' : 'font-bold cursor-pointer'}`} onClick={() => !isFile && toggleCollapse(fullPath)}>
            {key}
          </span>
          <span className="text-gray-400 text-sm">{isFile && `${(node[key].file.size / 1024).toFixed(2)} KB`}</span>
          <button onClick={() => handleDelete(fullPath)} className="ml-auto text-red-500 hover:text-red-700">
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
        {!isFile && !collapsedDirs[fullPath] && (
          <div className="ml-6 pl-2 border-l-2 border-gray-500">
            <FileTree node={node[key]} path={fullPath} onDelete={onDelete} collapsedDirs={collapsedDirs} toggleCollapse={toggleCollapse} />
          </div>
        )}
      </div>
    );
  });

  function handleDelete(fullPath) {
    onDelete(fullPath);
    ReactGA.event({
      category: 'User Interaction',
      action: 'Delete File',
      label: `Deleted file: ${fullPath}`,
    });
  }
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
    return <div className="mt-4 p-4 bg-gray-700 rounded text-white">No files staged for compression</div>;
  }

  // Group files by directories
  const fileTree = files.reduce((acc, fileObj) => {
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

  const toggleCollapse = (path) => {
    setCollapsedDirs((prev) => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  return (
    <div className="mt-4 p-4 bg-gray-700 rounded overflow-y-auto max-h-[75vh] md:max-h-[75vh] relative">
      <h2 className="text-lg font-bold text-white mb-2">Files staged for compression:</h2>
      <button 
        onClick={deleteAllFiles} 
        className="absolute top-2 right-2 text-white" 
        title="Delete all files"
      >
        <FontAwesomeIcon icon={faBroom} />
      </button>
      <div className="ml-2">
        <FileTree node={fileTree} onDelete={onDelete} collapsedDirs={collapsedDirs} toggleCollapse={toggleCollapse} />
      </div>
    </div>
  );
}
