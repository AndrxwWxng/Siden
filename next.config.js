const path = require('path');
const webpack = require('webpack');

// Check if we're in a Vercel build environment
const isVercelBuild = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production';
const skipApiCollection = process.env.SKIP_API_COLLECTION === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Set all dashboard routes to force-dynamic rendering
  experimental: {
    // Configuration for newer Next.js features
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["localhost:3000"]
    },
  },

  // Enable Turbopack
  turbopack: {},

  // Generate source maps for better debugging
  productionBrowserSourceMaps: true,

  // Override specific routes
  async rewrites() {
    return {
      beforeFiles: [
        // Add any required rewrites here
      ],
    };
  },
  // Set specific route rules for Vercel
  async headers() {
    return [
      {
        // Force dynamic rendering for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'x-middleware-cache',
            value: 'no-cache',
          },
        ],
      },
      {
        // Force dynamic rendering for dashboard routes
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'x-middleware-cache',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
  
  serverExternalPackages: [
    "@mastra/*",
    "google-auth-library",
    "googleapis",
    "@llamaindex/readers",
    "@llamaindex/azure",
    "@llamaindex/core",
    "@llamaindex/cloud",
    "@llamaindex/env",
    "@llamaindex/*",
    "pino-abstract-transport",
    "pino-pretty",
    '@node-postgres/pg-typed',
    'pgvector',
    'postgres',
    'pg',
    'pg-native',
    'better-sqlite3',
    'libsql',
    'crypto-js',
  ],
  // Empty transpilePackages to avoid conflicts with serverExternalPackages
  transpilePackages: [],
};

// Only add webpack config when not using Turbopack
// This prevents the warning about webpack being configured while Turbopack is in use
if (process.env.NEXT_RUNTIME !== 'edge' && !process.env.TURBOPACK) {
  nextConfig.webpack = (config, { isServer }) => {
    // Handle MongoDB client-side encryption issue by stubbing dependencies
    if (!isServer) {
      // Add externals configuration to exclude LlamaIndex packages
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        ({ context, request }, callback) => {
          if (request.startsWith('@llamaindex/') || request.startsWith('@mastra/') || 
              request === 'pino-abstract-transport' || request === 'pino-pretty' ||
              request === 'worker_threads') {
            // Exclude server-only packages from the client bundle
            return callback(null, 'commonjs ' + request);
          }
          callback();
        },
      ];
      
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
        'googleapis': false,
        'google-auth-library': false,
        // Stub all LlamaIndex packages on the client side
        '@llamaindex/readers': path.resolve(__dirname, './src/lib/stubs/llamaindex-readers.js'),
        '@llamaindex/readers/obsidian': path.resolve(__dirname, './src/lib/stubs/llamaindex-readers.js'),
        '@llamaindex/readers/obsidian/dist/index.js': path.resolve(__dirname, './src/lib/stubs/llamaindex-readers.js'),
        '@llamaindex/core': path.resolve(__dirname, './src/lib/stubs/llamaindex-core.js'),
        '@llamaindex/azure': path.resolve(__dirname, './src/lib/stubs/llamaindex-azure.js'),
        '@llamaindex/cloud': false,
        '@llamaindex/env': false,
        'worker_threads': path.resolve(__dirname, './src/lib/stubs/worker_threads.js'),
        'pino-abstract-transport': path.resolve(__dirname, './src/lib/stubs/pino-abstract-transport.js'),
        'pino-pretty': path.resolve(__dirname, './src/lib/stubs/pino-pretty.js')
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
      'node:fs': false,
      net: false,
      tls: false,
      dns: false,
      os: false,
      'node:os': false,
      path: false,
      'node:path': false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      crypto: false,
      'worker_threads': path.resolve(__dirname, './src/lib/stubs/worker_threads.js'),
      process: require.resolve('process/browser'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
    };
    
    // Add polyfill for buffer and process
    if (!isServer) {
      config.plugins = [
        ...(config.plugins || []),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ];
    }
    
    config.externals.push({
      'crypto-js': 'crypto-js',
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pg-native': false,
    };
    
    return config;
  };
}

module.exports = nextConfig; 