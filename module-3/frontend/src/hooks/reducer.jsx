export default function reducer(state, action) {
  switch (action.type) {
    case "CONNECT":
      return {
        ...state,
        status: "connecting",
      };
    case "CONNECTED":
      return {
        ...state,
        provider: action.payload.provider,
        signer: action.payload.signer,
        contract: action.payload.contract,
        account: action.payload.wallet,
        accountValue: action.payload.value,
        status: "connected",
      };

    case "TX_ACTION":
      return {
        ...state,
        txStatus: action.payload,
      };

    case "ERROR":
      return {
        ...state,
        error: { value: action.payload.value, message: action.payload.message },
      };

    default:
      break;
  }
}
