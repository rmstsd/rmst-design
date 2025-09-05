import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA)
  reactStrictMode: false,
  turbopack: {
    resolveAlias: {
      'rmst-design': './../rmst-design/dist/index.js'
    }
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'rmst-design': path.resolve(__dirname, './../rmst-design/dist/index.js')
    }

    return config
  }
}

export default nextConfig
