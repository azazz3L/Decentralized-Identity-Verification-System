import { useState, useEffect } from 'react';
import Navbar from '../src/components/Navbar';
import Register from './components/Register';
import Encrypt from './components/Encrypt';
import { useAddress } from "@thirdweb-dev/react";
import Alert from './components/Alert';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SelectModal from './components/SelectModal';
import UserData from './components/UserData';
import TransactionSpinner from './components/TransactionSpinner';
import RequestDataPage from './components/RequestDataPage';
import UserDashboard from './components/UserDashboard';
import ApprovedDataPage from './components/ApprovedDataPage';




function Navigation() {
  const address = useAddress();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      navigate('/select');
    }else{
    
      navigate('/');
    }
  }, [address]);

  return null; // This component doesn't render anything visibly.
}


function App() {


  const [register, setRegister] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [showIdentity, setIdentity] = useState(false);  
  const [alert, setAlert] = useState(null);
  const [userSelect, setUserSelect] = useState(false)
  const [requester, setRequester] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [fetchedDetails, setFetchedDetails] = useState(null);
  const [userAlert, setUserAlert] = useState(null);  // 'exists', 'notRegistered', or null
  const [loading, setLoading] = useState(false);
  const [networkId, setNetworkId] = useState(null);


  const address = useAddress();
  console.log('Current address:', address);
  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type
    });

    if(message!='Please switch to the Goerli testnet'){
      setTimeout(() => {
        setAlert(null);
      }, 5000);
    }
  
  };

  useEffect(() => {
    if (address !== undefined) {
      setAccountAddress(address);
      setIdentity(false);
      setRegister(false);
    }else {
      setRegister(true);
    }
  }, [address]);

  // watchAccount(account => {
  //   setAccountAddress(account.address ?? '');
  //   if (account.isConnected) {
  //     setRegister(false);
  //   } else {
  //     setRegister(true);
  //     setAccountAddress('');
  //   }
  // });
 
 
 

  useEffect(() => {
    if (userSelect) { 
      const fetchUserDetails = async() => {
        setLoading(true);  // Start loading
        console.log("Fetching user details...");
        setFetchedDetails(null);
        const details = await UserData();
        if (details) {
          setUserExists(true);
          console.log(userExists)
          setFetchedDetails(details);
          console.log(details);
          setUserAlert('exists');
        } else {
          setUserExists(false);
          console.log(userExists)
          setUserAlert('notRegistered');
        }
        setLoading(false);  // End loading
      }
      fetchUserDetails();
    }
  }, [userSelect, accountAddress,address]);
  //Network ID and Changes

  async function checkNetwork() {
    try {
      const currentNetworkId = await window.ethereum.request({ method: 'net_version' });
      setNetworkId(currentNetworkId);
    } catch (error) {
      console.error('Error fetching network ID:', error);
    }
  }

  useEffect(() => {
    checkNetwork();
  
    // Set up an event listener for network changes
    window.ethereum.on('chainChanged', () => {
      checkNetwork();
    });
  
    // Clean up the event listener when the component is unmounted
    return () => {
      window.ethereum.removeListener('chainChanged', checkNetwork);
    };
  }, []);

  useEffect(() => {
    
    if (networkId && networkId !== '11155111') {
      showAlert('Please switch to the Sepolia Testnet⚠️', 'warning');
      }else if(networkId == '11155111'){
        showAlert("You are now on Sepolia Testnet✅",'success')
      }
  }, [networkId]);
  
  return (
    <>
      <BrowserRouter>
        <Navbar setRegister={setRegister} register={register} setIdentity={setIdentity} address={address}/>
        <Alert alert={alert} />
        <Navigation />
        <Routes>
          <Route exact path="/" element={<h1>Welcome To Decentralized Digital Identity Verification System</h1>} />
          <Route exact path='/register' element={<Register showIdentity={showIdentity} />} />
          
          <Route exact path='/select' element={address && <SelectModal setUser={setUserSelect} setRequester={setRequester} />} />
          <Route exact path='/user' element={
            <>
              {loading ? (
                <div className="container">
                  <TransactionSpinner loading={loading}/>
                  </div>
                  ) : userSelect && fetchedDetails ? (
                    <>
                      <span>Account Address: {address}</span>
                      <div className="container">
                        <h3>User ID:{fetchedDetails[0].toString()}</h3>
                        <h3>Address:{fetchedDetails[1]}</h3>
                        <h3>IPFS Hash:{fetchedDetails[2]}</h3>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="container">
                        <h3>User Does Not Exists</h3>
                        <Encrypt accountAddress={address} showAlert={showAlert} setAccountAddress={setAccountAddress}/>
                      </div>
                    </>
                  )}
            </>
          } />
          <Route exact path='/requester' element={<>
              {loading ? (
                <div className="container">
                  <TransactionSpinner loading={loading}/>
                  </div>
                  ) : userSelect && fetchedDetails ? (<RequestDataPage />): (
                    <>
                      <div className="container">
                        <h3>Requester Does Not Exists</h3>
                        <Encrypt accountAddress={address} showAlert={showAlert} setAccountAddress={setAccountAddress}/>
                      </div>
                    </>
                  )}</>} />
          <Route exact path='/dashboard' element={<UserDashboard />} />
          <Route exact path='/approved-data' element={<ApprovedDataPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
