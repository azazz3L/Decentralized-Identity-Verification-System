import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  walletConnect
} from "@thirdweb-dev/react";

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <ThirdwebProvider
      activeChain="goerli"
      clientId={import.meta.env.VITE_REACT_APP_CLIENT_ID}
      supportedWallets={[metamaskWallet(),
        walletConnect()]}
    >
    <App />
    </ThirdwebProvider>,
)
