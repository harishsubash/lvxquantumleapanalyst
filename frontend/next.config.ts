import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'export' for now as it doesn't work with server-side functions
  // output: 'export',
  
  // Fix turbopack root directory warning
  turbopack: {
    root: __dirname
  },
  
  // Ensure server components work properly
  experimental: {
    serverComponentsExternalPackages: ['@google-cloud/bigquery']
  }
};

export default nextConfig;
