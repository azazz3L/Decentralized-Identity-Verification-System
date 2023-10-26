import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import datarequestabi from "../Datarequestabi.json";
import identityabi from "../Identityabi.json";
import TransactionSpinner from "./TransactionSpinner";
import decryptData from "./Decrypt";


function ApprovedDataPage() {
    const [approvedRequests, setApprovedRequests] = useState([]);
    const contractAddress = import.meta.env.VITE_DATA_REQUEST_CONTRACT;
    const identityContractAddress = import.meta.env.VITE_IDENTITY_CONTRACT;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const dataRequestContract = new ethers.Contract(contractAddress, datarequestabi, signer);
    const identityContract = new ethers.Contract(identityContractAddress, identityabi, signer);
    const [fetchedData, setFetchedData] = useState({});
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const loggedInRequesterAddress = await signer.getAddress();
    
            // Using hypothetical function to get requests by requester
            const requestIDs = await dataRequestContract.getRequestsByRequester(loggedInRequesterAddress);
    
            const requests = [];
            for (const requestId of requestIDs) {
                const requestData = await dataRequestContract.requests(requestId);
                requests.push(requestData); // Add all requests regardless of their status
            }
    
            setApprovedRequests(requests);
            setIsLoading(false); // End loading
        };
    
        fetchData();
    }, []);
    

    // Use FetchIPFSData.jsx
    const fetchIPFSData = async (ipfsHash) => {
        const response = await fetch(`https://white-top-shrimp-287.mypinata.cloud/ipfs/${ipfsHash}`);
        if (!response.ok) {
            throw new Error("Failed to fetch data from IPFS");
        }
        return response.json();
    };

    const handleFetchData = async (userAddress) => {
        try {
            const response = await identityContract.users(userAddress);
            const ipfsHash = await response[3];
            const data = await fetchIPFSData(ipfsHash);
            const dataString = JSON.stringify(data);
            const finalData = await decryptData(dataString);
            
            // Store fetched data for this user
            setDataIsFetched(true)
            setFetchedData(prevData => ({ ...prevData, [userAddress]: finalData }));
            
            console.log("IPFS Requester Data:", dataString);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };
    

   return (
    <div>
          {isLoading ? (
                <div className="container">
                    <TransactionSpinner loading={isLoading}/> {/* Assuming TransactionSpinner is your loading component */}
                </div>
            ) : (
            <>
            <h2>Approved Data Requests</h2>
            <ol>
            {approvedRequests.map(request => (
                <li key={request.id}>
                    <p>Request ID: {request.id.toString()}</p>
                    <p>User Address: {request.user}</p>
                    {/* Conditional rendering based on the request's status */}
                    {request.status === 0 && <p>Status: Pending</p>}
                    {request.status === 1 ? (
                        <button onClick={() => handleFetchData(request.user)}>Fetch Data</button> 
                
                    ) : (
                        request.status === 2 && <p>Status: Rejected</p>
                    )}
                </li>
            ))}
        </ol>
        
        <h2>Fetched Data</h2>
        <ol>
    {Object.entries(fetchedData).filter(([_, data]) => data).map(([address, data]) => (
        <li key={address}>
        {`User Address: ${address}`}:
            {data.name && <p>User Name: {data.name}</p>}
            {data.phone && <p>User Phone: {data.phone}</p>}
            {data.DOB && <p>User DOB: {data.DOB}</p>}
            {/* Add similar checks for other properties as needed */}
        </li>
    ))}
</ol></> )}
    </div>
);

    
}

export default ApprovedDataPage;
