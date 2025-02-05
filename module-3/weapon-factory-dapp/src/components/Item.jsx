/* eslint-disable react/prop-types */

import { useState } from "react";
import { useAppContext } from "../AppContext.jsx";

import useFetchItemData from "../hooks/useFetchItemData.jsx";
import useGetBalance from "../hooks/useGetBalance.jsx";
import useMintCooldown from "../hooks/useMintCooldown.jsx";

import InfoItemWindow from "./InfoItemWindow.jsx";
import TradeWindow from "./TradeWindow.jsx";
import DeleteWindow from "./DeleteWindow.jsx";
import ErrorWindow from "./ErrorWindow.jsx";

import infoIcon from "../assets/info-icon.png";
import orderIcon from "../assets/order-item.svg";
import deleteIcon from "../assets/delete-item.svg";
import tradeIcon from "../assets/trade-icon.svg";
import orderLoading from "../assets/order-loading.svg";
import produceIcon from "../assets/produce-item.svg";

function Item({ id }) {
  const { pinata, provider, contract, account, txStatus, error, dispatch } =
    useAppContext();

  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const { cooldownRemaining, isMintAllowed, isLoadingCooldown } =
    useMintCooldown(id, contract, provider, 60, txStatus);
  const { title, description, imageUrl, isSpecial } = useFetchItemData(
    id,
    pinata,
    contract,
    account,
    dispatch,
  );

  const { balance } = useGetBalance(id, contract, account, txStatus, dispatch);

  const handleOrderItem = async () => {
    try {
      dispatch({ type: "TX_ACTION", payload: `ordering-${id}` });

      const tx = await contract.orderItem(id);
      await tx.wait();

      dispatch({ type: "TX_ACTION", payload: `idle` });
    } catch (error) {
      const customMessage = `${
        isSpecial &&
        error.shortMessage === "execution reverted (unknown custom error)"
          ? "You need other items to produce this"
          : error.shortMessage === "could not coalesce error"
            ? "Try to increase the gas fee"
            : error.shortMessage
      }`;

      dispatch({
        type: "ERROR",
        payload: { value: true, message: customMessage },
      });
      dispatch({ type: "TX_ACTION", payload: `idle` });
    }
  };

  return (
    <div className="relative h-fit w-[400px] flex-shrink-0 overflow-visible rounded-lg border-2 border-fuchsia-500 p-4 text-white shadow-lg">
      <div className="absolute inset-0 z-10 overflow-visible bg-[linear-gradient(to_right,_rgba(217,_70,_239,_0.1),_rgba(217,_70,_239,_0.3))]"></div>
      <div className="relative z-20 flex gap-4 whitespace-normal text-white">
        <img src={imageUrl} className="h-36 w-36" alt="" />
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            #{id} {title}
            {isSpecial && (
              <img
                src={infoIcon}
                onMouseEnter={() => setIsInfoOpen(true)}
                onMouseLeave={() => setIsInfoOpen(false)}
                className="h-6 cursor-pointer"
                alt=""
              />
            )}
            {isInfoOpen && <InfoItemWindow id={id} imageUrl={imageUrl} />}
          </h2>
          <p className="text-md mt-2">{description}</p>
        </div>
      </div>
      <div className="flex items-end justify-between pt-8">
        <p className="text-md -mb-1 font-medium text-white">
          Balance:{" "}
          <span
            className={`text-lg ${
              balance === "0" ? "text-red-500" : "text-green-500"
            }`}
          >
            {balance}
          </span>
        </p>
        <div className="flex items-center gap-2">
          {id >= 3 && (
            <button
              type="button"
              className={`z-10 rounded-lg px-3 py-2 ${txStatus !== "idle" && "cursor-not-allowed"} ${
                balance < 1
                  ? "cursor-not-allowed bg-gray-500 bg-opacity-50"
                  : "bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800"
              }`}
              onClick={() =>
                dispatch({ type: "TX_ACTION", payload: `deleting-${id}` })
              }
              disabled={balance < 1 || txStatus !== "idle"}
            >
              <img src={deleteIcon} className="w-6" alt="" />
            </button>
          )}
          <button
            type="button"
            className={`z-10 rounded-lg px-3.5 py-2.5 ${txStatus !== "idle" && "cursor-not-allowed"} ${
              balance < 1
                ? "cursor-not-allowed bg-gray-500 bg-opacity-50"
                : "bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800"
            }`}
            onClick={() =>
              dispatch({ type: "TX_ACTION", payload: `trading-${id}` })
            }
            disabled={balance < 1 || txStatus !== "idle"}
          >
            <img src={tradeIcon} className="w-5" alt="" />
          </button>
          <button
            type="button"
            className={`relative z-30 flex items-center justify-center gap-2 text-white ${
              txStatus !== "idle" && "cursor-not-allowed"
            } ${
              !isMintAllowed && !isSpecial && !isLoadingCooldown
                ? "cursor-not-allowed bg-gray-500 bg-opacity-50"
                : "bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800"
            } text-md rounded-lg px-3 py-2 text-center font-medium`}
            onClick={handleOrderItem}
            disabled={
              (!isMintAllowed && !isSpecial && !isLoadingCooldown) ||
              txStatus !== "idle"
            }
          >
            {!isSpecial ? (
              <>
                <img src={orderIcon} className="w-6" alt="" />
                {txStatus === `ordering-${id}`
                  ? "Ordering"
                  : !isMintAllowed && !isLoadingCooldown
                    ? "Cooldown"
                    : "Order item"}
              </>
            ) : (
              <>
                <img src={produceIcon} className="w-6" alt="" />
                {txStatus === `ordering-${id}` ? "Producing" : "Produce"}
              </>
            )}

            {!isMintAllowed && !isSpecial && !isLoadingCooldown && (
              <p className="">
                <span className="font-medium text-red-500">
                  {cooldownRemaining}s
                </span>
              </p>
            )}
            {txStatus === `ordering-${id}` && (
              <img src={orderLoading} className="h-4 animate-spin"></img>
            )}
          </button>
        </div>
      </div>
      {txStatus === `trading-${id}` && (
        <TradeWindow
          id={id}
          onClose={() => dispatch({ type: "TX_ACTION", payload: `idle` })}
          title={title}
          imageUrl={imageUrl}
        />
      )}
      {txStatus === `deleting-${id}` && (
        <DeleteWindow
          id={id}
          onClose={() => dispatch({ type: "TX_ACTION", payload: `idle` })}
          title={title}
          imageUrl={imageUrl}
        />
      )}
      {error.value === true && (
        <ErrorWindow
          onClose={() =>
            dispatch({ type: "ERROR", payload: { value: false, message: "" } })
          }
        />
      )}
    </div>
  );
}

export default Item;
