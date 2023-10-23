import { useState, useEffect } from 'react'
import Navbar from '../src/components/Navbar'
import Register from './components/Register'
import { watchAccount, disconnect, getAccount } from '@wagmi/core'
import Encrypt from './components/Encrypt'
import { useAddress } from "@thirdweb-dev/react";
import Alert from './components/Alert'

function App() {

  const [register, setRegister] = useState(true);
  const [accountAddress, setAccountAddress] = useState('')
  const [showIdentity, setIdentity] = useState(false);  
  const [alert, setAlert] = useState(null);

  const showAlert = (message,type) => {
      setAlert({
         message : message,
         type : type
      })
      setTimeout(() => {
        setAlert(null);
      }, 5000);
   }

  const address = useAddress();
  useEffect(() => {
    if (address) {
      setAccountAddress(address);
      setIdentity(false)
      setRegister(false)
    }else{
      setRegister(true)
    }
  }, [address]);

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
    <Navbar setRegister={setRegister} register={register} setIdentity={setIdentity} />
    <Alert alert={alert}/>
    <Register showIdentity={showIdentity}  />
    {address!=undefined && (<span>Account Address: {address}</span>)}
    <Encrypt accountAddress={address} showAlert={showAlert}/>
    </>
  )
}

export default App
