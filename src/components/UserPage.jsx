import React, { useEffect, useState } from 'react';
import { Link } from "@nextui-org/react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { useTheme } from 'next-themes';
import LoadingSpinner from './LoadingSpinner';

export default function UserPage(props) {
    const { theme } = useTheme();
    const shadowClass = theme === 'dark' ? 'shadow-white' : 'shadow-black';
    const [currentNetworkId, setCurrentNetworkId] = useState(null);

    useEffect(() => {
        const getNetworkId = async () => {
            const networkId = await window.ethereum.request({ method: 'net_version' });
            setCurrentNetworkId(networkId);
        };
    
        // Call getNetworkId to set the initial state
        getNetworkId();
    
        const handleChainChanged = (newChainId) => {
            // Convert chainId from hex to decimal
            const networkId = parseInt(newChainId, 16).toString();
            setCurrentNetworkId(networkId);
        };
    
        // Subscribe to chainChanged event
        window.ethereum.on('chainChanged', handleChainChanged);
    
        // Clean up the event listener when the component unmounts
        return () => window.ethereum.removeListener('chainChanged', handleChainChanged);
    }, []);
    

    return currentNetworkId === '80001' ? (
        <div className="flex justify-center items-center py-20">
            <Card shadow="lg" className={`min-w-[475px] ${theme === 'dark' ? 'light' : 'dark'} bg-background text-foreground ${shadowClass} py-3`}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <div className="w-full flex flex-col items-center mb-2">
                        <h4 className="font-bold text-large">USER DETAILS</h4>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="overflow-visible">
                    <div className="flex h-5 items-center space-x-4 py-4">
                        <h4 className="font-bold text-medium">ID: <span className="font-normal">{props.userId}</span></h4>
                    </div>
                    <div className="flex h-5 items-center space-x-4 py-4">
                        <h4 className="font-bold text-medium">Address: <span className="font-normal">{props.address}</span></h4>
                    </div>
                    <div className="flex h-5 items-center space-x-4 py-4">
                        <Link className="font-bold text-medium" isExternal={true} showAnchorIcon={true} href={`https://white-top-shrimp-287.mypinata.cloud/ipfs/${props.IpfsHash}`} color="foreground">
                            IPFS Data
                        </Link>
                    </div>
                </CardBody>
            </Card>
        </div>
    ) : (
        <LoadingSpinner />
    );
}
