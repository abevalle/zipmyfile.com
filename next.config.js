// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Enable WebAssembly support
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true, // or syncWebAssembly: true if needed
      };
  
      // Optional: Add specific rules for WebAssembly files
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async", // or "webassembly/sync" if needed
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  