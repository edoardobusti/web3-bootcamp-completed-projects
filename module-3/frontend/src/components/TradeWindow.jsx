/* eslint-disable react/prop-types */

import { useState } from "react";
import { useAppContext } from "../AppContext";

import TradingItem from "./TradingItem";

import tradeIcon from "../assets/trade-icon-colored.svg";
import goBackIcon from "../assets/go-back-icon.svg";
import orderLoading from "../assets/order-loading.svg";

function TradeWindow({ id, onClose, title, imageUrl }) {
  const { contract, dispatch } = useAppContext();

  const [isPendingTx, setIsPendingTx] = useState(false);
  const [isSelected, setIsSelected] = useState(null);

  const itemsToBuy = [];

  for (let i = 0; i <= 2; i++) {
    if (i !== id) {
      itemsToBuy.push({ id: i });
    }
  }

  const handleTradeItem = async () => {
    try {
      setIsPendingTx(true);
      const tx = await contract.tradeItems(id, isSelected);
      await tx.wait();
      dispatch({ type: "TX_ACTION", payload: `idle` });
      onClose();
    } catch (error) {
      setIsPendingTx(false);
      dispatch({
        type: "ERROR",
        payload: {
          value: true,
          message: `${
            error.shortMessage === "could not coalesce error"
              ? "Try to increase the gass fee"
              : error.shortMessage
          }`,
        },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="w-fit rounded bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-medium text-fuchsia-500">
          Select the item you want to buy
        </h2>
        <div className="mb-6 flex items-center gap-12">
          <div className="flex flex-col gap-4">
            <img src={imageUrl} className="w-24" alt="" />
            <div>
              <p className="whitespace-normal text-xl font-medium text-black">
                #{id} {title}
              </p>
            </div>
          </div>
          <img src={tradeIcon} className="w-8" alt="" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {itemsToBuy.map((item) => (
              <TradingItem
                id={item.id}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                key={item.id}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleTradeItem}
            className={`z-10 rounded-lg px-3.5 py-2.5 ${
              isSelected === null
                ? "cursor-not-allowed bg-gray-500 bg-opacity-50"
                : "flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800"
            }`}
            disabled={isSelected === null}
          >
            {isPendingTx ? (
              <>
                Pending
                <img src={orderLoading} className="h-4 animate-spin"></img>
              </>
            ) : (
              "Continue"
            )}
          </button>
          {!isPendingTx && (
            <button
              onClick={onClose}
              className="z-10 mb-2 me-2 flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-center font-medium text-fuchsia-500"
            >
              Go back <img src={goBackIcon} className="w-4" alt="" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TradeWindow;
