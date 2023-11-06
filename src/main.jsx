import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  ThirdwebProvider,
  metamaskWallet,
  walletConnect
} from "@thirdweb-dev/react";
import "./index.css";
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(

<BrowserRouter>
  <ThirdwebProvider
      activeChain="mumbai" 
      clientId={import.meta.env.VITE_REACT_APP_CLIENT_ID}
      supportedWallets={[metamaskWallet(),
        walletConnect()]}
    >
    <App />
    </ThirdwebProvider>
    </BrowserRouter>
)
