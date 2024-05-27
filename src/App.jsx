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
import "./components/Homepage.css"; // Make sure this CSS file contains the updated styles
import PDFUpload from './components/PDFUpload';


  // Alert
  let toastId 
  const notifyInfo = (theme) =>  toast.info('Connect To Polygon Amoy', {
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
    }else if (networkId && networkId !== '80002') { 
      notifyWarnTestNet(theme );
      }else if(networkId == '80002'){
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
  const [jsonObject, setJsonObject] = useState(false)
  const [userData, setUserData] = useState('')

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
      setJsonObject(false)
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
    let isMounted = true; // Flag to manage cleanup and prevent state update if the component unmounts
  
    const fetchUserDetails = async () => {
      if (!isMounted) return; // Exit if the component is already unmounted
  
      setLoading(true);  // Start loading
      setJsonObject(false)
      console.log("Fetching user details...");
      setFetchedDetails(null); // Reset previous details
      try {
        const details = await UserData(); // Fetch user data
  
        if (!isMounted) return; // Check again before updating state
  
        if (details) {
          console.log("The details are", details);
          setUserExists(true);
          setFetchedDetails(details);
          setUserAlert('exists');
        } else {
          setUserExists(false);
          setUserAlert('notRegistered');
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        if (!isMounted) return; // Check again before updating state
  
        setUserExists(false);
        setUserAlert('error'); // Indicate an error occurred
      } finally {
        if (isMounted){ setLoading(false)
        console.log(loading)};  // End loading only if still mounted
      }
    };
  
    if (userSelect || requester) {
      fetchUserDetails();
    }
  
    return () => {
      isMounted = false; // Set the flag as false when the component unmounts
    };
  }, [userSelect, accountAddress, requester, networkId]); // Include all variables that affect the effect
  
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
            <div className="flex centered">
            <h1 className="font-bold text-4xl">Metamask Is Not Installed</h1>
          </div>
          )
        } />
          <Route exact path='/register' element={<Register showIdentity={showIdentity} />} />
          
          <Route exact path='/menu' element={address && <SelectModal setUser={setUserSelect} setRequester={setRequester} />} />
          <Route exact path='/user' element={
            <>
              {loading ? <LoadingSpinner /> : userSelect && fetchedDetails ? (
                    <>
                    <UserPage address={address} userId={fetchedDetails[0].toString()} IpfsHash={fetchedDetails[2]}/>
                    </>
                  ) : (
                    <>
<<<<<<< HEAD
                      <div className="container">
                        <h3>User Does Not Exists</h3>
                        <PDFUpload />
                      </div>
=======
                      <PDFUpload accountAddress={address} setAccountAddress={setAccountAddress} jsonObject={setJsonObject} setUserData={setUserData}/>
                      {jsonObject && <Encrypt accountAddress={address} setAccountAddress={setAccountAddress} userData={userData} />}
>>>>>>> 9d1cfea79dc3abe9a4e42e7596919a200514af9c
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
                <PDFUpload accountAddress={address} setAccountAddress={setAccountAddress} jsonObject={setJsonObject} setUserData={setUserData}/>
                  {jsonObject && <Encrypt accountAddress={address} setAccountAddress={setAccountAddress} userData={userData} />}
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
