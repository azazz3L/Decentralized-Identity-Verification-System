# DIVS

A blockchain-based Decentralized Identity Verification System (DIVS) that leverages MetaMask for secure transactions and data encryption, with a robust User and Requester interface developed using React.

## Description

DIVS is designed as a two-phase project, focusing on secure integration with blockchain technology. It empowers users with a decentralized approach to identity verification.

### Phase 1: User

- **Research**: Evaluation of the feasibility of DApp integration with current technologies.
- **MetaMask Integration**: Implementing MetaMask for transaction signing and data encryption.
- **Development Stack:**
  - **Front-End**: Developed with React.js for a responsive user interface.
  - **Back-End**: Utilizes ethers.js for blockchain interactions.

### Phase 2: Requester

- **Identity Creation & Management**: Leveraging Smart Contracts for identity creation and management.
- **Verification Requests**: Requesters can initiate identity verification requests.
- **Smart Contract Integration**: Incorporating Permission and Verification Contracts for secure approvals and data retrieval.

### Features

- **MetaMask Account Handling**: Automates mnemonic generation and private key provisioning for MetaMask.
- **Data Encryption & IPFS**: Encrypts identity objects and interfaces with IPFS for decentralized storage.
- **Smart Contracts**: Facilitates the mapping of user addresses to blockchain-stored CIDs and manages permissions and verifications.

### Features

- A user-friendly interface equipped with intuitive controls for all DApp functionalities.

### Installation
```
    git clone https://github.com/azazz3L/DIVS-React.git
    cd DIVS-React
    npm install
```

### Usage

- Configure MetaMask in your browser.
- Launch DIVS:

```
    npm run dev
```

- Navigate through the UI to create an identity or submit a verification request.

### License

DIVS is released under the MIT License. See the LICENSE file for further details.
