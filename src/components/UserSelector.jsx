import React, { useState } from "react";

function UserSelector({ onUserSelect }) {
    const [userAddress, setUserAddress] = useState('');

    const handleChange = (e) => {
        setUserAddress(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You might want to add some basic validation for Ethereum addresses here
        if (userAddress) {
            onUserSelect(userAddress);
        } else {
            alert("Please enter a valid user address.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Enter user's Ethereum address"
                value={userAddress}
                onChange={handleChange}
            />
            <button type="submit">Select User</button>
        </form>
    );
}

export default UserSelector;
