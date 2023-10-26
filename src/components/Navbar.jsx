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
                                img: {
                                    src: "https://o.remove.bg/downloads/a535bd84-48e1-4105-9a3e-c71d508dd261/DALL_E_2023-10-26_16.51.16_-_Photo_rendering_of_a_next-generation_identity_card_on_a_transparent_background._The_card_showcases_advanced_biometrics__including_fingerprint_scanning-removebg-preview.png",
                                    width: 400,
                                    height: 400,
                                  },
                            title:
                                "Your Gateway to Decentralized Identity",
                            }}
                            modalTitleIconUrl={
                                "https://o.remove.bg/downloads/760d0d13-73b0-4fb6-bb3d-84d4095f3a8a/DALL_E_2023-10-26_16.59.16_-_Illustration_of_a_modern_favicon_with_a_futuristic_touch_but_without_any_glare._The_design_features_a_stylized_letter_D_on_a_partially_visible_simple_-removebg-preview.png"
                              }
                            
                        />
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    </>
  )
}
