import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools, faHeart } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const tools = [
    { name: 'ReverseGif', url: 'https://reversegif.com', description: 'Reverse any GIF instantly' },
    { name: 'Password Generator', url: 'https://thepasswordgenerator.com', description: 'Generate secure passwords' },
    { name: 'Schedulr', url: 'https://schedulr.org', description: 'Bespoke On-demand digital event displays' },
    { name: 'Yiddish Baby Names', url: 'https://yiddishbabynames.com', description: 'Find meaningful Yiddish names' },
    { name: 'Meeting Session', url: 'https://meetingsession.com', description: 'Collaborative Online Whiteboard software' },
  ];

  return (
    <footer className="mt-auto">
      {/* Tools Section */}
      <div className="bg-white/50 backdrop-blur-lg dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
              More Free Tools
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Check out our other free online tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                className="group relative rounded-xl bg-white/30 dark:bg-gray-800/30 p-6 
                  transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-800/50
                  hover:shadow-lg hover:-translate-y-0.5"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-white/30 backdrop-blur-sm dark:bg-gray-900/30"></div>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500 font-semibold">
                ZipMyFile
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <FontAwesomeIcon icon={faHeart} className="text-rose-500 w-4 h-4" />
              <span>by</span>
              <a 
                href="https://www.abevalle.com" 
                className="text-gray-900 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              >
                abevalle
              </a>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
