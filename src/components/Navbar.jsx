import React,{ useState,useEffect } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {
    ConnectWallet,
  } from "@thirdweb-dev/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTheme } from "next-themes";


const darkTheme = {
    colors: {
        modalBg: "#ffffff",
        dropdownBg: "#ffffff",
        primaryText: "#000000",
        connectedButtonBg: "#ffffff",
        secondaryButtonText: "#0a0a0a",
        borderColor: "#050505",
        primaryButtonBg: "#ffffff",
        primaryButtonText: "#000000",
        accentText: "#005ce6",
        accentButtonBg: "#005ce6",
        separatorLine: "#1a191a",
        danger: "#e84f30",
        success: "#31a56d",
        secondaryText: "#676670",
        accentButtonText: "#000000",
        secondaryButtonBg: "#fafafa",
        secondaryButtonHoverBg: "#000000",
        connectedButtonBgHover: "#000000",
        walletSelectorButtonHoverBg:
          "#f5f4f5",
        skeletonBg: "#e8e7e9",
        selectedTextColor: "#f9f5f9",
        secondaryIconHoverBg: "#e5e6eb",
      },
    // ... other styling options for dark theme
  };
  
  const lightTheme = {
    colors: {
        modalBg: "#131418",
        dropdownBg: "#131418",
        primaryText: "#ffffff",
        connectedButtonBg: "#131418",
        secondaryButtonText: "#fdf7f7",
        borderColor: "#e6e5e6",
        primaryButtonBg: "#050505",
        primaryButtonText: "#ffffff",
        accentText: "#005ce6",
        accentButtonBg: "#005ce6",
        separatorLine: "#e9e7e9",
        danger: "#e84f30",
        success: "#31a56d",
        secondaryText: "#6f6e77",
        accentButtonText: "#fdfcfd",
        secondaryButtonBg: "#ebeaeb",
        secondaryButtonHoverBg: "#e1e0e1",
        connectedButtonBgHover: "#f8f6f8",
        walletSelectorButtonHoverBg:
          "#f5f4f5",
        skeletonBg: "#e8e7e9",
        selectedTextColor: "#f9f5f9",
      },
    // ... other styling options for light theme
  };


export default function Navbar2(props) {

    const { theme } = useTheme();
    const [activeLink, setActiveLink] = useState(null);
    const handleRegisterClick = () => {
        props.setIdentity(true);
        setActiveLink('register');
    }


    const handleLinkClick = (linkName) => {
        setActiveLink(linkName);
      };
    
      useEffect(() => {
        if (props.address) {
            setActiveLink(null); // Reset active link when a wallet is connected
        }
    }, [props.address]);
    const getColor = (linkName) => activeLink === linkName ? 'primary' : 'foreground';
    
  return (
    <Navbar isBordered position="sticky" maxWidth="full">

    <NavbarBrand>
        <p style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>D.I.V.S</p>
    </NavbarBrand>
   {props.address && ( <NavbarContent justify="center">
        <NavbarItem isActive={activeLink === "features"}>
            <Link 
                color={getColor("features")}
                onClick={() => handleLinkClick("features")} 
                href="/menu"
            >
                Menu
            </Link>
        </NavbarItem>
        <NavbarItem isActive={activeLink === "customers"}>
            <Link 
                color={getColor("customers")}
                onClick={() => handleLinkClick("customers")} 
                href="/dashboard"
            >
                Dashboard
            </Link>
        </NavbarItem>
        <NavbarItem isActive={activeLink === "integrations"}>
            <Link 
                color={getColor("integrations")}
                onClick={() => handleLinkClick("integrations")} 
                href="/approved-data"
            >
                Requests
            </Link>
        </NavbarItem>
    </NavbarContent>)}
    <NavbarContent justify="end">
        {props.register && (
            <NavbarItem isActive={activeLink === "register"}>
                <Link 
                    color={getColor("register")}
                    onClick={handleRegisterClick} 
                    href="/register"
                >
                    Register
                </Link>
            </NavbarItem>
        )}
        <NavbarItem>
                        <ConnectWallet
                            theme={theme === 'dark' ? darkTheme : lightTheme}
                            btnTitle={"Connect Wallet"}
                            modalTitle={"D.I.V.S"}
                            modalSize={"wide"}
                            
                            welcomeScreen={{
                                img: {
                                    src: "/welcome.png" ,
                                    width: 400,
                                    height: 400,
                                  },
                            title:
                                "YOUR GATEWAY TO DECENTRALIZED IDENTITY",
                            }}
                            modalTitleIconUrl={
                                "/logo.png"
                              }
                            
                        />
        </NavbarItem>
        <NavbarItem>
            <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
