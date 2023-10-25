export default async function decryptData(encryptedObjectString) {
    try {
        if (!encryptedObjectString)
            throw new Error("No encrypted data found. Please encrypt data first.");

        // Decrypt the encrypted object string using MetaMask's eth_decrypt method
        const decryptedMessage = await ethereum.request({
            method: 'eth_decrypt',
            params: [encryptedObjectString, ethereum.selectedAddress],
        });

        const decryptedObject = JSON.parse(decryptedMessage);
       
        console.log('Decrypted Object:', decryptedObject);  // Log the decrypted object
        return decryptedObject;

    } catch (error) {
        console.error(error.message);
    }
}