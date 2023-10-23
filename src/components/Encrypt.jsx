import React from 'react'
import { ethers } from 'ethers'
import IPFSutils from './IPFSutils';
import FetchIPFSData from './FetchIPFSData';
import { encrypt } from '@metamask/eth-sig-util';

export default function Encrypt(props) {
    let signer = null;
    let provider;
    let encryptedObjectString = null;
    
    const encryptData = async() =>{
        provider = new ethers.providers.Web3Provider(window.ethereum)
        signer = await provider.getSigner();
        console.log(signer);
    
        document.getElementById('decryptMessage').hidden = true;
        try {
            if (!props.accountAddress)
                throw new Error("No account connected. Please connect your MetaMask wallet.");
    
            // Now using props.accountAddress instead of accounts[0]
            const address = props.accountAddress;
    
            // Request the public encryption key from MetaMask
            const publicKey = await ethereum.request({
                method: 'eth_getEncryptionPublicKey',
                params: [address], // you must have access to the specified account
            });
            console.log('Public Key:', publicKey);  // Log the public key
    
            const jsonObject = { 
                name: "Hitesh" 
            };
    
            // @todo
            // Hash the JSON object to find if it matches 
            const hash = ethers.utils.id(JSON.stringify(jsonObject));
            console.log("Hash of Object: " ,hash)
            // Map the Hash to Address -> if user[hash] != address = then we are good to go otherwise we are going to return Same Identity Already Exists 
    
           
            console.log('Public Key:', publicKey);
            encryptedObjectString = await encryptJsonObject(publicKey, jsonObject);  // Store the encrypted object string in the global variable
            const responseData = await IPFSutils(encryptedObjectString);
            const jsonObjectReturn = await FetchIPFSData(responseData.IpfsHash);
    
            console.log(responseData.IpfsHash);
            console.log('Encrypted Object:', encryptedObjectString);  // Log the encrypted object string
            console.log('Returning Object:',JSON.parse(jsonObjectReturn));
    
        } catch (error) {
            console.error(error.message);
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
    <>
    {props.accountAddress && (<div>
       <button onClick={encryptData}>Encrypt</button>
        <span id="decryptMessage" hidden></span>
    </div>
  )}</>)
  
}
