import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@mastra/*"],
  
  // Add transpilePackages for LlamaIndex packages
  transpilePackages: [
    '@llamaindex/azure',
    '@llamaindex/readers',
    '@llamaindex/core'
  ],
  
  webpack: (config, { isServer }) => {
    // Handle MongoDB client-side encryption issue by stubbing dependencies
    if (!isServer) {
      // Specifically target the problematic MongoDB module
      config.resolve.alias = {
        ...config.resolve.alias,
        // Stub out the MongoDB client-side encryption manager
        './client-side-encryption/mongocryptd_manager': false,
        // Make certain Node built-ins resolve to false
        'child_process': false,
        'mongodb-client-encryption': false,
        'kerberos': false,
        'aws4': false,
        '@aws-sdk/credential-providers': false,
      };
    }
    
    // Stub Node.js modules unconditionally during bundling to avoid 'child_process' errors
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      child_process: false,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      os: false,
      path: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      crypto: false,
      process: require.resolve('process/browser'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
    };
    
    // Add polyfill for buffer and process
    if (!isServer) {
      config.plugins = [
        ...(config.plugins || []),
        // @ts-ignore - webpack 5 config type issue
        new config.constructor.webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ];
    }
    
    return config;
  },
};

export default nextConfig;
