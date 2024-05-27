// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.18;

contract IdentityContract {
    struct User {
        uint256 id;
        address publicKey; // This is an Ethereum address.
        string ipfsHash;
        string encryptedIpfsHash;
        bool userFlag;
        bool requesterFlag;
        string userPublicKey; // User's cryptographic public key
    }

    mapping(address => User) public users;
    mapping(string => address) public hashCheck; // Keeps track of addresses associated with each IPFS hash
    uint256 private userCounter = 0;

    event UserRegistered(
        uint256 indexed userId,
        address indexed publicKey,
        string ipfsHash,
        string userPublicKey
    );
    event HashAssociated(address indexed userAddress, string hash);

    /**
     * Register a new user.
     *
     * @param _ipfsHash - IPFS hash of the user's data.
     * @param _userPublicKey - User's public encryption key.
     */
    function registerUser(
        string memory _ipfsHash,
        string memory _userPublicKey
    ) public {
        require(users[msg.sender].id == 0, "User already registered");
        require(
            hashCheck[_ipfsHash] == address(0),
            "IPFS hash already associated with another address"
        );

        userCounter++;
        User memory newUser = User({
            id: userCounter,
            publicKey: msg.sender,
            ipfsHash: _ipfsHash,
            encryptedIpfsHash: "",
            userFlag: true,
            requesterFlag: false,
            userPublicKey: _userPublicKey
        });
        users[msg.sender] = newUser;
        hashCheck[_ipfsHash] = msg.sender;

        emit UserRegistered(userCounter, msg.sender, _ipfsHash, _userPublicKey);
    }

    /**
     * Get detailed information of a registered user.
     *
     * @param _userAddress - Ethereum address of the user.
     */
    function getUser(
        address _userAddress
    )
        public
        view
        returns (uint256, address, string memory, string memory, string memory)
    {
        require(users[_userAddress].id != 0, "User not registered");
        User memory user = users[_userAddress];
        return (
            user.id,
            user.publicKey,
            user.ipfsHash,
            user.userPublicKey,
            user.encryptedIpfsHash
        );
    }

    /**
     * Get the IPFS hash linked to the sender.
     */
    function getUserIPFSHash() public view returns (string memory) {
        require(users[msg.sender].id != 0, "User not registered");
        return users[msg.sender].ipfsHash;
    }

    /**
     * Set or update the encrypted IPFS hash for the sender.
     *
     * @param _encryptedIpfsHash - Encrypted IPFS hash of the user's data.
     */
    function setRequesterIpfsHash(string memory _encryptedIpfsHash) public {
        require(users[msg.sender].id != 0, "User not registered");
        users[msg.sender].encryptedIpfsHash = _encryptedIpfsHash;
    }

    /**
     * Check the owner of a specific hash.
     *
     * @param _hash - The hash string.
     * @return - Address of the owner if exists, otherwise the zero address.
     */
    function checkHashOwner(string memory _hash) public view returns (address) {
        return hashCheck[_hash];
    }
}
