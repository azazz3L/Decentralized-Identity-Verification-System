import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import datarequestabi from "../Datarequestabi.json";
import identityabi from "../Identityabi.json";
import decryptData from "./Decrypt";
import LoadingSpinner from "./LoadingSpinner";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import ProgressBar from "./ProgressBar";

function ApprovedDataPage(props) {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const contractAddress = import.meta.env.VITE_DATA_REQUEST_CONTRACT;
  const identityContractAddress = import.meta.env.VITE_IDENTITY_CONTRACT;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const dataRequestContract = new ethers.Contract(
    contractAddress,
    datarequestabi,
    signer
  );
  const identityContract = new ethers.Contract(
    identityContractAddress,
    identityabi,
    signer
  );
  const [fetchedData, setFetchedData] = useState({});
  const [dataIsFetched, setDataIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const shadowClass = theme === "dark" ? "shadow-white" : "shadow-black";
  const buttonStyle =
    theme === "dark"
      ? "bg-black text-white border-white" // White background with black text for dark theme
      : "bg-white text-black border-black"; // Black background with white text for light theme
  const [loading, setLoading] = useState({}); // Changed to an object
  const [requestID, setRequestID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const loggedInRequesterAddress = await signer.getAddress();

      // Using hypothetical function to get requests by requester
      const requestIDs = await dataRequestContract.getRequestsByRequester(
        loggedInRequesterAddress
      );

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
    const response = await fetch(
      `https://white-top-shrimp-287.mypinata.cloud/ipfs/${ipfsHash}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from IPFS");
    }
    return response.json();
  };

  const handleFetchData = async (userAddress, requestId) => {
    try {
      // Set loading for specific request using requestId
      setLoading((prevLoading) => ({ ...prevLoading, [requestId]: true }));

      const response = await identityContract.users(userAddress);
      const ipfsHash = response[3];
      const data = await fetchIPFSData(ipfsHash);
      const dataString = JSON.stringify(data);
      const finalData = await decryptData(dataString);

      // Store fetched data for this user
      setDataIsFetched(true);
      setRequestID(requestId); // Save the requestId of the fetched data
      setFetchedData((prevData) => ({
        ...prevData,
        [requestId]: { ...finalData, address: userAddress },
      }));

      // Unset loading for specific request using requestId
      setLoading((prevLoading) => ({ ...prevLoading, [requestId]: false }));
      props.notifySuccess(theme, "Data Fetched Successfully");
      console.log("IPFS Requester Data:", dataString);
    } catch (err) {
      // Unset loading for specific request using requestId in case of an error
      props.notifyDanger(theme, "Data Fetching Unsuccessful");
      setLoading((prevLoading) => ({ ...prevLoading, [requestId]: false }));
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="w-full flex flex-col items-center py-10">
            <h4 className="font-bold text-2xl ">APPROVED DATA REQUESTS</h4>
          </div>
          <ol>
            {approvedRequests.map((request) => (
              <li key={request.id}>
                <div className="flex justify-center items-center pb-10 ">
                  <Card
                    shadow="lg"
                    className={`min-w-[475px] ${
                      theme === "dark" ? "light" : "dark"
                    } bg-background text-foreground ${shadowClass} `}
                  >
                    <CardBody className="overflow-visible">
                      <div className="flex h-5 items-center space-x-4 py-4">
                        <h4 className="font-bold text-medium">
                          Request ID:{" "}
                          <span className="font-normal">
                            {request.id.toString()}
                          </span>
                        </h4>
                      </div>
                      <div className="flex h-5 items-center space-x-4 py-4">
                        <h4 className="font-bold text-medium">
                          User Address:{" "}
                          <span className="font-normal">{request.user}</span>
                        </h4>
                      </div>
                      {request.status === 0 && (
                        <div className="flex h-5 items-center space-x-4 py-4">
                          <h4 className="font-bold text-medium">
                            Status:{" "}
                            <span className="font-normal text-orange-500">
                              Pending
                            </span>
                          </h4>
                        </div>
                      )}
                      {request.status === 2 && (
                        <div className="flex h-5 items-center space-x-4 py-4">
                          <h4 className="font-bold text-medium">
                            Status:{" "}
                            <span className="font-normal text-red-500">
                              Rejected
                            </span>
                          </h4>
                        </div>
                      )}
                      {request.status === 1 && (
                        <div className="flex h-5 items-center space-x-4 pt-4">
                          <h4 className="font-bold text-medium">
                            Status:{" "}
                            <span className="font-normal text-green-500">
                              Approved
                            </span>
                          </h4>
                        </div>
                      )}
                    </CardBody>
                    <CardFooter className="pb-4">
                      {request.status === 1 && (
                        <>
                          <Button
                            size="md"
                            className={`${buttonStyle}`}
                            fullWidth="true"
                            onClick={() =>
                              handleFetchData(request.user, request.id)
                            }
                          >
                            FETCH DATA
                          </Button>
                        </>
                      )}
                    </CardFooter>
                    {loading[request.id] && <ProgressBar />}{" "}
                    {/* Show ProgressBar based on individual request */}
                  </Card>
                </div>
              </li>
            ))}
          </ol>

          {Object.keys(fetchedData).length > 0 && (
            <div className="w-full flex flex-col items-center py-10">
              <h4 className="font-bold text-2xl">FETCHED DATA</h4>
            </div>
          )}
          <ol>
            {Object.entries(fetchedData).map(([id, data]) => (
              <li key={id}>
                {data && (
                  <>
                    <div className="flex justify-center items-center pb-10 ">
                      <Card
                        shadow="lg"
                        className={`min-w-[475px] ${
                          theme === "dark" ? "light" : "dark"
                        } bg-background text-foreground ${shadowClass} `}
                      >
                        <CardBody className="overflow-visible">
                          {data && (
                            <div className="flex h-5 items-center space-x-4 py-4">
                              <h4 className="font-bold text-medium">
                                Request ID:{" "}
                                <span className="font-normal">{id}</span>
                              </h4>
                            </div>
                          )}
                          {data.name && (
                            <div className="flex h-5 items-center space-x-4 py-4">
                              <h4 className="font-bold text-medium">
                                User Name:{" "}
                                <span className="font-normal">{data.name}</span>
                              </h4>
                            </div>
                          )}
                          {data.phone && (
                            <div className="flex h-5 items-center space-x-4 py-4">
                              <h4 className="font-bold text-medium">
                                User Phone:{" "}
                                <span className="font-normal">
                                  {data.phone}
                                </span>
                              </h4>
                            </div>
                          )}
                          {data.DOB && (
                            <div className="flex h-5 items-center space-x-4 py-4">
                              <h4 className="font-bold text-medium">
                                User Date Of Birth:{" "}
                                <span className="font-normal">{data.DOB}</span>
                              </h4>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

export default ApprovedDataPage;
