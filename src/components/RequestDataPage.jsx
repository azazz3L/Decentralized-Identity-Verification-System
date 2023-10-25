import React, { useState } from "react";
import { ethers } from "ethers";
import UserSelector from "./UserSelector";
import DataFieldsSelector from "./DataFieldsSelector";
import datarequestabi from "../Datarequestabi.json"

function RequestDataPage() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedFields, setSelectedFields] = useState([]);
    const contractAddress = import.meta.env.VITE_DATA_REQUEST_CONTRACT;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const dataRequestContract = new ethers.Contract(contractAddress, datarequestabi, signer);

    const handleRequest = async () => {
        if (!selectedUser || selectedFields.length === 0) {
            alert("Please select a user and data fields.");
            return;
        }

        try {
            const tx = await dataRequestContract.requestData(selectedUser, selectedFields);
            await tx.wait();
            alert("Request submitted!");
        } catch (err) {
            console.error("Error submitting request:", err);
        }
    };

    return (
        <div>
            <UserSelector onUserSelect={setSelectedUser} />
            <DataFieldsSelector onFieldsSelect={setSelectedFields} />
            <button onClick={handleRequest}>Request Data</button>
        </div>
    );
}

export default RequestDataPage;
