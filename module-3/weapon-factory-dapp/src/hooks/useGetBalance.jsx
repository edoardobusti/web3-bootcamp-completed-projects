import { useState, useEffect } from "react";

const useGetBalance = (id, contract, account, txStatus, dispatch) => {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const fetchBalance = async () => {
      if (contract && account) {
        try {
          const bal = await contract.getBalanceOf(account, id);
          setBalance(bal.toString());
        } catch {
          dispatch({
            type: "ERROR",
            payload: {
              value: true,
              message: "Reason: Error fetching the balance",
            },
          });
        }
      }
    };

    if (txStatus === "idle") {
      fetchBalance();
    }
  }, [id, contract, account, txStatus, dispatch]);

  return { balance };
};

export default useGetBalance;
