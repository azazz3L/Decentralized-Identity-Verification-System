import { useState, useEffect, useRef } from 'react';
import Register from './components/Register';
import Encrypt from './components/Encrypt';
import { useAddress } from "@thirdweb-dev/react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import SelectModal from './components/SelectModal';
import UserData from './components/UserData';
import UserDashboard from './components/UserDashboard';
import ApprovedDataPage from './components/ApprovedDataPage';
import { useLocation } from 'react-router-dom';
import Navbar2 from './components/Navbar';
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import RequesterCardUI from "./components/RequesterCardUI"
import Homepage from "./components/Homepage"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';
import { Slide} from 'react-toastify';
import UserPage from './components/UserPage';
import LoadingSpinner from './components/LoadingSpinner';


  // Alert
  let toastId 
  const notifyInfo = (theme) =>  toast.info('Connect To Polygon Mumbai', {
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
  toastId.current = toast.warn('Connect To Polygon Mumbai', {
    position:"bottom-center",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    closeButton:false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme === 'dark' ? 'light' : 'dark',
    });
}

const notifyTestNetSuccess = (theme) => {
  toast.update(toastId.current,{ render: "Successfully Connected To Polygon Mumbai",
  type: "success",
  autoClose: 2000,
  closeOnClick: true,
  closeButton:true,
  theme: theme === 'dark' ? 'light' : 'dark',
  });
}

const notifyWarn = (theme,content) => {
  toast.warn(content, {
    position:"bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton:true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme === 'dark' ? 'light' : 'dark',
    });
}
 
const notifySuccess = (theme,content) => {
  toast.success(content,{
    position:"bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton:true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme === 'dark' ? 'light' : 'dark',
  });
}

const notifyDanger = (theme,content) => {
  toast.error(content,{
    position:"bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    closeButton:true,
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

function RouterHandler({ setRequester,networkId}) {
  const location = useLocation();
  const { theme } = useTheme();
  useEffect(() => {
    if(location.pathname === '/'){
      
    }
    else if (location.pathname === '/requester') {
      setRequester(true);
    }else if (networkId && networkId !== '80001') { 
      notifyWarnTestNet(theme );
      }else if(networkId == '80001'){
        notifyTestNetSuccess(theme );
      }
  }, [setRequester, networkId]);

  return null;  // This component doesn't render anything visibly.
}

function App() {

  const navigate = useNavigate();
  const [register, setRegister] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [showIdentity, setIdentity] = useState(false);  
  const [userSelect, setUserSelect] = useState(false)
  const [requester, setRequester] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [fetchedDetails, setFetchedDetails] = useState(null);
  const [userAlert, setUserAlert] = useState(null);  // 'exists', 'notRegistered', or null
  const [loading, setLoading] = useState(false);
  const [networkId, setNetworkId] = useState(null);
  const { theme } = useTheme();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(null);


  const address = useAddress();
  console.log('Current address:', address);

  useEffect(() => {
    // Safe check for window.ethereum
    const checkMetaMaskInstalled = () => {
      return typeof window.ethereum !== 'undefined';
    };

    setIsMetaMaskInstalled(checkMetaMaskInstalled());
  }, []);

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
  }, [userSelect, accountAddress,address,requester,networkId]);
  //Network ID and Changes



// New Network ID Checker
useEffect(() => {
  // Only run if window.ethereum is available
  if (window.ethereum) {
    const handleChainChanged = (newChainId) => {
      // Convert chainId from hex to decimal
      const networkId = parseInt(newChainId, 16).toString();
      setNetworkId(networkId);
    };

    // Subscribe to chainChanged event
    window.ethereum.on('chainChanged', handleChainChanged);

    // Fetch the current network ID
    window.ethereum.request({ method: 'net_version' })
      .then(currentNetworkId => {
        setNetworkId(currentNetworkId);
      })
      .catch(error => {
        console.error('Error fetching network ID:', error);
      });

    // Clean up the event listener when the component unmounts
    return () => window.ethereum.removeListener('chainChanged', handleChainChanged);
  } else {
    // If window.ethereum is not available, set MetaMask as not installed
    setIsMetaMaskInstalled(false);
  }
}, []);

  toastId = useRef(null);
  
  return (
    <>
    
    <NextUIProvider navigate={navigate}>
    <NextThemesProvider  defaultTheme="dark"
      themes={['light', 'dark']} 
      attribute="class"  >
    {/* <main className="purple-dark text-foreground bg-background"> */}
      <Navbar2 setRegister={setRegister} register={register} setIdentity={setIdentity} address={address} checkMetmask={isMetaMaskInstalled}/>
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
        <RouterHandler setRequester={setRequester} networkId={networkId}/>
        <Routes>
        <Route exact path="/" element={
          isMetaMaskInstalled ? (
            <Homepage notify={notifyInfo} />
          ) : (
            <div className="container">
              <h2>MetaMask Not Installed</h2>
            </div>
          )
        } />
          <Route exact path='/register' element={<Register showIdentity={showIdentity} />} />
          
          <Route exact path='/menu' element={address && <SelectModal setUser={setUserSelect} setRequester={setRequester} />} />
          <Route exact path='/user' element={
            <>
              {loading ? (
                  <LoadingSpinner />
                  ) : userSelect && fetchedDetails ? (
                    <>
                    <UserPage address={address} userId={fetchedDetails[0].toString()} IpfsHash={fetchedDetails[2]}/>
                    </>
                  ) : (
                    <>
                      <div className="container">
                        <h3>User Does Not Exists</h3>
                        <Encrypt accountAddress={address} setAccountAddress={setAccountAddress}/>
                      </div>
                    </>
                  )}
            </>
          } />
          <Route exact path='/requester' element={<>
              {loading ? (
                  <LoadingSpinner />
                  ) : requester && fetchedDetails ? (<>
                 <RequesterCardUI notifyWarn={notifyWarn} notifyDanger={notifyDanger} notifySuccess={notifySuccess} signerAddress={address}/></>): (
                    <>
                      <div className="container">
                        <h3>Requester Does Not Exists</h3>
                        <Encrypt accountAddress={address} setAccountAddress={setAccountAddress}/>
                      </div>
                    </>
                  )}</>} />
          <Route exact path='/dashboard' element={<UserDashboard notifyWarn={notifyWarn} notifyDanger={notifyDanger} notifySuccess={notifySuccess} />} />
          <Route exact path='/approved-data' element={<ApprovedDataPage notifyWarn={notifyWarn} notifyDanger={notifyDanger} notifySuccess={notifySuccess}/>} />
        </Routes>
        {/* </main> */}
        </NextThemesProvider>
      </NextUIProvider>
</>
)
}

export default App;
