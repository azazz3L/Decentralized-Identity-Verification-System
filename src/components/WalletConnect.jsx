import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { arbitrum, mainnet } from 'wagmi/chains'

// 1. Get projectId
const projectId = '3ce88b0b57de36857717df6f1535f381'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains,
    includeWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
      ],
      excludeWalletIds: [
        'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',

      ],
      themeMode: 'dark',
      themeVariables: {
        '--w3m-color-mix': 'grey',
        '--w3m-color-mix-strength': 20
      }
    })

export default function WalletConnect() {
    return <w3m-button />
  }