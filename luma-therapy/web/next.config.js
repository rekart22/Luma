/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  devIndicators: false,
  allowedDevOrigins: [
    "*.macaly.dev",
    "*.macaly.app",
    "*.macaly-app.com",
    "*.macaly-user-data.dev",
  ],
  // Added to fix CSS refresh issues
  webpack: (config, { dev, isServer }) => {
    // Disable persistent caching in dev mode to prevent stale CSS
    if (dev) {
      config.cache = false;
    }
    
    // Output more verbose webpack logs
    config.infrastructureLogging = {
      level: 'verbose',
    };
    
    return config;
  },
  // Increase stability on Windows systems
  experimental: {
    // Reduce file system operations
    optimizeCss: false,
    // Use polling instead of filesystem events (more stable on Windows)
    staticPageGenerationTimeout: 120,
  },
};

module.exports = nextConfig;
