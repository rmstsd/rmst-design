import type { NextConfig } from 'next'
import path from 'path'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

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
  },
  images: {
    remotePatterns: [{ hostname: '*' }]
  }
}

export default withNextIntl(nextConfig)
