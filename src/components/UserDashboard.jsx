import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import datarequestabi from "../Datarequestabi.json";
import FetchIPFSData from "./FetchIPFSData";
import IPFSutils from "./IPFSutils";
import identityabi from "../Identityabi.json";
import { encrypt } from "@metamask/eth-sig-util";
import LoadingSpinner from "./LoadingSpinner";
import { Card, CardFooter, CardBody, Button } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { useTheme } from "next-themes";
import ProgressBar from "./ProgressBar";

function UserDashboard(props) {
  const [userRequests, setUserRequests] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = import.meta.env.VITE_DATA_REQUEST_CONTRACT;
  const identityContractAddress = import.meta.env.VITE_IDENTITY_CONTRACT;
  const identityContract = new ethers.Contract(
    identityContractAddress,
    identityabi,
    signer
  );
  const dataRequestContract = new ethers.Contract(
    contractAddress,
    datarequestabi,
    signer
  );
  const RequestStatus = ["Pending", "Approved", "Rejected"];
  const [isLoading, setIsLoading] = useState(false);
  const [noOfTransaction, setNoOfTransaction] = useState(0);
  const { theme } = useTheme();
  const shadowClass = theme === "dark" ? "shadow-white" : "shadow-black";
  const buttonStyle =
    theme === "dark"
      ? "bg-black text-white border-white" // White background with black text for dark theme
      : "bg-white text-black border-black"; // Black background with white text for light theme

  const [loading, setLoading] = useState({}); // Changed to an object

  useEffect(() => {
    async function fetchRequests() {
      setIsLoading(true);
      const userAddress = await signer.getAddress();

      // Fetch detailed request data instead of just IDs
      const requests = await dataRequestContract.getDetailedUserRequests(
        userAddress
      );

      const formattedRequests = requests.map((req) => ({
        request: req,
        status: RequestStatus[req.status], // Use the status directly from the struct
      }));

      setUserRequests(formattedRequests);
      setIsLoading(false);
    }

    fetchRequests();
  }, []);

  async function handleApprove(request) {
    try {
      setLoading(true);
      setLoading((prevLoading) => ({ ...prevLoading, [request.id]: true })); // Set loading for specific request
      setNoOfTransaction(3);
      const address = await signer.getAddress();
      const ipfsHash = await identityContract.getUserIPFSHash();
      const encryptedData = await FetchIPFSData(ipfsHash);
      const response = await identityContract.getUser(request.requester);
      const requesterPublicKey = await response[3];
      console.log(encryptedData);

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts[0]);
      // Decrypt the user's data using eth_decrypt (assuming this is an encrypted JSON string)

      const decryptedData = await window.ethereum.request({
        method: "eth_decrypt",
        params: [encryptedData, address],
      });
      setNoOfTransaction(2);
      const decryptedObject = JSON.parse(decryptedData);
      console.log(decryptedObject);

      // Get requester's public key
      // const requesterPublicKey = await window.ethereum.request({
      //     method: 'eth_getEncryptionPublicKey',
      //     params: [request.requester],  // Assuming request is in scope or you fetch it earlier in the function
      // });

      console.log("Public Key of Requester", requesterPublicKey);

      // Encrypt the data using requester's public key. This requires an encryption utility.
      // For this example, let's assume you have a utility function encryptWithPublicKey.
      const encryptedForRequester = await encryptJsonObject(
        requesterPublicKey,
        decryptedObject,
        request.fields
      );
      console.log(encryptedForRequester);

      // Upload the encrypted data to IPFS
      const encryptedIpfsHash = await IPFSutils(encryptedForRequester);
      console.log("Encrypted Requester IPFS Hash:", encryptedIpfsHash.IpfsHash);
      // Store the encrypted IPFS hash on the Identity contract

      const tx = await identityContract.setRequesterIpfsHash(
        encryptedIpfsHash.IpfsHash
      );
      await tx.wait();

      setNoOfTransaction(1);
      // Finally, approve the request on the dataRequestContract

      const dataRequestTx = await dataRequestContract.approveRequest(
        request.id
      );
      await dataRequestTx.wait();

      // Update the status in local state
      setUserRequests((prev) =>
        prev.map((req) =>
          req.request.id === request.id ? { ...req, status: "Approved" } : req
        )
      );
      setLoading(false);
      setLoading((prevLoading) => ({ ...prevLoading, [request.id]: false })); // Unset loading for specific request
      props.notifySuccess(theme, "Request Approved");
    } catch (err) {
      setLoading(false);
      setLoading((prevLoading) => ({ ...prevLoading, [request.id]: false })); // Unset loading for specific request
      console.error("Error approving request:", err);
      props.notifyDanger(theme, "Request Failed");
    }
  }

  async function handleReject(requestId) {
    try {
      // Set loading for specific request
      setLoading((prevLoading) => ({ ...prevLoading, [requestId]: true }));

      const tx = await dataRequestContract.rejectRequest(requestId);
      await tx.wait();

      // Update the status in local state
      setUserRequests((prev) =>
        prev.map((req) =>
          req.request.id === requestId ? { ...req, status: "Rejected" } : req
        )
      );

      // Set loading for specific request to false after the transaction
      setLoading((prevLoading) => ({ ...prevLoading, [requestId]: false }));
      props.notifySuccess(theme, "Request Rejected");
    } catch (err) {
      // Set loading for specific request to false in case of an error
      props.notifyDanger(theme, "Request Failed");
      setLoading((prevLoading) => ({ ...prevLoading, [requestId]: false }));
      console.error("Error rejecting request:", err);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "Pending":
        return "text-orange-500"; // Tailwind CSS class for orange text
      case "Approved":
        return "text-green-500"; // Tailwind CSS class for green text
      case "Rejected":
        return "text-red-500"; // Tailwind CSS class for red text
      default:
        return ""; // Default, no additional color
    }
  }

  async function encryptJsonObject(publicKey, jsonObject, fields) {
    console.log("Public Key:", publicKey);
    console.log("Fields to encrypt:", fields);
  
    // Filter out only the relevant fields from the jsonObject
    const filteredObject = {};
    fields.forEach((field) => {
      if (jsonObject.hasOwnProperty(field)) {
        filteredObject[field] = jsonObject[field];
      }
    });
  
    const stringifiedObject = JSON.stringify(filteredObject);
    console.log("Filtered JSON object:", stringifiedObject);
  
    // Create an object to pass to the encrypt function
    const encryptionParams = {
      publicKey: publicKey,
      data: stringifiedObject,
      version: "x25519-xsalsa20-poly1305",
    };
  
    // Encrypt the stringified JSON object using eth-sig-util
    const encryptedObject = encrypt(encryptionParams);
  
    return JSON.stringify(encryptedObject); // Convert the encrypted object to a string
  }
  

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="w-full flex flex-col items-center py-10">
            <h4 className="font-bold text-2xl ">DASHBOARD</h4>
          </div>
          <ol>
            {userRequests.map(({ request, status }, index) => (
              <div
                key={request.id}
                className="flex justify-center items-center pb-10 "
              >
                <Card
                  shadow="lg"
                  className={`min-w-[475px] ${
                    theme === "dark" ? "light" : "dark"
                  } bg-background text-foreground ${shadowClass} `}
                >
                  <CardBody className="overflow-visible">
                    <div className="flex h-5 items-center space-x-4 py-4">
                      <h4 className="font-bold text-medium">
                        Requester:{" "}
                        <span className="font-normal">{request.requester}</span>
                      </h4>
                    </div>
                    <div className="flex h-5 items-center space-x-4 py-4">
                      <h4 className="font-bold text-medium">
                        Fields:{" "}
                        <span className="font-normal">
                          {request.fields.join(", ")}
                        </span>
                      </h4>
                    </div>
                    <div className="flex h-5 items-center space-x-4 py-4">
                      <h4 className="font-bold text-medium">
                        Status:{" "}
                        <span
                          className={`font-normal ${getStatusColor(status)}`}
                        >
                          {status}
                        </span>
                      </h4>
                    </div>
                  </CardBody>
                  <CardFooter className="pb-4">
                    {status === "Pending" && (
                      <div className="w-full flex h-5 items-center space-x-4">
                        <Button
                          size="md"
                          className={`${buttonStyle}`}
                          fullWidth="true"
                          onClick={() => handleApprove(request)}
                        >
                          Approve
                        </Button>
                        <Divider orientation="vertical" />
                        <Button
                          size="md"
                          className={`${buttonStyle}`}
                          fullWidth="true"
                          onClick={() => handleReject(request.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                  {loading[request.id] && <ProgressBar />}{" "}
                  {/* Show ProgressBar based on individual request */}
                </Card>
              </div>
            ))}
          </ol>
        </>
      )}
    </>
  );
}

export default UserDashboard;
