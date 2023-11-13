import React, { useState } from "react";
import { ethers } from "ethers";

export default function Register(props) {
  const [showMnemonic, setMnemonic] = useState(false);
  const [mnemonicValue, setMnemonicValue] = useState("");
  const [privateKeyValue, setPrivateKeyValue] = useState("");
  const [privateKeyRetValue, setPrivateKeyRetValue] = useState("");
  const [retrieve, setRetrieve] = useState(false);

  function createNewIdentity() {
    setRetrieve(false);
    const identity = ethers.Wallet.createRandom();
    console.log("Mnemonic:", identity.mnemonic.phrase);
    console.log("Private Key:", identity.privateKey);
    setMnemonicValue(identity.mnemonic.phrase);
    setPrivateKeyValue(identity.privateKey);
    setMnemonic(true);
  }

  function retrieveIdentity() {
    setRetrieve(true);
    setMnemonic(false);
    const mnemonic = document.getElementById("mnemonicInput").value;
    if (mnemonic.split(" ").length !== 12) {
      alert("Mnemonic should be a 12-word phrase.");
      return;
    }
    const wallet = ethers.Wallet.fromMnemonic(mnemonic); // <-- Corrected this line
    setPrivateKeyRetValue(wallet.privateKey);

    console.log("Private Key:", wallet.privateKey);
  }

  return (
    <>
      {props.showIdentity && (
        <div id="registerOptions">
          <button onClick={createNewIdentity}>Create New Identity</button>
          <div>
            <button onClick={retrieveIdentity}>Retrieve Identity</button>
            <input
              type="text"
              id="mnemonicInput"
              placeholder="Enter 12-word mnemonic"
            />
          </div>
          {showMnemonic && (
            <div id="identityInfo">
              <div className="text-center">
                <h2>Mnemonic:</h2>
                <strong>
                  <span>{mnemonicValue}</span>
                </strong>
                <h2>Private Key:</h2>
                <strong>
                  <span>{privateKeyValue}</span>
                </strong>
              </div>
            </div>
          )}

          {retrieve && (
            <div id="privateKeyInfo">
              <div className="text-center">
                <h2>Private Key:</h2>
                <strong>
                  <span>{privateKeyRetValue}</span>
                </strong>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
