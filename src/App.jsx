import { useState } from 'react'
import Navbar from '../src/components/Navbar'
import Register from './components/Register'
import { watchAccount, disconnect, getAccount } from '@wagmi/core'
import Encrypt from './components/Encrypt'

function App() {

  const [register, setRegister] = useState(true);
  const [accountAddress, setAccountAddress] = useState('')
  const [showIdentity, setIdentity] = useState(false);

  watchAccount(account => {
    setAccountAddress(account.address ?? '')
    if (account.isConnected) {
      setRegister(false);
    } else{
      setRegister(true);
      setAccountAddress('');
    }
})

  return (
    <>
    <Navbar setRegister={setRegister} register={register} setIdentity={setIdentity}/>
    <Register showIdentity={showIdentity}  />
    {accountAddress!='' && (<span>Account Address: {accountAddress}</span>)}
    <Encrypt accountAddress={accountAddress}/>
    </>
  )
}

export default App
