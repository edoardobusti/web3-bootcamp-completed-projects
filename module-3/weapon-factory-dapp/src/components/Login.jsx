/* eslint-disable react/prop-types */

import { useAppContext } from "../AppContext.jsx";
import metamaskIcon from "../assets/metamask-icon.png";

function ConnectButton({ getAccounts }) {
  const { dispatch } = useAppContext();

  const connectWalletHandler = async () => {
    if (!window.ethereum) {
      return console.log("MetaMask is not installed");
    }

    dispatch({ type: "CONNECT" });

    const amoyChainId = "0x13882";
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== amoyChainId) {
        await switchToPolygonTestnet(amoyChainId);
      } else {
        await getAccounts();
      }
    } catch (err) {
      console.error("Error checking or switching network:", err);
    }
  };

  const switchToPolygonTestnet = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      await getAccounts();
    } catch (err) {
      if (err.code === 4902) {
        await addPolygonTestnet();
      } else {
        console.error("Failed to switch network:", err);
        alert("Failed to switch to the Polygon Amoy Testnet.");
      }
    }
  };

  const addPolygonTestnet = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x13882",
            chainName: "Amoy",
            nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
            rpcUrls: ["https://rpc-amoy.polygon.technology/"],
            blockExplorerUrls: ["	https://amoy.polygonscan.com/"],
          },
        ],
      });

      await switchToPolygonTestnet("0x13882");
    } catch (err) {
      console.error("Failed to add Polygon Amoy Testnet:", err);
      alert(
        "Failed to add the Polygon Amoy Testnet. Please check the RPC URL or network details.",
      );
    }
  };

  return (
    <button
      type="button"
      className="justify-centergap-2 z-10 mb-2 me-2 flex items-center rounded-lg bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-4 py-2.5 text-center text-lg font-medium text-white shadow-md shadow-purple-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-300 dark:shadow-md dark:shadow-purple-800/80 dark:focus:ring-purple-800"
      onClick={connectWalletHandler}
    >
      <img src={metamaskIcon} alt="Metamask Icon" className="w-8" />
      Connect wallet
    </button>
  );
}

export default ConnectButton;
