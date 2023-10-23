
export default async function FetchIPFSData(ipfsHash) {
        const gatewayURL = 'https://white-top-shrimp-287.mypinata.cloud/ipfs/';
        try {
            const response = await fetch(gatewayURL + ipfsHash);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();  // Use `.json()` if the content is a JSON object
            return data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    
}
