/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext } from "react";
import { PinataSDK } from "pinata-web3";

import reducer from "./hooks/reducer.jsx";

const AppContext = createContext();

const pinata = new PinataSDK({
  pinataGateway: "white-used-marten-599.mypinata.cloud",
});

const initialState = {
  pinata: pinata,
  txStatus: "idle",
  cooldown: false,
  error: {
    value: false,
    message: "",
  },
};

function AppProvider({ children }) {
  const [
    {
      provider,
      pinata,
      signer,
      contract,
      account,
      accountValue,
      txStatus,
      lastMintTime,
      error,
      status,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider
      value={{
        provider,
        pinata,
        signer,
        contract,
        account,
        accountValue,
        txStatus,
        lastMintTime,
        error,
        status,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("AppContext used outside the AppProvider");

  return context;
}

export { AppProvider, useAppContext };
