import React, { useEffect, useState } from "react";
import styles from "./metamask-auth.module.css";
import Web3 from 'web3';


function isMobileDevice() {
  return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

async function connect(onConnected) {
  if (!window.ethereum) {
    alert("Get MetaMask!");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  onConnected(accounts[0]);
}

async function checkIfWalletIsConnected(onConnected) {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      const account = accounts[0];
      onConnected(account);
      return;
    }

    if (isMobileDevice()) {
      await connect(onConnected);
    }
  }
}


export default function MetaMaskAuth({ onAddressChanged }) {
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected(setUserAddress);
  }, []);

  useEffect(() => {
    onAddressChanged(userAddress);
  }, [userAddress]);

  return userAddress ? (
    <div className={styles.conne}>
      Connected with <Address userAddress={userAddress} />
    </div>
  ) : (
     <Connect setUserAddress={setUserAddress}/>
  );
}

async function disconnectMetaMaskAccounts() {
  // Check if web3 is available
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    // Get the list of connected accounts
    const accounts = await web3.eth.getAccounts();

    // Disconnect only the currently connected account
    if (accounts.length > 0) {
      await window.ethereum.sendAsync({ method: 'eth_accounts' }, (error, result) => {
        const selectedAccount = result.result[0];
        window.ethereum.request({ method: 'eth_disconnect', params: [selectedAccount] });
      });
    }
  }
}


function Connect({ setUserAddress }) {
  disconnectMetaMaskAccounts();
  return (
    <button className={styles.button} onClick={() => connect(setUserAddress)}>
      Connect to MetaMask
    </button>
  );
}


function Address({ userAddress }) {
  return (
    <span className={styles.address}>{userAddress.substring(0, 5)}…{userAddress.substring(userAddress.length - 4)}</span>
  );
}
