import { useState, useEffect } from 'react';
import Register from './components/Register';
import Encrypt from './components/Encrypt';
import { useAddress } from "@thirdweb-dev/react";
import Alert1 from './components/Alert1';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SelectModal from './components/SelectModal';
import UserData from './components/UserData';
import TransactionSpinner from './components/TransactionSpinner';
import RequestDataPage from './components/RequestDataPage';
import UserDashboard from './components/UserDashboard';
import ApprovedDataPage from './components/ApprovedDataPage';
import { useLocation } from 'react-router-dom';
import Navbar2 from './components/Navbar';
import {Card, NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import RequesterCardUI from "./components/RequesterCardUI"
import Homepage from "./components/Homepage"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';
import { Slide} from 'react-toastify';

  // Alert
  const notifyInfo = (theme) =>  toast.info('🦄 Wow so easy!', {
    position:"bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme === 'dark' ? 'light' : 'dark',
    });

const notifyWarnTestNet = (theme) => {
  toast.warn('Connect To Polygon Mumbai Testnet', {
    position:"bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme === 'dark' ? 'light' : 'dark',
    });
}

const notifyTestNetSuccess = (theme) => {
  toast.success('Successfully Connected To Polygon Mumbai Testnet', {
    position:"bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme === 'dark' ? 'light' : 'dark',
    });
}
function Navigation() {
  const address = useAddress();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      navigate('/menu');
    }else{
    
      navigate('/');
    }
  }, [address]);

  return null; // This component doesn't render anything visibly.
}

function RouterHandler({ setRequester,showAlert,networkId}) {
  const location = useLocation();
  const { theme } = useTheme();
  useEffect(() => {
    if(location.pathname === '/'){
      
    }
    else if (location.pathname === '/requester') {
      setRequester(true);
    }else if (networkId && networkId !== '80001') { 
      notifyWarnTestNet(theme );
      showAlert('Please switch to the Polygon Mumbai Testnet⚠️', 'warning');
      }else if(networkId == '80001'){
        notifyTestNetSuccess(theme );
        showAlert("You are now on Polygon Mumbai Testnet✅",'success')
      }
  }, [location, setRequester, networkId]);

  return null;  // This component doesn't render anything visibly.
}

function App() {

  const navigate = useNavigate();
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
  
  const { theme } = useTheme();


  const address = useAddress();
  console.log('Current address:', address);
  const showAlert = (message, type) => {
   
    setAlert({
      message: message,
      type: type
    });

    if(message!='Please switch to the Sepolia testnet'){
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
    if (userSelect || requester) { 
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
  }, [userSelect, accountAddress,address,requester]);
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


  
  return (
    <>
    
    <NextUIProvider navigate={navigate}>
    <NextThemesProvider  defaultTheme="dark"
      themes={['light', 'dark']} 
      attribute="class"  >
    {/* <main className="purple-dark text-foreground bg-background"> */}
      <Navbar2 setRegister={setRegister} register={register} setIdentity={setIdentity} address={address}/>
        {/* <Navbar setRegister={setRegister} register={register} setIdentity={setIdentity} address={address}/> */}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          transition={Slide}
          draggable
          pauseOnHover
          theme={theme === 'dark' ? 'light' : 'dark'}
          />
        <Navigation />
        <RouterHandler setRequester={setRequester} showAlert={showAlert} networkId={networkId}/>
        <Routes>
          <Route exact path="/" element={<Homepage notify={notifyInfo}/>} />
          <Route exact path='/register' element={<Register showIdentity={showIdentity} />} />
          
          <Route exact path='/menu' element={address && <SelectModal setUser={setUserSelect} setRequester={setRequester} />} />
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
                  ) : requester && fetchedDetails ? (<>
                 <RequesterCardUI showAlert={showAlert} signerAddress={address}/></>): (
                    <>
                      <div className="container">
                        <h3>Requester Does Not Exists</h3>
                        <Encrypt accountAddress={address} showAlert={showAlert} setAccountAddress={setAccountAddress}/>
                      </div>
                    </>
                  )}</>} />
          <Route exact path='/dashboard' element={<UserDashboard showAlert={showAlert}/>} />
          <Route exact path='/approved-data' element={<ApprovedDataPage />} />
        </Routes>
        {/* </main> */}
        </NextThemesProvider>
      </NextUIProvider>
</>
)
}

export default App;
