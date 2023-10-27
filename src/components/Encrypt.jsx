import React, { useState } from 'react'
import { ethers } from 'ethers'
import IPFSutils from './IPFSutils';
import FetchIPFSData from './FetchIPFSData';
import { encrypt } from '@metamask/eth-sig-util';
import identityabi from '../Identityabi.json'
import TransactionSpinner from './TransactionSpinner';


export default function Encrypt(props) {
    let signer = null;
    let provider;
    let encryptedObjectString = null;
    
  
    let [loading, setLoading] = useState(false);
    let [transactionComplete, setTransactionComplete] = useState(false)


    const encryptData = async() =>{
        setLoading(true);
        provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts",[]);
        signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        console.log('Signer: '+signer+'Signer Address: '+signerAddress);
        const identity = new ethers.Contract(import.meta.env.VITE_IDENTITY_CONTRACT,identityabi,signer);
        
        document.getElementById('decryptMessage').hidden = true;
        try {
            if (!props.accountAddress)
                throw new Error("No account connected. Please connect your MetaMask wallet.");
    
            // Request the public encryption key from MetaMask
            const publicKey = await ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [signerAddress], // you must have access to the specified account
            });
            console.log('Public Key:', publicKey);  // Log the public key
    
            const jsonObject = { 
                name: "Hitesh",
                phone: "212341234123",
                DOB: "12.12.12"
            };
    
            // @todo
            // Hash the JSON object to find if it matches 
            const hash = ethers.utils.id(JSON.stringify(jsonObject));
            console.log("Hash of Object: " ,hash)
            // Map the Hash to Address -> if user[hash] != address = then we are good to go otherwise we are going to return Same Identity Already Exists 
            const hascheck = await identity.checkHashOwner(hash);
            console.log('Address: '+hascheck)
           
            console.log('Public Key:', publicKey);
            encryptedObjectString = await encryptJsonObject(publicKey, jsonObject);  // Store the encrypted object string in the global variable
            const responseData = await IPFSutils(encryptedObjectString);
            const jsonObjectReturn = await FetchIPFSData(responseData.IpfsHash);
    
            console.log(responseData.IpfsHash);
            const txResponse = await identity.registerUser(responseData.IpfsHash,publicKey);
            const receipt = await txResponse.wait();
            
            console.log('Encrypted Object:', encryptedObjectString);  // Log the encrypted object string
            console.log('Returning Object:',JSON.parse(jsonObjectReturn));
            
            if(receipt.status == 1){
                setTransactionComplete(true)
                props.showAlert("Transaction Is Successful", 'success');
            }else{
                props.showAlert("Transaction Is Unuccessful", 'danger');
            }
            setLoading(false);
            props.setAccountAddress(txResponse[1])
            
    
        } catch (error) {
            // Check error message to determine which require statement failed
            if (error.message.includes("User already registered")) {
                setLoading(false);
                props.showAlert("USER IS ALREADY REGISTERED❌","danger");
                
            } else if (error.message.includes("user rejected transaction")) {
                props.showAlert("USER DENIED TRANSACTION SIGNATURE⚠️","warning");
            } else if (error.message.includes("IPFS hash already associated with another address")) {
                setLoading(false);
                alert("IPFS hash already associated with another address!");
            }
            else {
                // Handle other errors or display a general error message
                setLoading(false);
                console.error("An error occurred:", error.message);
            }
        }
        finally {
            setLoading(false);
        }
    }

    async function encryptJsonObject(publicKey, jsonObject) {
        console.log('Public Key:', publicKey);
        const stringifiedObject = JSON.stringify(jsonObject);
        console.log(stringifiedObject);
        
        // Create an object to pass to the encrypt function
        const encryptionParams = {
            publicKey: publicKey,
            data: stringifiedObject,
            version: 'x25519-xsalsa20-poly1305',
        };
        
        // Encrypt the stringified JSON object using eth-sig-util
        const encryptedObject = encrypt(encryptionParams);
        
        return JSON.stringify(encryptedObject);  // Convert the encrypted object to a string
      }

  return (
    <div className="sweet-loading">
    {props.accountAddress && (
        <div>
            <button onClick={encryptData}>Register</button>
            <span id="decryptMessage" hidden></span>
            <TransactionSpinner loading={loading} />
        </div>
    )}
</div>
  )
  
}
