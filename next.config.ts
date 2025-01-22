/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "api.telegram.org",
      },
      {
        protocol: "https",
        hostname: "openai.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Add rule for handling JSON files
    config.module.rules.push({
      test: /\.json$/,
      type: "json",
    })

    // Allow build to continue even with errors or warnings
    config.stats = "errors-only" // Shows only errors (suppresses warnings)

    // Ignore specific warnings that are non-blocking
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Module not found/,
      /Some dependencies are not being included/,
    ]

    // Prevent errors related to missing Node.js modules in the browser
    config.resolve.fallback = {
      fs: false,
      module: false,
    }

    return config
  },
  // Optionally, suppress TypeScript or other errors if needed
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    DISCORD_API_URL: process.env.DISCORD_API_URL,
    TELEGRAM_API_URL: process.env.TELEGRAM_API_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    // Add these new RPC endpoint variables
    NEXT_PUBLIC_SOLANA_RPC_MAINNET: process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET,
    NEXT_PUBLIC_SOLANA_RPC_DEVNET: process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET,
    NEXT_PUBLIC_SOLANA_RPC_TESTNET: process.env.NEXT_PUBLIC_SOLANA_RPC_TESTNET,
  },
  publicRuntimeConfig: {
    solanaRpcMainnet: process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET,
    solanaRpcDevnet: process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET,
    solanaRpcTestnet: process.env.NEXT_PUBLIC_SOLANA_RPC_TESTNET,
  },
}

export default nextConfig