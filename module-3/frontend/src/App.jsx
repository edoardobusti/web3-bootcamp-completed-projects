import "./index.css";

import { ethers } from "ethers";
import { useAppContext } from "./AppContext.jsx";

import { contractAddress, contractAbi } from "./helpers.js";

import Login from "./components/Login.jsx";
import LoginLoader from "./components/LoginLoader.jsx";
import GameInterface from "./components/GameInterface.jsx";

function App() {
  const { status, dispatch } = useAppContext();

  const getAccounts = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const value = await provider.getBalance(accounts[0]);

      dispatch({
        type: "CONNECTED",
        payload: {
          provider: provider,
          signer: signer,
          contract: new ethers.Contract(contractAddress, contractAbi, signer),
          wallet: accounts[0],
          value: ethers.formatEther(value),
        },
      });
    } catch (error) {
      console.error("Failed to get accounts or balance:", error);
    }
  };

  return (
    <>
      <main className="relative z-10 flex h-screen w-full items-center justify-center">
        {status == null ? (
          <Login getAccounts={getAccounts} />
        ) : status === "connecting" ? (
          <LoginLoader />
        ) : status === "connected" ? (
          <GameInterface getAccounts={getAccounts} />
        ) : null}
      </main>
    </>
  );
}

export default App;
