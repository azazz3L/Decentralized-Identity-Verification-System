import React, { useState } from "react";
import { ethers } from "ethers";
import UserSelector from "./UserSelector";
import DataFieldsSelector from "./DataFieldsSelector";
import datarequestabi from "../Datarequestabi.json"
import TransactionSpinner from "./TransactionSpinner";

function RequestDataPage(props) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedFields, setSelectedFields] = useState([]);
    const contractAddress = import.meta.env.VITE_DATA_REQUEST_CONTRACT;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const dataRequestContract = new ethers.Contract(contractAddress, datarequestabi, signer);
    let [loading, setLoading] = useState(false);
    let [transactionComplete, setTransactionComplete] = useState(false)



    const handleRequest = async () => {
        if (!selectedUser || selectedFields.length === 0) {
            props.showAlert("Please Select a User and Data fields","warning");
            return;
        }

        if(props.signerAddress == selectedUser){
                props.showAlert("User and Signer Cannot be the same","warning");
                return;
        }

        try {
          setLoading(true);
            const tx = await dataRequestContract.requestData(selectedUser, selectedFields);
            await tx.wait();
            setLoading(false);
            props.showAlert("Request Submitted Successfully✅","success")
            
        } catch (err) {
            console.error("Error submitting request:", err);
            props.showAlert("Request Unsuccessful❌","danger")
            setLoading(false);
        }
    };

    return (
        <>
        <div>
            <UserSelector onUserSelect={setSelectedUser} />
            <DataFieldsSelector onFieldsSelect={setSelectedFields} />
            <button onClick={handleRequest}>Request Data</button>
        </div>
        <TransactionSpinner loading={loading} />
        </>
    );
}

export default RequestDataPage;
