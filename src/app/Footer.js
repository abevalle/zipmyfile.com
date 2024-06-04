import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700 mt-auto">
      <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row md:items-center">
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">
              ZipMyFile
            </span>
            <p className="mt-4 text-gray-600 dark:text-gray-400 md:ml-6 md:mt-0">
              Zip and manage your files with ease.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Home
            </a>
            <a href="https://reversegif.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              ReverseGif.com
            </a>
            <a href="https://thepasswordgenerator.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              ThePasswordGenerator.com
            </a>
          </div>
          <p className="mt-8 text-gray-600 dark:text-gray-400 md:mt-0">
            © 2024 ZipMyFile. All rights reserved. Made by <a href="https://www.abevalle.com" className="text-gray-900 dark:text-white">abevalle</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
