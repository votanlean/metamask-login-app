import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

function App() {
  const signMessage = async () => {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const address = await signer.getAddress();

    fetch(`http://localhost:8000/get-nonce?address=${address}`)
      .then((response) => response.json())
      .then((data) => {
        const nonce = data.nonce;
        const message = `Welcome! Click to sign in

Nonce: ${nonce}`;
        signer.signMessage(message).then((signature) => {
          fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              signature: signature,
              address: address,
            }),
          })
            .then((response) => response.json())
            .then((data) => console.log("data", data));
        });
      });
  };
  return (
    <div className="App">
      <button onClick={signMessage}>Sign Message</button>
    </div>
  );
}

export default App;
