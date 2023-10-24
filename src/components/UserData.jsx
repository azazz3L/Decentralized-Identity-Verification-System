import React from 'react';
import { ethers } from 'ethers';
import identityabi from '../Identityabi.json';

export default async function UserData() {
    // Smart Contract 
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const identity = new ethers.Contract(import.meta.env.VITE_IDENTITY_CONTRACT, identityabi, signer);
    try {
        const userDetails = await identity.getUser(await signer.getAddress());
        console.log(userDetails);
        return userDetails; // Return userDetails if user is found
    } catch (error) {
        if (error.message.includes("User not registered")) {
            console.log("User is not registered.");
            return null; // Return null if user is not registered
        } else {
            console.error("An unexpected error occurred:", error.message);
            throw error; // Throw the error so you can catch it in the calling component if necessary
        }
    }
}
