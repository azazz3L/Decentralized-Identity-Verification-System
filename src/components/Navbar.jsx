import React from 'react'
import WalletConnect from '../components/WalletConnect'
// import Wallet from './Wallet';
import {
    ConnectWallet,
    darkTheme,
  } from "@thirdweb-dev/react";
  import { Link } from 'react-router-dom'

export default function Navbar(props) {



    const handleRegisterClick = () => {
        props.setIdentity(true);
    }

    const handleW3M = () => {
        props.setIdentity(false);
    }
    


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">Decentralized Identity Verification System (D.I.V.S)</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                    { props.register && (<li className="nav-item "> 
                        <Link id="registerButton" className="nav-link active" aria-current="page" onClick={handleRegisterClick} to='/register'>Register</Link>
                    </li>)}
                    <li className="nav-item">
                        <Link className="nav-link" to='/menu' >Menu</Link>
                    </li>
                    {props.address && (<><li className="nav-item">
                        <Link className="nav-link" to='/dashboard' >Dashboard</Link>
                    </li> 
                   
                    <li className="nav-item">
                        <Link className="nav-link" to="/approved-data">Requests</Link>
                    </li>
                    </>)}
                    <li className="nav-item">
                        <ConnectWallet
                            theme={darkTheme({
                                colors: { primaryButtonBg: "#5cb0ff" },
                              })}
                            btnTitle={"Connect Wallet"}
                            modalTitle={"D.I.V.S"}
                            modalSize={"wide"}
                            welcomeScreen={{
                            title:
                                "Your Gateway to Decentralized Identity",
                            }}
                            modalTitleIconUrl={""}
                        />
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    </>
  )
}
