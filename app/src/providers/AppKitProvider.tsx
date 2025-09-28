import React from 'react'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, celoSepolia, sepolia } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from 'viem'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = '59198889d7df78b39ea70d871d0ec131'

// 2. Create a metadata object - optional
const metadata = {
  name: 'Credora',
  description: 'Privacy-First Lending Platform',
  url: 'https://credora.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const horizonTestnet = defineChain({
  id: 845320009, // Replace this with your chain's ID
  name: 'horizonTestnet',
  network: 'horizonTestnet',
  nativeCurrency: {
    decimals: 18, // Replace this with the number of decimals for your chain's native token
    name: 'ETH',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ['https://horizen-rpc-testnet.appchain.base.org'],
    }
  },
  blockExplorers: {
    default: {name: 'Explorer', url: 'https://horizen-explorer-testnet.appchain.base.org/'}
  }
});

// 3. Set the networks
const networks = [mainnet, arbitrum, horizonTestnet, celoSepolia, sepolia]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// 5. Create modal - this initializes the AppKit but doesn't open the modal
createAppKit({
  adapters: [wagmiAdapter],
  //@ts-ignore
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 40
  }
})

interface AppKitProviderProps {
  children: React.ReactNode;
}

export function AppKitProvider({ children }: AppKitProviderProps) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}