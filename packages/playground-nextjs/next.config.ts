import type { NextConfig } from 'next'
import path from 'path'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // output: 'standalone', // Outputs a Single-Page Application (SPA)
  reactStrictMode: false,
  turbopack: {
    resolveAlias: {
      'rmst-design': './../rmst-design/dist/index.js'
    }
  },
  images: {
    remotePatterns: [{ hostname: '*' }]
  }
}

export default withNextIntl(nextConfig)
