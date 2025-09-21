import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'export' for now as it doesn't work with server-side functions
  // output: 'export',
  
  // Fix turbopack root directory warning
  turbopack: {
    root: __dirname
  },
  
  // Move serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: ['@google-cloud/bigquery'],
  
  // Configure images for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
