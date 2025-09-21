import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for fully static site
  output: 'export',
  
  // Fix turbopack root directory warning
  turbopack: {
    root: __dirname
  },
  
  // Remove serverExternalPackages since we're not using server functions anymore
  // serverExternalPackages: ['@google-cloud/bigquery'],
  
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
    // For static export, we need to disable the default image optimization
    unoptimized: true,
  },
};

export default nextConfig;
